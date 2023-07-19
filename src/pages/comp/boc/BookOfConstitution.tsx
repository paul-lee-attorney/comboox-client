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
  useFilesFolderGetFilesList,
  useGeneralKeeperCreateSha,
} from "../../../generated";

import { InfoOfFile, getFilesInfoList, getFilesListWithInfo } from "../../../queries/filesFolder";
import { GetFilesList } from "../../../components/common/fileFolder/GetFilesList";

function BookOfConstitution() {
  const { gk, boox } = useComBooxContext();

  const [ filesInfoList, setFilesInfoList ] = useState<InfoOfFile[]>();

  const [ version, setVersion ] = useState<string>();

  const {
    refetch: getFilesList     
  } = useFilesFolderGetFilesList({
    address: boox ? boox[1] : undefined,
    onSuccess(ls) {
      if (boox)
        getFilesInfoList(boox[1], ls).then(
          list => setFilesInfoList(list)
        )
    }
  })


  const {
    isLoading: createShaLoading, 
    write: createSha,
  } = useGeneralKeeperCreateSha({
    address: gk,
    args: version ? [BigInt(version)] : undefined,
    onSuccess(){
      getFilesList();
    },
  });
  
  // useEffect(()=>{
  //   if (boox) {
  //     getFilesListWithInfo(boox[1]).then(
  //       list => setFilesInfoList(list)
  //     )
  //   }
  // }, [boox, createSha]);

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >
      <Toolbar sx={{ textDecoration:'underline' }}>
        <h3>BOC - Book Of Constitution</h3>
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
                    onChange={(e) => {
                      setVersion(e.target.value);
                    }
                    }
                    // value = { version }
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
                  pathName="/comp/boc/Sha" 
                  pathAs="/comp/boc/sha" 
                />
              )}

            </td>
          </tr>
        </tbody>

      </table>

    </Paper>
  );
} 

export default BookOfConstitution;