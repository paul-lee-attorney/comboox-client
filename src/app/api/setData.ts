import { db } from '../../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { SigInfo, UserInfo, encryptUserInfo, verifySig } from '.';

export default async function setUserData(info:UserInfo): Promise<boolean> {

  let objInfo = {...info, sig: ''};

  let testInfo: SigInfo = {
    address: info.address,
    message: JSON.stringify(objInfo, Object.keys(objInfo).sort()),
    sig: info.sig
  }

  if (!verifySig(testInfo)) {
    console.log('userInfo fails to be verified.')
    return false;
  }

  let encryptedInfo = encryptUserInfo(info);
  
  // 创建一个文档引用
  const docRef = doc(db, info.gk, encryptedInfo.address);

  // 使用 set 方法添加或覆盖文档
  await setDoc(docRef, encryptedInfo);
  
  console.log('successfully setDoc: ', encryptedInfo);
  
  return true;
}
