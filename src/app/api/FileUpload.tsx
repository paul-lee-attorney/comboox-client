
import React, { useState, ChangeEvent, useEffect, Dispatch, SetStateAction } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, updateMetadata } from 'firebase/storage';
import { storage } from '../../../firebase';

import { styled } from '@mui/material/styles';
import { Box, Button, Divider, LinearProgress, LinearProgressProps, Stack, Typography,  } from '@mui/material';
import { CloudDownload, CloudUpload, } from '@mui/icons-material';
import { HexType, booxMap } from '../app/common';
import { useComBooxContext } from '../_providers/ComBooxContextProvider';
import { longSnParser } from '../app/common/toolsKit';
import crypto from 'crypto';
import { getFileDownloadURL } from './getFileDownloadURL';
import { useWalletClient } from 'wagmi';
import { GetWalletClientResult } from '@wagmi/core';
import { verifySig } from '.';
import { getMyUserNo } from '../app/rc';
import { isMember } from '../app/comp/rom/rom';

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

  const { compInfo } = useComBooxContext();
  const { data: signer } = useWalletClient();

  const [progress, setProgress] = useState<number>(0);
  const [url, setUrl] = useState<string>('');
  const [ filePath, setFilePath ] = useState('');

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

    // create hash of file
    const fileBuffer = await file.arrayBuffer();
    const hash = crypto.createHash('sha256');
    hash.update(new Uint8Array(fileBuffer));
    const fileHash = hash.digest('hex');
    setDocHash(`0x${fileHash}`);
    
    // request filer sign the docHash
    if (!signer) return;
    let sig = await signer.signMessage({message: fileHash});
    let filerInfo = {
      customMetadata: {
        filer: signer.account.address,
        docHash: fileHash,
        sig: sig,
      }
    };

    // check the condition of filer
    if (!await checkFiler(signer)) return;

    // prepare for upload
    const storageRef = ref(storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // upload
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
        updateMetadata(storageRef, filerInfo).then((metadata) => {
          console.log('metadata: ', metadata);
        });
      }
    );    
  }

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
      
    </Box>
  );

}

export default FileUpload;