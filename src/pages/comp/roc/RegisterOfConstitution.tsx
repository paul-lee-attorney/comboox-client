import { useEffect, useState } from "react";

import { 
  Button, 
  Paper, 
  Toolbar,
  TextField,
  Stack,
} from "@mui/material";

import { useComBooxContext } from "../../../scripts/common/ComBooxContext";

import { Create } from "@mui/icons-material";

import { 
  useGeneralKeeperCreateSha,
} from "../../../generated";

import { InfoOfFile, getFilesListWithInfo, } from "../../../scripts/common/filesFolder";
import { GetFilesList } from "../../../components/common/fileFolder/GetFilesList";
import { CopyLongStrSpan } from "../../../components/common/utils/CopyLongStr";
import { IndexCard } from "../../../components/common/fileFolder/IndexCard";
import { booxMap } from "../../../scripts/common";

function RegisterOfConstitution() {
  const { gk, boox } = useComBooxContext();

  const [ filesInfoList, setFilesInfoList ] = useState<InfoOfFile[]>();

  const [ version, setVersion ] = useState<string>('1');

  const {
    isLoading: createShaLoading, 
    write: createSha,
  } = useGeneralKeeperCreateSha({
    address: gk,
    args: version ? [BigInt(version)] : undefined,
  });

  useEffect(()=>{
    if (boox) {
      getFilesListWithInfo(boox[booxMap.ROC]).then(
        list => setFilesInfoList(list)
      )
    }
  }, [boox, createSha]);

  const [ file, setFile ] = useState<InfoOfFile>();
  const [ open, setOpen ] = useState<boolean>(false);
  
  return (
    <Paper elevation={3} sx={{alignItems:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >

        <Stack direction='row' sx={{ alignItems:'center' }}>

          <Toolbar sx={{ textDecoration:'underline', mr:2 }}>
            <h3>ROC - Register Of Constitution </h3> 
          </Toolbar>

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
                    helperText="Integer <= 2^16 (e.g. '123')"
                    onChange={(e) => {
                      setVersion(e.target.value);
                    }
                    }
                    value = { version }
                    size='small'
                  />

                  <Button 
                    disabled={ createShaLoading }
                    sx={{ m: 1, minWidth: 120, height: 40 }} 
                    variant="contained" 
                    endIcon={ <Create /> }
                    onClick={()=>createSha() }
                    size='small'
                  >
                    Create SHA
                  </Button>
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
                  pathName="/comp/roc/Sha" 
                  pathAs="/comp/roc/Sha" 
                  setFile={setFile}
                  setOpen={setOpen}
                  getFilesList={getFilesList}
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