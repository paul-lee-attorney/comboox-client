import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { useEffect, useState } from "react";
import { longSnParser } from "../../../common/toolsKit";
import { downloadAndDecryptFile, getFileDownloadURL } from "../../../../api/firebase/fileDownloadTools";
import { Button, Dialog, DialogActions, DialogContent, IconButton, Tooltip } from "@mui/material";
import { CloudDownloadOutlined } from "@mui/icons-material";
import { Motion, getTypeOfMotion } from "../meetingMinutes";
import { useWalletClient } from "wagmi";
import { verifySig } from "../../../../api/firebase";
import { getMyUserNo } from "../../../rc";
import { isMember } from "../../rom/rom";
import { booxMap } from "../../../common";

export interface FileIndexProps {
  motion: Motion,
}

function FileIndex({motion}: FileIndexProps) {

  const { compInfo, boox, gk, setErrMsg } = useComBooxContext();

  const [url, setUrl] = useState<string>('');
  const [filePath, setFilePath] = useState<string>('');

  const [ open, setOpen ] = useState(false);
  const [ downloadURL, setDownloadURL ] = useState('');

  useEffect(()=>{
    
    const checkFile = async () => {

      if (!compInfo || !motion ) return;

      let filePath = '';

      filePath += compInfo && compInfo.regNum 
          ? longSnParser(compInfo.regNum.toString()) + '/'
          : '0000/';  
      filePath += getTypeOfMotion(motion);
      filePath += longSnParser(motion.body.proposer.toString()) + '/';
      filePath += longSnParser(motion.head.seqOfMotion.toString()) + '/';
      filePath += motion.contents.toString(16).padStart(64, '0').substring(54).toLowerCase() + '.pdf';
    
      setFilePath(filePath);
      console.log('filePath: ', filePath);

      let uri = await getFileDownloadURL(filePath);
      if (uri) setUrl(uri);

      console.log('uri: ', uri);
    }

    checkFile();
  }, [compInfo, motion]);

  const { data: signer } = useWalletClient();

  const handleDownload = async () => {
    // request filer sign the docHash
    if (!signer || !url || !boox || !gk) return;
    let sig = await signer.signMessage({message: url});
    let filerInfo = {
        address: signer.account.address,
        message: url,
        sig: sig,
    };
    
    if (!verifySig(filerInfo)) {
      setErrMsg('Sig Not Verified.');
      return;
    }

    let myNo = await getMyUserNo(signer.account.address);

    if (!myNo) {
      setErrMsg('UserNo Not Obtained!');
      return;      
    };
    console.log('myNo: ', myNo);    

    let flag = await isMember(boox[booxMap.ROM], myNo);
    
    if (!flag) {
      setErrMsg('Not Member.');
      return;
    }

    const decryptedURL = await downloadAndDecryptFile(filePath, gk);
    if (decryptedURL.length > 0) {
      setDownloadURL(decryptedURL);
      setOpen(true);
    }

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

      <Dialog
        maxWidth={false}
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="dialog-title"        
      >

        <DialogContent>
          <iframe src={downloadURL} width='100%' />
        </DialogContent>

        <DialogActions>
          <Button variant='outlined' sx={{ m:1, mx:3 }} onClick={()=>setOpen(false)}>Close</Button>
        </DialogActions>

      </Dialog>

    </>
  );

}

export default FileIndex;