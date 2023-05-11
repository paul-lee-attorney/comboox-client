import { useRouter } from "next/router";

import { 
  Box,
} from "@mui/material";

import { HexType } from "../../../../interfaces";

import { ShaNavi } from '../../../../components';

function SubSigPage() {

  const { query } = useRouter();
  const sha:HexType = `0x${query?.addr?.toString().substring(2)}`;

  return (
    <Box sx={{ width: '100%', alignItems: 'center' }}>
      <ShaNavi contractName={'Shareholders Agreement'} addr={ sha } thisPath='./subSigPage' />
    </Box>    
  );
} 

export default SubSigPage;