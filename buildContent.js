const fs = require('fs')

const entryInfo = JSON.parse(fs.readFileSync('./content/info.json', 'utf-8'))

function loadEntries() {
  return entryInfo.map(({categoryHeading, entries}) => {
    const loadedEntries = entries.map(name => {
      const entryBasePath = `./content/${name}`
      return {
        name,
        manifest: JSON.parse(fs.readFileSync(`${entryBasePath}/manifest.json`, 'utf-8')),
        description: fs.readFileSync(`${entryBasePath}/description.md`, 'utf-8'),
        src: fs.readFileSync(`${entryBasePath}/src.js`, 'utf-8'),
        test: fs.readFileSync(`${entryBasePath}/test.js`, 'utf-8'),
      }
    })
    return {categoryHeading, entries: loadedEntries}
  })
}

function writeEntriesToPublicDir(entries) {
  fs.writeFileSync('./public/content.json', JSON.stringify(entries), 'utf-8')
}

writeEntriesToPublicDir(loadEntries())