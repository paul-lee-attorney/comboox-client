
import React, { useState, ChangeEvent, useEffect, } from 'react';
import { getDownloadURL } from 'firebase/storage';

import { styled } from '@mui/material/styles';
import { Box, Button, Dialog, DialogActions, DialogContent, LinearProgress, LinearProgressProps, Stack, Typography,  } from '@mui/material';
import { CloudDownload, CloudUpload, } from '@mui/icons-material';
import { useComBooxContext } from '../../../_providers/ComBooxContextProvider';
import { longSnParser } from '../../common/toolsKit';

import { useWalletClient } from 'wagmi';
import { encryptFile, verifySig } from '../../../api/firebase';
import { getMyUserNo } from '../../rc';
import { CheckFilerFunc } from './FileUpload';
import { downloadAndDecryptFile, getFileDownloadURL } from '../../../api/firebase/fileDownloadTools';
import { updateFileMetadata, uploadFileAsBytesResumable } from '../../../api/firebase/fileUploadTools';

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

  const { compInfo, gk, setErrMsg } = useComBooxContext();
  const { data: signer } = useWalletClient();

  const [progress, setProgress] = useState<number>(0);
  const [url, setUrl] = useState<string>('');

  const [ filePath, setFilePath ] = useState('');

  const [ open, setOpen ] = useState(false);
  const [ downloadURL, setDownloadURL ] = useState('');

  useEffect(()=>{

    const updateFilePath = async ()=> {
      if (!signer || !compInfo || !seqOfMotion || !typeOfMotion || !contents) return;

      let myNo = await getMyUserNo(signer.account.address);

      if (!myNo) {
        setErrMsg('UserNo Not Detected!');
        return;
      }

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

  }, [signer, compInfo, seqOfMotion, typeOfMotion, contents, setErrMsg]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    let file = e.target.files[0];    
    console.log('file: ', file.name);

    // create hash of file
    const fileBuffer = await file.arrayBuffer();
    const fileUint8Buffer = new Uint8Array(fileBuffer);

    if (!gk) {
      setErrMsg('General Keeper Not Retrieved');
      return;
    }

    const fileEncrypted = encryptFile(fileUint8Buffer, gk, gk);
    
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
    if (!await checkProposer(signer)) {
      setErrMsg('Not Proposer!');      
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
      if (!signer || !url || !gk) return;
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

      // check the condition of filer
      if (!await checkProposer(signer)) {
        setErrMsg('Not Proposer!');
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

export default MotionUpDownLoad;