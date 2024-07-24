import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { SigInfo, UserInfo, decryptUserInfo, encryptUserInfo, verifySig } from '.';
import { HexType } from '../../app/common';

export async function getUserData(gk: HexType, addr: HexType): Promise<UserInfo | undefined> {

  // 获取特定文档
  const docRef = doc(db, gk.toLowerCase(), addr.toLowerCase());
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    
    let info = {...docSnap.data()} as UserInfo;
    info = decryptUserInfo(info);

    const objInfo = {...info, sig: ''};

    const testInfo:SigInfo = {
        address: addr,
        message: JSON.stringify(objInfo, Object.keys(objInfo).sort()),
        sig: info.sig
    };
  
    if (verifySig(testInfo)) {
      return info;
    } else {
      console.log('info failes to be verified');
      return undefined;
    }
    
  } else {
    console.log("no such user found!");
    return undefined;
  }

}

export async function setUserData(info:UserInfo): Promise<boolean> {

  const objInfo = {...info, sig: ''};

  const testInfo: SigInfo = {
    address: info.address,
    message: JSON.stringify(objInfo, Object.keys(objInfo).sort()),
    sig: info.sig
  }

  if (!verifySig(testInfo)) {
    console.log('userInfo sig not verified.')
    return false;
  }

  const encryptedInfo = encryptUserInfo(info);
  
  // 创建一个文档引用
  const docRef = doc(db, info.gk.toLowerCase(), info.address.toLowerCase());

  // 使用 set 方法添加或覆盖文档
  await setDoc(docRef, encryptedInfo);
  
  console.log('successfully setDoc: ', encryptedInfo);
  
  return true;
}



