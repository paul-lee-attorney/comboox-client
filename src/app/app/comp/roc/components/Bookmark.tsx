import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { HexType, booxMap } from "../../../common";
import { useEffect, useState } from "react";
import { longSnParser } from "../../../common/toolsKit";
import { getFileDownloadURL } from "../../../../api/getFileDownloadURL";
import { IconButton, Tooltip } from "@mui/material";
import { CloudDownloadOutlined } from "@mui/icons-material";
import { useWalletClient } from "wagmi";
import { verifySig } from "../../../../api";
import { getMyUserNo } from "../../../rc";
import { isMember } from "../../rom/rom";

export interface BookmarkProps {
  typeOfFile: string,
  addrOfFile: HexType,
}

function Bookmark({typeOfFile, addrOfFile}: BookmarkProps) {

  const { compInfo } = useComBooxContext();
  const [url, setUrl] = useState<string>('');

  useEffect(()=>{

    const checkFile = async () => {

      if (!compInfo || !typeOfFile || !addrOfFile) return;

      let filePath = '';

      filePath += compInfo && compInfo.regNum 
      ? longSnParser(compInfo.regNum.toString()) + '/'
      : '0000/';  
  
      filePath += typeOfFile + '/';
      filePath += addrOfFile.substring(2,7).toLowerCase() + addrOfFile.substring(37).toLowerCase() + '.pdf';

      let uri = await getFileDownloadURL(filePath);
      if (uri) setUrl(uri);
      
    }

    checkFile();
  }, [compInfo, typeOfFile, addrOfFile]);

  const { data: signer } = useWalletClient();
  const { boox } = useComBooxContext();

  const handleDownload = async () => {
    // request filer sign the docHash
    if (!signer || !url || !boox) return;
    let sig = await signer.signMessage({message: url});
    let filerInfo = {
        address: signer.account.address,
        message: url,
        sig: sig,
    };
    
    if (!verifySig(filerInfo)) return;

    let myNo = await getMyUserNo(signer.account.address);

    if (!myNo) return false;
    console.log('myNo: ', myNo);    

    let flag = await isMember(boox[booxMap.ROM], myNo);
    
    if (flag) window.open(url, '_blank');
    else console.log('not Member');
  }

  return (
    <>
      {url && (
        <Tooltip title='Download File' placement="top" arrow >
            <IconButton size="large" sx={{m:1}} color="primary" onClick={handleDownload}>
              <CloudDownloadOutlined />
            </IconButton>
        </Tooltip>
      )}
    </>
  );

}

export default Bookmark;