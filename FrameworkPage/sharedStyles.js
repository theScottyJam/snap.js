/** Allows you to apply the font rules to anything, not just headers. */
export const headerStyleMixinRules = `
font-family: 'Questrial', sans-serif;
letter-spacing: 0.05em;
`;

// TODO: It's low-priority, but it would be better to create a helper function
// that automatically mixes together the same core style + additional custom styles.
export const headerStyleMixin = `
  h1, h2, h3, h4, h5 {
    ${headerStyleMixinRules}
  }
`;

export const ICON_BUTTON_BACKGROUND_ON_HOVER = '#eee';
export const ICON_BUTTON_OUTLINE_ON_FOCUS = '1px solid #666';
