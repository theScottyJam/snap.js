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

/**
 * May return null if there was no matching entry found.
 * If a content entry is returned, it will have an additional
 * "hidden" property, indicating if the entry is intended
 * to be unlisted.
 */
export function lookupContentEntryFromRoute(content, route) {
  const utilityPageType = extractUtilityPageTypeFromRoute(route);

  if (utilityPageType === null) {
    return null;
  }

  for (const category of content[utilityPageType]) {
    for (const entry of category.entries) {
      if ([utilityPageType, entry.name].join('/') === route) {
        return { ...entry, hidden: category.hidden };
      }
    }
  }

  return null;
}
