import { useEffect, useState } from "react";

import {
  Button, 
  Paper, 
  Toolbar,
  TextField,
  Stack,
} from "@mui/material";

import { useComBooxContext } from "../../../scripts/ComBooxContext";

import { Create } from "@mui/icons-material";

import { 
  useGeneralKeeperCreateIa, 
  usePrepareGeneralKeeperCreateIa,
} from "../../../generated";
import { BigNumber } from "ethers";

import { InfoOfFile, getFilesListWithInfo } from "../../../queries/filesFolder";
import { GetFilesList } from "../../../components/common/fileFolder/GetFilesList";

function BookOfIA() {
  const { gk, boox } = useComBooxContext();

  const [ filesInfoList, setFilesInfoList ] = useState<InfoOfFile[]>();

  const [ version, setVersion ] = useState<string>();
  const { config } = usePrepareGeneralKeeperCreateIa({
    address: gk,
    args: version ? [BigNumber.from(version)] : undefined,
  });
  const {
    isLoading: createIaLoading, 
    write: createIa,
  } = useGeneralKeeperCreateIa({
    ...config,
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
        <Toolbar>
          <h3>BOA - Book Of Investment Agreements</h3>
        </Toolbar>

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
                      disabled={!createIa || createIaLoading}
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
                    pathName="/comp/boa/Ia" 
                    pathAs="/comp/boa/ia" 
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