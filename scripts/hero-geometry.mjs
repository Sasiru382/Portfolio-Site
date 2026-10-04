/* global document, NodeFilter, getComputedStyle */
// Runs in the browser: document overflow alone cannot detect overflow:hidden clipping.
export function heroGeometry() {
  const map = document.querySelector('.system-map');
  const heading = document.querySelector('.hero h1');
  if (!map || !heading) throw new Error('Missing hero diagram or heading');
  const issues = [];
  const tolerance = 1;
  const contains = (outer, inner) => inner.left >= outer.left - tolerance &&
    inner.right <= outer.right + tolerance && inner.top >= outer.top - tolerance &&
    inner.bottom <= outer.bottom + tolerance;
  const bounds = map.getBoundingClientRect();
  for (const element of map.querySelectorAll('*')) {
    if (!contains(bounds, element.getBoundingClientRect())) issues.push(`diagram child outside figure: ${element.className || element.tagName}`);
    if (element.scrollWidth > element.clientWidth + tolerance) issues.push(`diagram internal overflow: ${element.className || element.tagName}`);
  }
  for (const root of [map, heading]) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!node.textContent.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const rect of range.getClientRects()) {
        const rootBounds = root.getBoundingClientRect();
        // Heading glyph boxes may extend vertically beyond their line-height.
        const fits = root === heading
          ? rect.left >= rootBounds.left - tolerance && rect.right <= rootBounds.right + tolerance
          : contains(rootBounds, rect);
        if (!fits) issues.push(`text outside ${root.tagName}: ${node.textContent.trim()}`);
        const layer = node.parentElement.closest('.map-layer');
        if (layer && !contains(layer.getBoundingClientRect(), rect)) issues.push(`text outside layer: ${node.textContent.trim()}`);
      }
    }
  }
  return {
    viewport: document.documentElement.clientWidth,
    grid: getComputedStyle(document.querySelector('.hero')).gridTemplateColumns,
    diagramWidth: bounds.width,
    issues,
  };
}
