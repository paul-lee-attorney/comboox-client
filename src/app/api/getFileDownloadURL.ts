import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase';

async function getFileDownloadURL(filePath: string): Promise<string | undefined>{

  try {
    const storageRef = ref(storage, filePath);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error: any) {
    if (error.code === 'storage/object-not-found') {
      // 文件不存在
      return undefined;
    } else {
      throw error;
    }
  }
}

export { getFileDownloadURL };
