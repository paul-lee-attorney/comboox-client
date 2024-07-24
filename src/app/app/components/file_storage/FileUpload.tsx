
import React, { useState, ChangeEvent, useEffect, Dispatch, SetStateAction } from 'react';

import { styled } from '@mui/material/styles';
import { Box, Button, Dialog, DialogActions, DialogContent, LinearProgress, LinearProgressProps, Stack, Typography,  } from '@mui/material';
import { CloudDownload, CloudUpload, } from '@mui/icons-material';
import { HexType, booxMap } from '../../common';
import { useComBooxContext } from '../../../_providers/ComBooxContextProvider';
import { longSnParser } from '../../common/toolsKit';
import { downloadAndDecryptFile, getFileDownloadURL } from '../../../api/firebase/fileDownloadTools';
import { useWalletClient } from 'wagmi';
import { GetWalletClientResult } from '@wagmi/core';
import { encryptFile, verifySig } from '../../../api/firebase';
import { getMyUserNo } from '../../rc';
import { isMember } from '../../comp/rom/rom';
import { updateFileMetadata, uploadFileAsBytesResumable } from '../../../api/firebase/fileUploadTools';
import { getDownloadURL } from 'firebase/storage';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">
          {`${Math.round(props.value,)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

export interface CheckFilerFunc {
  (filer:GetWalletClientResult):Promise<boolean>;
}

export interface FileUploadProps {
  typeOfFile: string,
  addrOfFile: HexType,
  setDocHash: Dispatch< SetStateAction< HexType | undefined>>, 
  checkFiler: CheckFilerFunc, 
}

function FileUpload({typeOfFile, addrOfFile, setDocHash, checkFiler}: FileUploadProps) {

  const { compInfo, gk, boox, setErrMsg } = useComBooxContext();
  const { data: signer } = useWalletClient();

  const [ progress, setProgress ] = useState<number>(0);
  const [ url, setUrl ] = useState<string | undefined>();
  const [ filePath, setFilePath ] = useState('');

  const [ open, setOpen ] = useState(false);
  const [ downloadURL, setDownloadURL ] = useState('');

  useEffect(()=>{

    const updateFilePath = async () => {

      let str = '';

      str += compInfo && compInfo.regNum 
          ? longSnParser(compInfo.regNum.toString()) + '/'
          : '0000/';  
      
      str += typeOfFile + '/';
      str += addrOfFile.substring(2,7).toLowerCase() + addrOfFile.substring(37).toLowerCase() + '.pdf';
      
      setFilePath(str);
    }

    updateFilePath();
  }, [compInfo, typeOfFile, addrOfFile ]);

    
  useEffect(()=>{
    const checkFile = async () => {
      if (!filePath) return;

      let uri = await getFileDownloadURL(filePath);
      if (uri) setUrl(uri);
    }

    checkFile();
  }, [filePath]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    let file = e.target.files[0];    
    console.log('file: ', file.name);

    const fileBuffer = await file.arrayBuffer();
    const fileUint8Buffer = new Uint8Array(fileBuffer);

    if (!gk) {
      setErrMsg('General Keeper Not Retrieved');
      return;
    }

    // encrypt the target file;
    const fileEncrypted = encryptFile(fileUint8Buffer, gk, gk);
    
    setDocHash(`0x${fileEncrypted.docHash}`);
      
    // request filer sign the docHash
    if (!signer) {
      setErrMsg('No Signer Detected!');
      return;
    }
    let sig = await signer.signMessage({message: fileEncrypted.docHash});
    let filerInfo = {
      customMetadata: {
        filer: signer.account.address,
        docHash: fileEncrypted.docHash,
        sig: sig,
      }
    };

    // check the condition of filer
    if (!await checkFiler(signer)) {
      setErrMsg('Filer Not Qualified!');      
      return;
    }

    const uploadTask = uploadFileAsBytesResumable(filePath, fileEncrypted.docData);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error("Upload failed", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUrl(downloadURL);
        });
        updateFileMetadata(filePath, filerInfo).then((metadata) => {
          console.log('metadata: ', metadata);
        });
      }
    );
  }

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

    <Box sx={{width:500, mb:2 }}>

      <Stack direction='column' >

        <Stack direction='row' >      

          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUpload />}
            sx={{
              m:1,
              width:218
            }}
            color='success'
          >
            Upload File
            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
          </Button>

          {url && 
            <Button 
              variant='outlined' 
              sx={{m:1, width:218, height:40}}
              color='success' 
              startIcon={<CloudDownload />}
              onClick={handleDownload}
            >
              Download File
            </Button>
          }

        </Stack>

        <LinearProgressWithLabel value={progress}  />

      </Stack>

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
      
    </Box>
  );

}

export default FileUpload;