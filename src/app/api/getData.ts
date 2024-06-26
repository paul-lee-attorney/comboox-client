import { db } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { SigInfo, UserInfo, decryptUserInfo, encrypt, verifySig } from '.';
import { AddrZero, HexType } from '../app/common';


export default async function getUserData(gk: HexType, addr: HexType): Promise<UserInfo | undefined> {

      const key = addr.substring(2, 18);
      const iv = gk.substring(2, 18);

      let encryptedAddr = `0x${encrypt(addr, key, iv)}`;

      // 获取特定文档
      const docRef = doc(db, gk, encryptedAddr);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        
        let info = {...docSnap.data()} as UserInfo;

        info.gk = gk;
        info.address = addr;

        info = decryptUserInfo(info);

        let objInfo = {...info, sig: ''};

        let testInfo:SigInfo = {
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
