import fs from 'node:fs';
import showdown from 'showdown';

function tryReadFile(fileName, { fallbackValue }) {
  try {
    return fs.readFileSync(fileName, 'utf-8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return fallbackValue;
    }
    throw error;
  }
}

function getSubDirectories(path) {
  return fs.readdirSync(path, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

const converter = new showdown.Converter();

converter.setFlavor('original');
converter.setOption('noHeaderId', true);
converter.setOption('moreStyling', true);
converter.setOption('ghCodeBlocks', true);

function buildContentFile({ sourcePath, destPath }) {
  const infoFilePath = `${sourcePath}/info.json`;
  const entryInfo = JSON.parse(fs.readFileSync(infoFilePath, 'utf-8'))

  const entries = entryInfo.map(({ categoryHeading, hidden = undefined, entries }) => {
    const loadedEntries = entries.map(name => {
      const entryBasePath = `${sourcePath}/${name}`
      let src = tryReadFile(`${entryBasePath}/src.js`, { fallbackValue: null });
      if (src !== null) {
        src = src.trim();
      }

      const manifest = JSON.parse(fs.readFileSync(`${entryBasePath}/manifest.json`, 'utf-8'));
      manifest.summaryHtml = converter.makeHtml(manifest.summary);
      delete manifest.summary;
      return {
        name,
        manifest,
        descriptionHtml: converter.makeHtml(fs.readFileSync(`${entryBasePath}/description.md`, 'utf-8')),
        src,
        test: tryReadFile(`${entryBasePath}/test.js`, { fallbackValue: '' }),
      };
    })

    const res = { categoryHeading, entries: loadedEntries };
    if (hidden) {
      if (sourcePath.includes('nolodash')) {
        // This is because I haven't done the work to render the "this entry is unlisted"
        // message under a no-lodash entry.
        throw new Error('Hiding entries are not supported for nolodash entries.');
      }
      res.hidden = true;
    }
    return res;
  })

  const allRegisteredDirectories = new Set(entryInfo.flatMap(category => category.entries));
  for (const directory of getSubDirectories(sourcePath)) {
    if (!allRegisteredDirectories.has(directory)) {
      throw new Error(`The directory ${sourcePath}/${directory} exists, but it is not registered in ${infoFilePath}.`);
    }
  }

  fs.writeFileSync(destPath, JSON.stringify(entries), 'utf-8');
}

buildContentFile({
  sourcePath: './content/utils',
  destPath: './public/utilsContent.json',
});

buildContentFile({
  sourcePath: './content/nolodash',
  destPath: './public/nolodashContent.json',
});

// Build the no-lodash faq file.
{
  const nolodashFaqText = fs.readFileSync('./content/nolodashFaq.md', 'utf-8');
  const nolodashHtml = converter.makeHtml(nolodashFaqText);
  fs.writeFileSync('./public/nolodashFaq.html', nolodashHtml, 'utf-8');
}
