import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { useEffect, useState } from "react";
import { longSnParser } from "../../../common/toolsKit";
import { getFileDownloadURL } from "../../../../api/getFileDownloadURL";
import { IconButton, Tooltip } from "@mui/material";
import { CloudDownloadOutlined } from "@mui/icons-material";
import { Motion, getTypeOfMotion } from "../meetingMinutes";
import { useWalletClient } from "wagmi";
import { verifySig } from "../../../../api";
import { getMyUserNo } from "../../../rc";
import { isMember } from "../../rom/rom";
import { booxMap } from "../../../common";

export interface FileIndexProps {
  motion: Motion,
}

function FileIndex({motion}: FileIndexProps) {

  const { compInfo } = useComBooxContext();

  const [url, setUrl] = useState<string>('');
    
  useEffect(()=>{
    
    const checkFile = async () => {

      if (!compInfo || !motion ) return;

      let filePath = '';

      filePath += compInfo && compInfo.regNum 
          ? longSnParser(compInfo.regNum.toString()) + '/'
          : '0000/';  
      filePath += getTypeOfMotion(motion);
      filePath += longSnParser(motion.body.proposer.toString()) + '/';  
      filePath += motion.contents.toString(16).padStart(64, '0').substring(54).toLowerCase() + '.pdf';
    
      console.log('filePath: ', filePath);

      let uri = await getFileDownloadURL(filePath);
      if (uri) setUrl(uri);

      console.log('uri: ', uri);
    }

    checkFile();
  }, [compInfo, motion]);

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
            <IconButton size="large" sx={{m:1, ml:3}} color="primary" onClick={handleDownload}>
              <CloudDownloadOutlined />
            </IconButton>
        </Tooltip>
      )}
    </>
  );

}

export default FileIndex;