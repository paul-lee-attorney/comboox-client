
import { FullMetadata, ref, SettableMetadata, StringFormat, updateMetadata, uploadBytes, uploadBytesResumable, UploadResult, uploadString, UploadTask } from "firebase/storage";
import { storage } from './firebase';

export async function uploadFileAsBytes(filePath:string, data:Blob | Uint8Array | ArrayBuffer): Promise<UploadResult> {
  const fileRef = ref(storage, filePath);

  try {
    const uploadResult = await uploadBytes(fileRef, data);
    return uploadResult;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export async function uploadFileAsString(filePath:string, data:string, format?:StringFormat): Promise<UploadResult> {
  const fileRef = ref(storage, filePath);

  try {
    const uploadResult = await uploadString(fileRef, data, format);
    return uploadResult;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export function uploadFileAsBytesResumable(filePath:string, data:Blob | Uint8Array | ArrayBuffer): UploadTask {
  const fileRef = ref(storage, filePath);

  try {
    const uploadTask = uploadBytesResumable(fileRef, data);
    return uploadTask;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export async function updateFileMetadata(filePath:string, metadata: SettableMetadata): Promise<FullMetadata> {
  const fileRef = ref(storage, filePath);

  try {
    const fullMetadata = await updateMetadata(fileRef, metadata);
    return fullMetadata;
  } catch (error) {
    console.error("Error update metadata:", error);
    throw error;
  }
};

