// Site override of the Toha theme's KaTeX loader (same path, so Hugo uses this
// file instead of the theme's). Identical except that it restores
// `ignoredClasses`: Hugo lowercases config keys, so `ignoredClasses` from
// hugo.yaml arrives as `ignoredclasses`, which KaTeX would silently ignore.
import renderMathInElement from 'katex/contrib/auto-render'
import * as params from '@params'

const defaultOptions = {
  delimiters: [
    { left: '$$', right: '$$', display: true },
    { left: '\\[', right: '\\]', display: true },
    { left: '$', right: '$', display: false },
    { left: '\\(', right: '\\)', display: false }
  ]
}

const siteOptions = { ...(params.math?.katex || {}) }
if (siteOptions.ignoredclasses && !siteOptions.ignoredClasses) {
  siteOptions.ignoredClasses = siteOptions.ignoredclasses
  delete siteOptions.ignoredclasses
}

window.addEventListener('DOMContentLoaded', () => {
  renderMathInElement(document.body, { ...defaultOptions, ...siteOptions })
})
