import { useEffect, useState } from "react";

import { 
  Button, 
  Paper, 
  Toolbar,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import { useComBooxContext } from "../../../scripts/ComBooxContext";

import { 
  DialogSha,
} from "../../../components";

import { DialerSip, Create } from "@mui/icons-material";
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

async function getReceipt(hash: HexType): Promise<HexType> {
  const receipt = await waitForTransaction({
    hash: hash
  });

  let addrOfSha: HexType = AddrZero;

  if (receipt) {
    // console.log("receipt: ", receipt);
    addrOfSha = `0x${receipt.logs[0].topics[2].substring(26)}`;
    // console.log('addrOfSha: ', addrOfSha);
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
      <Paper sx={{alignContent:'center', justifyContent:'center', p:1, m:1 }} >
        <Toolbar>
          <h3>BOH - Book Of ShareholdersAgreements</h3>
        </Toolbar>

        <table width={1500} >
          <thead>
            <tr>        
              <td colSpan={2}>
              </td>
              <td colSpan={2} >
              </td>
            </tr>
          </thead>
          
          <tbody>

            <tr>        
              <td colSpan={2}>
              </td>
              <td colSpan={2} >
              </td>
            </tr>

            <tr>
              <td>
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
                  disabled={!write || isLoading}
                  sx={{ m: 1, minWidth: 120, height: 40 }} 
                  variant="contained" 
                  endIcon={ <Create /> }
                  onClick={() => write?.() }
                  size='small'
                >
                  Create_SHA
                </Button>

                <DialogSha addr={ sha } />
              </td>
              <td>
              </td>
              <td>
              </td>
              <td>
              </td>
            </tr>

            <tr>
              <td colSpan={4}>
              </td>
            </tr>
          </tbody>

        </table>

      </Paper>
    </>
  );
} 

export default BookOfSHA;