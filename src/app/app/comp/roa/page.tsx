"use client"

import { useEffect, useState } from "react";

import {
  Paper, 
  TextField,
  Stack,
  Typography,
} from "@mui/material";


import { Create } from "@mui/icons-material";

import { useGeneralKeeperCreateIa } from "../../../../../generated";

import { InfoOfFile, getFilesListWithInfo } from "../roc/components/filesFolder";

import { GetFilesList } from "../roc/components/GetFilesList";
import { CopyLongStrSpan } from "../../common/CopyLongStr";
import { IndexCard } from "../roc/components/IndexCard";
import { HexType, booxMap } from "../../common";
import { refreshAfterTx } from "../../common/toolsKit";

import { LoadingButton } from "@mui/lab";
import { useComBooxContext } from "../../../_providers/ComBooxContextProvider";

function RegisterOfAgreements() {
  const { gk, boox, setErrMsg } = useComBooxContext();
  const [ time, setTime ] = useState(0);
  const [ loading, setLoading ] = useState(false);

  const refresh = ()=>{
    setTime(Date.now());
    setLoading(false);
  }

  const [ filesInfoList, setFilesInfoList ] = useState<InfoOfFile[]>();

  const [ version, setVersion ] = useState<string>('1');

  const {
    isLoading: createIaLoading, 
    write: createIa,
  } = useGeneralKeeperCreateIa({
    address: gk,
    onError(err){
      setErrMsg(err.message);
    },
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }
  });

  const handleClick = ()=>{
    createIa({
      args: [BigInt(version)],
    });
  };

  useEffect(()=>{
    if (boox) {
      getFilesListWithInfo(boox[booxMap.ROA]).then(
        list => setFilesInfoList(list)
      )
    }
  }, [boox, time]);

  const [ file, setFile ] = useState<InfoOfFile>();
  const [ open, setOpen ] = useState<boolean>(false);

  return (
    <>
      <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >
        <Stack direction='row' sx={{ alignContent:'space-between' }}>

          <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
            <b>ROA - Register Of Agreements</b>
          </Typography>

          {boox && (
            <CopyLongStrSpan title="Addr"  src={boox[booxMap.ROA].toLowerCase()} />
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
                      helperText="Integer <= 2^16 (e.g. '123')"
                      onChange={(e) => 
                        setVersion(e.target.value)
                      }
                      value = { version }
                      size='small'
                    />

                    <LoadingButton 
                      disabled={createIaLoading}
                      loading={loading}
                      loadingPosition="end"
                      sx={{ m: 1, minWidth: 120, height: 40 }} 
                      variant="contained" 
                      endIcon={ <Create /> }
                      onClick={ handleClick }
                      size='small'
                    >
                      Create IA
                    </LoadingButton>

                </Stack>
              </td>
            </tr>

            <tr>
              <td colSpan={4}>
                {filesInfoList && (
                  <GetFilesList 
                    list={ filesInfoList } 
                    title="Agreements List" 
                    pathName="/app/comp/roa/ia" 
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
    </>
  );
} 

export default RegisterOfAgreements;