export interface CreatePhotoUploadSasRequest {
  contentType: string;
  fileName: string;
  fileSizeInBytes: number;
}

export interface PhotoUploadSasResponse {
  blobName: string;
  blobUrl: string;
  expiresOn: string;
  requiredHeaders: Record<string, string>;
  uploadUrl: string;
}

export interface UploadPhotoFromUriRequest {
  contentType: string;
  fileName: string;
  fileSizeInBytes: number;
  uri: string;
}
