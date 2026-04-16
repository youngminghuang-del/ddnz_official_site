export const IMAGES = {
  BASE_URL: "https://raw.githubusercontent.com/youngminghuang-del/ddnz_photo_assets/main/",
  HERO_BG: "hero_gz_nansha_port.png",
  JOURNEY_1999: "journey_1999_gz_port.png",
  JOURNEY_2004: "journey_2004_warehouse.png",
  JOURNEY_2009: "journey_2009_hk_office.png",
  EV_01: "ev_export_port_01.png",
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
  FACILITY_SCALE: "facility_warehouse_automation.png",
  FACILITY_SORT: "facility_warehouse_sorting.png",
  FACILITY_TEAM: "facility_warehouse_team.png",
  JOURNEY_2019: "team_meeting_professional.png",
  ESS_STORAGE: "service_nev_ess_storage.png",
  LOGO_WALL: "brand_logo_wall.png",
};

export const getImgUrl = (name: keyof typeof IMAGES) => {
  if (name === 'BASE_URL') return '';
  return `${IMAGES.BASE_URL}${IMAGES[name]}`;
};
