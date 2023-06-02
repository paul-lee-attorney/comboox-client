import { useRouter } from "next/router";

import { 
  Box,
  Stack,
} from "@mui/material";

import { HexType } from "../../../../interfaces";

import { ShaNavi } from '../../../../components';

function SubSigPage() {

  const { query } = useRouter();
  const ia:HexType = `0x${query?.addr?.toString().substring(2)}`;
  const snOfDoc: string = query?.snOfDoc?.toString() ?? '';

  return (
    <Stack sx={{ width: '100%', alignItems: 'center' }}>
      {ia != '0x' && snOfDoc && (
        <ShaNavi contractName={'Investment Agreement'} addr={ ia } snOfDoc={ snOfDoc } thisPath='./subSigPage' />
      )}
    </Stack>    
  );
} 

export default SubSigPage;