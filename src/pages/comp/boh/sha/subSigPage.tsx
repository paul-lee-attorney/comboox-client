import { useRouter } from "next/router";

import { 
  Box,
  Stack,
} from "@mui/material";

import { HexType } from "../../../../interfaces";

import { ShaNavi } from '../../../../components';

function SubSigPage() {

  const { query } = useRouter();
  const sha:HexType = `0x${query?.addr?.toString().substring(2)}`;

  return (
    <Stack sx={{ width: '100%', alignItems: 'center' }}>
      <ShaNavi contractName={'Shareholders Agreement'} addr={ sha } thisPath='./subSigPage' />
    </Stack>    
  );
} 

export default SubSigPage;