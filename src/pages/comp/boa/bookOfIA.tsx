import { useState } from "react";

import {
  Button, 
  Paper, 
  Toolbar,
  TextField,
  Stack,
} from "@mui/material";

import { useComBooxContext } from "../../../scripts/ComBooxContext";
import Link from "../../../scripts/Link"

import { Create, ReadMoreOutlined } from "@mui/icons-material";
import { AddrZero, HexType } from "../../../interfaces";

import { waitForTransaction } from "@wagmi/core";



import { 
  useGeneralKeeperCreateIa, 
  usePrepareGeneralKeeperCreateIa,
} from "../../../generated";
import { BigNumber } from "ethers";
import { FilesListWithInfo, GetFilesList } from "../../../components";

async function getReceipt(hash: HexType): Promise<HexType> {
  const receipt = await waitForTransaction({
    hash: hash
  });

  let addrOfIa: HexType = AddrZero;

  if (receipt) {
    addrOfIa = `0x${receipt.logs[0].topics[2].substring(26)}`;
  }

  return addrOfIa;  
}

function BookOfIA() {
  const { gk, boox } = useComBooxContext();

  const [ia, setIa] = useState<HexType>();

  const [ version, setVersion ] = useState<string>();

  const { config } = usePrepareGeneralKeeperCreateIa({
    address: gk,
    args: version ? [BigNumber.from(version)] : undefined,
  });
  const {isLoading, write} = useGeneralKeeperCreateIa({
    ...config,
    onSuccess(data) {
      getReceipt(data.hash).then(
        addrOfIa => setIa(addrOfIa)
      );
    }
  });

  return (
    <>
      <Paper sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >
        <Toolbar>
          <h3>BOA - Book Of InvestmentAgreement</h3>
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

                    {!ia ? (
                      <Button 
                        disabled={!write || isLoading}
                        sx={{ m: 1, minWidth: 120, height: 40 }} 
                        variant="contained" 
                        endIcon={ <Create /> }
                        onClick={() => write?.() }
                        size='small'
                      >
                        Create_IA
                      </Button>

                    ) : (

                      <Link 
                        href={{
                          pathname: './ia/bodyTerms',
                          query: {
                            addr: ia,
                          }
                        }}
                        
                        as={'./ia'}

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
                          OPEN IA
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
                <GetFilesList 
                  addr={ boox[4] } 
                  title="Investment Agreements List" 
                  pathName="/comp/boa/ia/bodyTerms" 
                  pathAs="/comp/boa/ia" 
                />
              </td>
            </tr>
          </tbody>

        </table>

      </Paper>
    </>
  );
} 

export default BookOfIA;