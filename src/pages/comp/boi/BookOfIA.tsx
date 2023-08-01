import { useEffect, useState } from "react";

import {
  Button, 
  Paper, 
  Toolbar,
  TextField,
  Stack,
  Typography,
} from "@mui/material";

import { useComBooxContext } from "../../../scripts/ComBooxContext";

import { Create } from "@mui/icons-material";

import { 
  useGeneralKeeperCreateIa, 
} from "../../../generated";

import { InfoOfFile, getFilesListWithInfo } from "../../../queries/filesFolder";
import { GetFilesList } from "../../../components/common/fileFolder/GetFilesList";
import { AddrZero } from "../../../interfaces";
import { CopyLongStrSpan } from "../../../components/common/utils/CopyLongStr";

function BookOfIA() {
  const { gk, boox } = useComBooxContext();

  const [ filesInfoList, setFilesInfoList ] = useState<InfoOfFile[]>();

  const [ version, setVersion ] = useState<string>('1');

  const {
    isLoading: createIaLoading, 
    write: createIa,
  } = useGeneralKeeperCreateIa({
    address: gk,
    args: version ? [BigInt(version)] : undefined,
  });

  useEffect(()=>{
    if (boox) {
      getFilesListWithInfo(boox[6]).then(
        list => setFilesInfoList(list)
      )
    }
  }, [boox, createIa]);

  return (
    <>
      <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >
        <Stack direction='row' sx={{ alignContent:'space-between' }}>

          <Toolbar sx={{ textDecoration:'underline' }}>
            <h3>BOI - Book Of Investment Agreements</h3>
          </Toolbar>

          {/* <Typography sx={{ ml: 10 }}>
            <h4>(Addr: {(boox ? boox[6] : AddrZero).toLowerCase()})</h4>
          </Typography> */}

          {boox && (
            <CopyLongStrSpan title="Addr" size="body1" src={boox[6].toLowerCase()} />
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

                    <Button 
                      disabled={createIaLoading}
                      sx={{ m: 1, minWidth: 120, height: 40 }} 
                      variant="contained" 
                      endIcon={ <Create /> }
                      onClick={() => createIa?.() }
                      size='small'
                    >
                      Create IA
                    </Button>

                </Stack>
              </td>
            </tr>

            <tr>
              <td colSpan={4}>
                {filesInfoList && filesInfoList.length > 0 && (
                  <GetFilesList 
                    list={ filesInfoList } 
                    title="Investment Agreements List" 
                    pathName="/comp/boi/Ia" 
                    pathAs="/comp/boi/ia" 
                  />
                )}
                                
              </td>
            </tr>
          </tbody>

        </table>

      </Paper>
    </>
  );
} 

export default BookOfIA;