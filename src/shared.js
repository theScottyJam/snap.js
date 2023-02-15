export function parentPage(route) {
  return route.split('/').slice(0, -1).join('/');
}

/** May return null if the route is invalid. */
export function extractTopLevelPageFromRoute(route) {
  if (route.startsWith('utils')) {
    return 'utils';
  } else if (route.startsWith('nolodash')) {
    return 'nolodash';
  } else {
    return null;
  }
}

/** May return null, if there was no matching entry found. */
export function lookupContentEntryFromRoute(content, route) {
  const topLevelPage = extractTopLevelPageFromRoute(route);

  if (topLevelPage === null) {
    return null;
  }

  const entries = content[topLevelPage].flatMap(category => category.entries);

  for (const entry of entries) {
    if ([topLevelPage, entry.name].join('/') === route) {
      return entry;
    }
  }

  return null;
}
