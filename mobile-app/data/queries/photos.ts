import { axiosClient } from "@/api/axios-client";
import type { ApiResponse } from "@/types/auth";
import type {
  CreatePhotoUploadSasRequest,
  PhotoUploadSasResponse,
  UploadPhotoFromUriRequest,
} from "@/types/photos";

async function createPhotoUploadSasQuery(
  request: CreatePhotoUploadSasRequest,
): Promise<PhotoUploadSasResponse> {
  const response = await axiosClient.post<ApiResponse<PhotoUploadSasResponse>>(
    "/users/me/photos/upload-sas",
    request,
  );

  return response.data.data;
}

async function createPhotoBlob(uri: string): Promise<Blob> {
  const response = await fetch(uri);

  if (!response.ok) {
    throw new Error(`Cannot read selected image. Status: ${response.status}`);
  }

  return response.blob();
}

async function uploadPhotoToBlobStorage(
  sasResponse: PhotoUploadSasResponse,
  photoBlob: Blob,
): Promise<void> {
  const response = await fetch(sasResponse.uploadUrl, {
    body: photoBlob,
    headers: sasResponse.requiredHeaders,
    method: "PUT",
  });

  if (!response.ok) {
    const responseBody: string = await response.text();
    throw new Error(
      `Azure Blob upload failed. Status: ${response.status}. Body: ${responseBody}`,
    );
  }
}

export async function uploadPhotoFromUriQuery(
  request: UploadPhotoFromUriRequest,
): Promise<string> {
  const sasResponse: PhotoUploadSasResponse = await createPhotoUploadSasQuery({
    contentType: request.contentType,
    fileName: request.fileName,
    fileSizeInBytes: request.fileSizeInBytes,
  });
  const photoBlob: Blob = await createPhotoBlob(request.uri);

  await uploadPhotoToBlobStorage(sasResponse, photoBlob);

  return sasResponse.blobUrl;
}
