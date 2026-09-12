export const ROUTES = Object.freeze({
  home: '/screen-protectors',
  products: '/screen-protectors/compare',
  guides: '/screen-protectors/guides',
  prices: '/screen-protectors/guides/price-differences',
  curves: '/screen-protectors/guides/curved-glass',
  videos: '/screen-protectors/videos',
  calculator: '/screen-protectors/calculator',
  quote: '/screen-protectors/brief',
});
export const CATEGORY_PATH = '/sourcing/mobile-accessories-from-china';
export const INQUIRY_PATH = '/get-a-quote?leadGoal=Product%20Sourcing&industry=Mobile%20Accessories&subcategory=Screen%20protectors&dest=Istanbul%2C%20Turkey&source=screen_protector_planner';
export function pageForPath(path) {
  return Object.keys(ROUTES).find(key => ROUTES[key] === path.replace(/\/$/, ''));
}
