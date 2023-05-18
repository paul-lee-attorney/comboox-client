import { useRouter } from "next/router";

import { 
  Box, Stack,
} from "@mui/material";

import { HexType } from "../../../../interfaces";

import { ShaNavi, SetGeneralCounsel, AppointAttorney } from '../../../../components';
import { SetOwner } from "../../../../components/common/accessControl/SetOwner";
import { LockContents } from "../../../../components/common/accessControl/LockContents";
import { RemoveAttorney } from "../../../../components/common/accessControl/RemoveAttorney";
import { QuitAttorney } from "../../../../components/common/accessControl/QuitAttorney";

function AccessControl() {

  const { query } = useRouter();
  const sha:HexType = `0x${query?.addr?.toString().substring(2)}`;

  return (
    <Stack sx={{ width: '100%'}} direction={'column'} >
      <ShaNavi contractName={'Shareholders Agreement'} addr={ sha } thisPath='./accessControl' />

      <Stack direction={'row'} >

        <Stack direction={'column'} sx={{ width: '50%' }} >
          <SetOwner addr={ sha } />
          <SetGeneralCounsel addr={ sha } />
          <LockContents addr={ sha } />
        </Stack>

        <Stack direction={'column'} sx={{ width: '50%'}} >
          <AppointAttorney addr={ sha } />
          <RemoveAttorney addr={ sha } />
          <QuitAttorney addr={ sha } />
        </Stack>

      </Stack>

    </Stack>
  );
} 

export default AccessControl;