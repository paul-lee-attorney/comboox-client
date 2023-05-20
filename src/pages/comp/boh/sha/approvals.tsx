import { useRouter } from "next/router";

import { 
  Stack,
} from "@mui/material";

import { HexType } from "../../../../interfaces";

import { 
  ShaNavi, 
  Signatures 
} from '../../../../components';

function Approvals() {

  const { query } = useRouter();
  const sha:HexType = `0x${query?.addr?.toString().substring(2)}`;

  return (
    <Stack sx={{ width: '100%', alignItems:'center' }} direction={'column'} >
      <ShaNavi contractName={'Shareholders Agreement'} addr={ sha } thisPath='./approvals' />

    </Stack>    
  );
} 

export default Approvals;