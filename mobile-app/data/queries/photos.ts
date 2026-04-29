import { axiosClient } from "@/api/axios-client";
import * as FileSystem from "expo-file-system/legacy";
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

async function getFileSizeInBytes(uri: string, fallbackFileSizeInBytes: number): Promise<number> {
  const fileInfo = await FileSystem.getInfoAsync(uri);

  if (fileInfo.exists && typeof fileInfo.size === "number" && fileInfo.size > 0) {
    return fileInfo.size;
***REMOVED***

  return fallbackFileSizeInBytes;
}

async function uploadPhotoToBlobStorage(
  sasResponse: PhotoUploadSasResponse,
  uri: string,
): Promise<void> {
  const uploadResult = await FileSystem.uploadAsync(sasResponse.uploadUrl, uri, {
    headers: sasResponse.requiredHeaders,
    httpMethod: "PUT",
    uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
***REMOVED***);

  if (uploadResult.status < 200 || uploadResult.status >= 300) {
    throw new Error(
      `Azure Blob upload failed. Status: ${uploadResult.status}. Body: ${uploadResult.body}`,
    );
***REMOVED***
}

export async function uploadPhotoFromUriQuery(
  request: UploadPhotoFromUriRequest,
): Promise<string> {
  const fileSizeInBytes: number = await getFileSizeInBytes(
    request.uri,
    request.fileSizeInBytes,
  );
  const sasResponse: PhotoUploadSasResponse = await createPhotoUploadSasQuery({
    contentType: request.contentType,
    fileName: request.fileName,
    fileSizeInBytes,
***REMOVED***);

  await uploadPhotoToBlobStorage(sasResponse, request.uri);

  return sasResponse.blobUrl;
}
