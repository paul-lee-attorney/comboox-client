import { useState } from "react";

import {
  Button, 
  Paper, 
  Toolbar,
  TextField,
  Stack,
} from "@mui/material";

import { useComBooxContext } from "../../../scripts/ComBooxContext";

import { Create, ReadMoreOutlined, Send } from "@mui/icons-material";

import { 
  useFilesFolderGetFilesList,
  useGeneralKeeperCreateIa, 
  usePrepareGeneralKeeperCreateIa,
} from "../../../generated";
import { BigNumber } from "ethers";
import { GetFilesList } from "../../../components";
import { InfoOfFile, getFilesListWithInfo } from "../boh/bookOfSHA";
import { LoadingButton } from "@mui/lab";

function BookOfIA() {
  const { gk, boox } = useComBooxContext();

  const [ loading, setLoading ] = useState<boolean>();
  const [ filesInfoList, setFilesInfoList ] = useState<InfoOfFile[]>();
  const {
    refetch: getFilesList,
  } = useFilesFolderGetFilesList({
    address: boox[1],
    onSuccess(data) {
      if (data.length > 0) {
        setLoading(true);
        getFilesListWithInfo(boox[1], data).then(list => {
          setLoading(false);
          setFilesInfoList(list);
        });
      }
    }
  })

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
    onSuccess(data) {
      getFilesList();
    }
  });

  return (
    <>
      <Paper sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >
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
                      Create_IA
                    </Button>

                    {loading &&  (
                      <LoadingButton 
                        loading={ loading } 
                        loadingPosition='end' 
                        endIcon={<Send/>} 
                        sx={{p:1, m:1, ml:5}} 
                      >
                        <span>Loading</span>
                      </LoadingButton>
                    )}

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
                    title="Investment Agreements List" 
                    pathName="/comp/boa/ia/bodyTerms" 
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