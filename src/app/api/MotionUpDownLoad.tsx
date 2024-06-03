
import React, { useState, ChangeEvent, useEffect, } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, updateMetadata } from 'firebase/storage';
import { storage } from '../../../firebase';

import { styled } from '@mui/material/styles';
import { Box, Button, Divider, LinearProgress, LinearProgressProps, Stack, Typography,  } from '@mui/material';
import { CloudDownload, CloudUpload, } from '@mui/icons-material';
import { useComBooxContext } from '../_providers/ComBooxContextProvider';
import { longSnParser } from '../app/common/toolsKit';
import crypto from 'crypto';
import { getFileDownloadURL } from './getFileDownloadURL';
import { useWalletClient } from 'wagmi';
import { verifySig } from '.';
import { getMyUserNo } from '../app/rc';
import { CheckFilerFunc } from './FileUpload';

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

export interface MotionUpDownLoadProps {
  seqOfMotion: string,
  typeOfMotion: string,
  contents: string,
  checkProposer: CheckFilerFunc, 
}

function MotionUpDownLoad({seqOfMotion, typeOfMotion, contents, checkProposer}: MotionUpDownLoadProps) {

  const { compInfo } = useComBooxContext();
  const { data: signer } = useWalletClient();

  const [progress, setProgress] = useState<number>(0);
  const [url, setUrl] = useState<string>('');

  const [ filePath, setFilePath ] = useState('');

  useEffect(()=>{

    const updateFilePath = async ()=> {
      if (!signer || !compInfo || !seqOfMotion || !typeOfMotion || !contents) return;

      let myNo = await getMyUserNo(signer.account.address);

      if (!myNo) return;

      let str = '';
    
      str += compInfo.regNum 
          ? longSnParser(compInfo.regNum.toString()) + '/'
          : '0000/';
            
      str += typeOfMotion + '/';
      str += longSnParser(myNo.toString()) + '/';
      str += longSnParser(seqOfMotion) + '/';
      str += contents.substring(54).toLowerCase() + '.pdf'; 

      let uri = await getFileDownloadURL(str);
      if (uri) setUrl(uri);
      else setUrl('');      

      setFilePath(str);
    }

    updateFilePath();

  }, [signer, compInfo, seqOfMotion, typeOfMotion, contents]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    let file = e.target.files[0];    
    console.log('file: ', file.name);

    // create hash of file
    const fileBuffer = await file.arrayBuffer();
    const hash = crypto.createHash('sha256');
    hash.update(new Uint8Array(fileBuffer));
    const fileHash = hash.digest('hex');
    
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
    if (!await checkProposer(signer)) return;

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

  const handleDownload = async () => {
      // request filer sign the docHash
      if (!signer || !url) return;
      let sig = await signer.signMessage({message: url});
      let filerInfo = {
          address: signer.account.address,
          message: url,
          sig: sig,
      };
      
      if (!verifySig(filerInfo)) return;

      // check the condition of filer
      if (!await checkProposer(signer)) return;
      
      window.open(url, '_blank');
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
              width:188
            }}
            color='success'
          >
            Upload File
            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
          </Button>

          {url && (
            <Button 
              variant='outlined' 
              sx={{m:1, width:188, height:40}}
              color='success' 
              startIcon={<CloudDownload />}
              onClick={handleDownload}
            >
              Download File
              {/* <a href={url} target="_blank" rel="noopener noreferrer">Download File</a> */}
            </Button>
          )}

        </Stack>

        <LinearProgressWithLabel value={progress}  />

      </Stack>


    </Box>
  );

}

export default MotionUpDownLoad;