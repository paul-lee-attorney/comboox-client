import { useRouter } from "next/router";

import { 
  Paper, Stack,
} from "@mui/material";

import { HexType } from "../../../../interfaces";

import { ShaNavi, SetGeneralCounsel, AppointAttorney, Finalized } from '../../../../components';
import { SetOwner } from "../../../../components/common/accessControl/SetOwner";
import { RemoveAttorney } from "../../../../components/common/accessControl/RemoveAttorney";
import { QuitAttorney } from "../../../../components/common/accessControl/QuitAttorney";
import { useState } from "react";

function AccessControl() {
  const [ isFinalized, setFinalized ] = useState<boolean>();

  const { query } = useRouter();
  const ia:HexType = `0x${query?.addr?.toString().substring(2)}`;
  const snOfDoc:string = query?.snOfDoc?.toString() ?? '';

  return (
    <Stack sx={{ width: '100%', alignItems: 'center'}} direction={'column'} >

      {ia != '0x' && snOfDoc && (
        <ShaNavi contractName={'Investment Agreement'} addr={ ia } snOfDoc={ snOfDoc } thisPath='./accessControl' />
      )}

      {ia != '0x' && (
        <Finalized addr={ia} setFinalized={ setFinalized } />
      )}

      <Stack direction={'row'} >

        {isFinalized != undefined && !isFinalized && (
          <>
            <Stack direction={'column'}  >
              <Paper elevation={3} sx={{m:1, p:1, border:1, borderColor:'divider'}}>
                <SetOwner addr={ ia } />
                <SetGeneralCounsel addr={ ia } />
              </Paper>
            </Stack>

            <Stack direction={'column'} >
              <Paper elevation={3} sx={{m:1, p:1, border:1, borderColor:'divider'}} >
                <AppointAttorney addr={ ia } />
                <RemoveAttorney addr={ ia } />
                <QuitAttorney addr={ ia } />
              </Paper>
            </Stack>
          </>
        )}

      </Stack>

    </Stack>
  );
} 

export default AccessControl;