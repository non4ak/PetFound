import { axiosClient } from '@/api/axios-client';
import type { ApiResponse } from '@/types/auth';
import type { CreatePetRequest, Pet } from '@/types/pet';

export async function getMyPetsQuery(): Promise<Pet[]> {
  const response = await axiosClient.get<ApiResponse<Pet[]>>('/users/me/pets');
  return response.data.data;
}

export async function createPetQuery(request: CreatePetRequest): Promise<Pet> {
  const response = await axiosClient.post<ApiResponse<Pet>>('/users/me/pets', request);
  return response.data.data;
}

export async function updatePetQuery(id: number, request: CreatePetRequest): Promise<void> {
  await axiosClient.put(`/users/me/pets/${id}`, request);
}

export async function deletePetQuery(id: number): Promise<void> {
  await axiosClient.delete(`/users/me/pets/${id}`);
}
