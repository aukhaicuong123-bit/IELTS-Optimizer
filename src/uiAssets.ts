const UI_ASSET_BASE = `${import.meta.env.BASE_URL}assets/ielts-ui`

/**
 * Asset paths are kept in one place so the same interface works on the local
 * dev server and on GitHub Pages, where the app is served from /IELTS-Optimizer/.
 */
export function uiSectionAsset(name: string): string {
  return `${UI_ASSET_BASE}/sections/${name}.svg`
}

