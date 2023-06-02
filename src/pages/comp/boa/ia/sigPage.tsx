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
  const ia:HexType = `0x${query?.addr?.toString().substring(2)}`;
  const snOfDoc:string = query?.snOfDoc?.toString() ?? '';

  return (
    <Stack sx={{ width: '100%', alignItems:'center' }} direction={'column'} >

      {ia != '0x' && snOfDoc && (
        <ShaNavi contractName={'Investment Agreement'} addr={ ia } snOfDoc={ snOfDoc } thisPath='./sigPage' />
      )}

      {ia != '0x' && (
        <>
          <Finalized addr={ ia } setFinalized={ setFinalized } />
          <Signatures addr={ ia } initPage={ true } finalized={ finalized } />
        </>
      )}

    </Stack>    
  );
} 

export default SigPage;