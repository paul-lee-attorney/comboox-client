import { useRouter } from "next/router";

import { 
  Box,
  Stack,
} from "@mui/material";

import { HexType } from "../../../../interfaces";

import { 
  ShaNavi, 
  Signatures 
} from '../../../../components';
import { useState } from "react";
import { Finalized } from "../../../../components";

function SigPage() {
  const [finalized, setFinalized] = useState(false);

  const { query } = useRouter();
  const sha:HexType = `0x${query?.addr?.toString().substring(2)}`;

  return (
    <Stack sx={{ width: '100%', alignItems:'center' }} direction={'column'} >
      <ShaNavi contractName={'Shareholders Agreement'} addr={ sha } thisPath='./sigPage' />

      {sha && (<Finalized addr={sha} setFinalized={setFinalized} />)}

      <Signatures addr={ sha } initPage={ true } finalized={finalized} />

    </Stack>    
  );
} 

export default SigPage;