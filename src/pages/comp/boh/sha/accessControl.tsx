import { useRouter } from "next/router";

import { 
  Box, Paper, Stack,
} from "@mui/material";

import { HexType } from "../../../../interfaces";

import { ShaNavi, SetGeneralCounsel, AppointAttorney, Finalized } from '../../../../components';
import { SetOwner } from "../../../../components/common/accessControl/SetOwner";
import { LockContents } from "../../../../components/common/accessControl/LockContents";
import { RemoveAttorney } from "../../../../components/common/accessControl/RemoveAttorney";
import { QuitAttorney } from "../../../../components/common/accessControl/QuitAttorney";
import { useState } from "react";

function AccessControl() {
  const [ finalized, setFinalized ] = useState<boolean>();

  const { query } = useRouter();
  const sha:HexType = `0x${query?.addr?.toString().substring(2)}`;

  return (
    <Stack sx={{ width: '100%', alignItems: 'center'}} direction={'column'} >
      <ShaNavi contractName={'Shareholders Agreement'} addr={ sha } thisPath='./accessControl' />

      {sha!='0x' && (
        <Finalized addr={sha} setFinalized={ setFinalized } />
      )}

      <Stack direction={'row'} >

      {finalized != undefined && !finalized && (
        <>
          <Stack direction={'column'}  >
            <Paper sx={{m:1, p:1, border:1, borderColor:'divider'}}>
              <SetOwner addr={ sha } />
              <SetGeneralCounsel addr={ sha } />              
              <LockContents addr={ sha } />
            </Paper>
          </Stack>

          <Stack direction={'column'} >
            <Paper sx={{m:1, p:1, border:1, borderColor:'divider'}} >
              <AppointAttorney addr={ sha } />
              <RemoveAttorney addr={ sha } />
              <QuitAttorney addr={ sha } />
            </Paper>
          </Stack>
        </>
      )}



      </Stack>

    </Stack>
  );
} 

export default AccessControl;