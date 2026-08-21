export const IMAGES = {
  BASE_URL: "",
  HERO_BG: "/images/hero-gz-nansha-port-1080.jpg",
  JOURNEY_1999: "journey_1999_gz_port.png",
  JOURNEY_2004: "/images/operations/pexels-warehouse-workers-aisle-4487383-v1.webp",
  JOURNEY_2009: "journey_2009_hk_office.png",
  EV_01: "/images/operations/container-loading-forklift-anonymized.jpg",
  EV_02: "ev_export_port_02.png",
  EV_03: "ev_export_port_03.png",
  FURNITURE_01: "hotel_furniture_01.png",
  FURNITURE_02: "hotel_furniture_02.png",
  FURNITURE_03: "hotel_furniture_03.png",
  RAILWAY: "service_railway_express.png",
  PACKING: "service_standard_packing.png",
  KITCHEN_01: "kitchen_zone_01.png",
  KITCHEN_02: "kitchen_zone_02.png",
  KITCHEN_03: "kitchen_zone_03.png",
  FACILITY_SCALE: "/images/operations/warehouse-barcode-scan-candid-v1.webp",
  WAREHOUSE_SCALE: "/images/operations/warehouse-receiving-count-candid-v1.webp",
  AIR_FREIGHT: "/images/operations/container-loaded-anonymized.jpg",
  FACILITY_SORT: "/images/operations/warehouse-quality-inspection-candid-v1.webp",
  FACILITY_TEAM: "/images/operations/pexels-warehouse-workers-aisle-ddnz-vest-v1.webp",
  JOURNEY_2019: "/images/operations/container-loading-forklift-wide-v1.webp",
  ESS_STORAGE: "service_nev_ess_storage.png",
  INSPECTION: "container_loading_inspection.png",
  LOGO_WALL: "brand_logo_wall.png",
  INSIGHTS_BANNER: "Insights_Banner_DDNZ_1779354063012.png",
};

export const getImgUrl = (name: keyof typeof IMAGES) => {
  if (name === 'BASE_URL') return '';
  const imagePath = IMAGES[name];
  return imagePath.startsWith('/') ? imagePath : `${IMAGES.BASE_URL}${imagePath}`;
};
