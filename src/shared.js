export function parentPage(route) {
  return route.split('/').slice(0, -1).join('/');
}

/** May return null if the route is invalid or not related to a utility page. */
export function extractUtilityPageTypeFromRoute(route) {
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
  const utilityPageType = extractUtilityPageTypeFromRoute(route);

  if (utilityPageType === null) {
    return null;
  }

  const entries = content[utilityPageType].flatMap(
    category => category.entries
  );

  for (const entry of entries) {
    if ([utilityPageType, entry.name].join('/') === route) {
      return entry;
    }
  }

  return null;
}
