import { useRouter } from "next/router";

import { 
  Box, Stack,
} from "@mui/material";

import { HexType } from "../../../../interfaces";

import { ShaNavi, SetGeneralCounsel } from '../../../../components';

function AccessControl() {

  const { query } = useRouter();
  const sha:HexType = `0x${query?.addr?.toString().substring(2)}`;

  return (
    <Box sx={{ width: '100%', alignItems: 'center' }} >
      <ShaNavi contractName={'Shareholders Agreement'} addr={ sha } thisPath='./accessControl' />

      <Stack direction={'column'} >
        <SetGeneralCounsel addr={ sha } />
      </Stack>
    </Box>
  );
} 

export default AccessControl;