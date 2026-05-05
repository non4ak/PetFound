import axiosClient from "@/api/axios-client";
import axios from "axios";
import type { Address, GetAddressRespond } from "@/types/address";

export async function getAddressByCoords(lat: number, lng: number) {
    const response = await axios.get<Address>(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=en`);

    console.log(`API response for coordinates (${lat}, ${lng}):`, response.data); // Debug alert

    return response.data;
}