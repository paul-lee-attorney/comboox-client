"use client"

import { useEffect, useState } from "react";

import { Paper, Toolbar, TextField, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Create } from "@mui/icons-material";

import { useComBooxContext } from "../../../_providers/ComBooxContextProvider";

import { CopyLongStrSpan } from "../../common/CopyLongStr";
import { InfoOfFile, getFilesListWithInfo, } from "./read/filesFolder";
import { GetFilesList } from "./read/GetFilesList";
import { IndexCard } from "./read/IndexCard";
import { HexType, MaxPrice, booxMap } from "../../common";
import { FormResults, defFormResults, hasError, onlyInt, refreshAfterTx } from "../../common/toolsKit";

import { useGeneralKeeperCreateSha } from "../../../../../generated";

function RegisterOfConstitution() {
  const { gk, boox, setErrMsg } = useComBooxContext();
  const [ time, setTime ] = useState(0);
  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const refresh = ()=>{
    setTime(Date.now());
    setLoading(false);
  }

  const [ filesInfoList, setFilesInfoList ] = useState<InfoOfFile[]>();

  const [ version, setVersion ] = useState<string>('1');

  const {
    isLoading: createShaLoading, 
    write: createSha,
  } = useGeneralKeeperCreateSha({
    address: gk,
    onError(err) {
      setErrMsg(err.message);
    },
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }
  });

  const handleClick = ()=>{
    createSha({
      args: [BigInt(version)],
    });
  };

  useEffect(()=>{
    if (boox) {
      getFilesListWithInfo(boox[booxMap.ROC]).then(
        list => setFilesInfoList(list)
      )
    }
  }, [boox, time]);

  const [ file, setFile ] = useState<InfoOfFile>();
  const [ open, setOpen ] = useState<boolean>(false);
  
  return (
    <Paper elevation={3} sx={{alignItems:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >

        <Stack direction='row' sx={{ alignItems:'center' }}>

          <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
            <b>ROC - Register Of Constitution </b> 
          </Typography>

          {boox && (
              <CopyLongStrSpan  title="Addr" src={boox[booxMap.ROC].toLowerCase()} />
          )}

        </Stack>

      <table width={1680} >
        <thead />
        
        <tbody>

          <tr>        
            <td colSpan={2}>
              <Stack 
                  direction={'row'}
                >
                  <TextField 
                    sx={{ m: 1, minWidth: 120 }} 
                    id="tfVersion" 
                    label="Version" 
                    variant="outlined"
                    error={ valid['Version']?.error }
                    helperText={ valid['Version']?.helpTx ?? ' ' }
                    onChange={(e) => {
                      let input = e.target.value;
                      onlyInt('Version', input, MaxPrice, setValid);
                      setVersion(input);
                    }}
                    value = { version }
                    size='small'
                  />

                  <LoadingButton 
                    disabled={ createShaLoading || hasError(valid) }
                    loading = {loading}
                    loadingPosition="end"
                    sx={{ m: 1, minWidth: 120, height: 40 }} 
                    variant="contained" 
                    endIcon={ <Create /> }
                    onClick={ handleClick }
                    size='small'
                  >
                    Create SHA
                  </LoadingButton>
              </Stack>
            </td>
            <td colSpan={2} >
            </td>
          </tr>

          <tr>
            <td colSpan={4}>

              {filesInfoList && (
                <GetFilesList 
                  list={ filesInfoList } 
                  title="SHA List" 
                  pathName="/app/comp/roc/sha" 
                  setFile={setFile}
                  setOpen={setOpen}
                />
              )}

            </td>
          </tr>

          {file && (
            <tr>
              <td colSpan={4}>
                <IndexCard file={file} open={open} setOpen={setOpen}  />
              </td>
            </tr>
          )}
        </tbody>

      </table>

    </Paper>
  );
} 

export default RegisterOfConstitution;