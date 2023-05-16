import { useEffect, useState } from "react";

import { 
  Box,
  Button, 
  Paper, 
  Toolbar,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Stack,
} from "@mui/material";

import { useComBooxContext } from "../../../scripts/ComBooxContext";
import Link from "../../../scripts/Link"

import { DialerSip, Create, Send, ReadMoreOutlined } from "@mui/icons-material";
import { AddrOfRegCenter, AddrZero, HexType } from "../../../interfaces";

import { waitForTransaction } from "@wagmi/core";



import { 
  useGeneralKeeper, 
  useGeneralKeeperCreateSha,
  usePrepareGeneralKeeperCreateSha,
  useRegCenterCounterOfDocs,
  useRegCenterCounterOfVersions, 
} from "../../../generated";
import { BigNumber } from "ethers";
import { FilesListWithInfo } from "../../../components";

async function getReceipt(hash: HexType): Promise<HexType> {
  const receipt = await waitForTransaction({
    hash: hash
  });

  let addrOfSha: HexType = AddrZero;

  if (receipt) {
    addrOfSha = `0x${receipt.logs[0].topics[2].substring(26)}`;
  }

  return addrOfSha;  
}

function BookOfSHA() {
  const { gk, boox } = useComBooxContext();

  const [sha, setSha] = useState<HexType>(AddrZero);

  const [ version, setVersion ] = useState<string>();

  const { config } = usePrepareGeneralKeeperCreateSha({
    address: gk,
    args: version ? [BigNumber.from(version)] : undefined,
  });
  const {data, isLoading, write} = useGeneralKeeperCreateSha(config);

  useEffect(() => {
    if ( data ) {
      getReceipt(data.hash).then( 
        addrOfSha => setSha(addrOfSha)
      );
    }
  });


  return (
    <>
      <Paper sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >
        <Toolbar>
          <h3>BOH - Book Of ShareholdersAgreements</h3>
        </Toolbar>

        <table width={1500} >
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

                    {sha === AddrZero ? (
                      <Button 
                        disabled={!write || isLoading}
                        sx={{ m: 1, minWidth: 120, height: 40 }} 
                        variant="contained" 
                        endIcon={ <Create /> }
                        onClick={() => write?.() }
                        size='small'
                      >
                        Create_SHA
                      </Button>

                    ) : (

                      <Link 
                        href={{
                          pathname: './sha/bodyTerms',
                          query: {
                            addr: sha,
                          }
                        }}
                        
                        as={'./sha'}

                        sx={{
                          mb: 4,
                          mt: 1,
                          alignItems: 'center'
                        }}

                        variant='button'
                        underline='hover'                
                      >
                        <Button
                          variant="outlined"
                          sx={{
                            height: 40,
                          }}
                          endIcon={ <ReadMoreOutlined /> }
                        >
                          OPEN SHA
                        </Button>
                          
                      </Link>
                    )}

                </Stack>
              </td>
              <td colSpan={2} >
              </td>
            </tr>

            <tr>
              <td colSpan={4}>
                <FilesListWithInfo addr={boox[4]} />
              </td>
            </tr>
          </tbody>

        </table>

      </Paper>
    </>
  );
} 

export default BookOfSHA;