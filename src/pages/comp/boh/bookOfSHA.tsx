import { useState } from "react";

import { 
  Button, 
  Paper, 
  Toolbar,
  TextField,
  Stack,
} from "@mui/material";

import { useComBooxContext } from "../../../scripts/ComBooxContext";

import { Create, Send } from "@mui/icons-material";
import { HexType } from "../../../interfaces";

import { readContract } from "@wagmi/core";

import { 
  filesFolderABI,
  useFilesFolderGetFilesList,
  useGeneralKeeperCreateSha,
  usePrepareGeneralKeeperCreateSha,
} from "../../../generated";
import { BigNumber } from "ethers";
import { GetFilesList } from "../../../components";
import { LoadingButton } from "@mui/lab";

export interface HeadOfFile {
  circulateDate: number;
  signingDays: number;
  closingDays: number;
  seqOfVR: number;
  shaExecDays: number;
  shaConfirmDays: number;
  proposeDate: number;
  reconsiderDays: number;
  votePrepareDays: number;
  votingDays: number;
  execDaysForPutOpt: number;
  seqOfMotion: BigNumber;
  state: number;
}

export interface RefOfFile {
  docUrl: HexType;
  docHash: HexType;
}

export interface InfoOfFile {
  addr: HexType;
  sn: HexType;
  head: HeadOfFile;
  ref: RefOfFile;
}

export async function getFilesListWithInfo(folder: HexType, files: readonly HexType[]): Promise<InfoOfFile[]> {

  let list: InfoOfFile[] = [];
  let len: number = files.length;
  let i = len > 20 ? len-20 : 0;

  while(i < len) {
  
    let file = await readContract({
      address: folder,
      abi: filesFolderABI,
      functionName: 'getFile',
      args: [files[i]],
    });

    list[len - i] = {
      addr: files[i],
      sn: file.snOfDoc,
      head: file.head,
      ref: file.ref,
    };

    i++;

  }

  return list;
}

function BookOfSHA() {
  const { gk, boox } = useComBooxContext();

  const [ loading, setLoading ] = useState<boolean>();
  const [ filesInfoList, setFilesInfoList ] = useState<InfoOfFile[]>();
  const {
    refetch: getFilesList,
  } = useFilesFolderGetFilesList({
    address: boox[4],
    onSuccess(data) {
      if (data.length > 0) {
        setLoading(true);
        getFilesListWithInfo(boox[4], data).then(list => {
          setLoading(false);
          setFilesInfoList(list);
        });
      }
    }
  })

  const [ version, setVersion ] = useState<string>();
  const { config } = usePrepareGeneralKeeperCreateSha({
    address: gk,
    args: version ? [BigNumber.from(version)] : undefined,
  });
  const {
    isLoading: createShaLoading, 
    write: createSha,
  } = useGeneralKeeperCreateSha({
    ...config,
    onSuccess() {
      getFilesList();
    }
  });

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >
      <Toolbar>
        <h3>BOH - Book Of Shareholders Agreements</h3>
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
                    disabled={ !createSha || createShaLoading }
                    sx={{ m: 1, minWidth: 120, height: 40 }} 
                    variant="contained" 
                    endIcon={ <Create /> }
                    onClick={() => createSha?.() }
                    size='small'
                  >
                    Create SHA
                  </Button>

                  {loading && (
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
                  title="SHA List" 
                  pathName="/comp/boh/sha/Sha" 
                  pathAs="/comp/boh/sha" 
                />
              )}

            </td>
          </tr>
        </tbody>

      </table>

    </Paper>
  );
} 

export default BookOfSHA;