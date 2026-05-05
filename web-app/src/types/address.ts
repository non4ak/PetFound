export type Address = {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    lat: string;
    lon: string;
    class: string;
    type: string;
    place_rank: number;
    importance: number;
    addresstype: string;
    name: string;
    display_name: string;
    address: {
        house_number?: string;
        road?: string;
  ***REMOVED***
}

export interface GetAddressRespond<T> {
    data: T;
    message: string;
}