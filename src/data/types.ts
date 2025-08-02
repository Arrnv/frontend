export type Detail = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  service_category?: { icon_url?: string };
  place_category?: { icon_url?: string };
};
