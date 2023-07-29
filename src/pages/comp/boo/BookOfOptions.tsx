import { useState } from "react";

import { 
  Paper, 
  Toolbar,
  Stack,
} from "@mui/material";

import { useComBooxContext } from "../../../scripts/ComBooxContext";

import { 
  bookOfOptionsABI,
  useBookOfOptionsGetAllOptions,
} from "../../../generated";
import { Option, defaultOpt } from "../../../components/comp/boc/terms/Options/Options";
import { HexType } from "../../../interfaces";
import { readContract } from "@wagmi/core";
import { OptionsList } from "../../../components/comp/boo/OptionsList";
import { CertificateOfOption } from "../../../components/comp/boo/CertificateOfOption";
import { CopyLongStrSpan } from "../../../components/common/utils/CopyLongStr";

export async function getObligors(addr: HexType, seqOfOpt: number): Promise<number[]> {

  let res = await readContract({
    address: addr,
    abi: bookOfOptionsABI,
    functionName: 'getObligorsOfOption',
    args: [BigInt(seqOfOpt)],
  })

  return res.map(v => Number(v));
}

function BookOfOptions() {
  const { boox } = useComBooxContext();

  const [ optsList, setOptsList ] = useState<readonly Option[]>([]);

  const {
    refetch: getAllOpts,
  } = useBookOfOptionsGetAllOptions ({
    address: boox ? boox[7] : undefined,
    onSuccess(ls) {
      if (ls && boox) {
        let out:Option[] = [];
        
        ls.forEach(async v => {
          let item:Option = {
            head: v.head,
            cond: v.cond,
            body: v.body,
            obligors: await getObligors(boox[7], v.head.seqOfOpt),
          }

          out.push(item);
        });

        setOptsList(out);        
      }
    }
  })

  const [ open, setOpen ] = useState<boolean>(false);
  const [ opt, setOpt ] = useState<Option>(defaultOpt);

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, maxWidth:1680, border:1, borderColor:'divider' }} >

      <Stack direction="row" >

        <Toolbar sx={{ textDecoration:'underline' }} >
          <h3>BOO - Book Of Options</h3>
        </Toolbar>

        {boox && (
          <CopyLongStrSpan title="Addr" size="body1" src={ boox[7].toLowerCase() } />
        )}

      </Stack>

      <Stack direction='column' sx={{m:1, p:1}} >

        <OptionsList 
          list={ optsList }  
          setOpt={ setOpt }
          setOpen={ setOpen }
        />
      
        {opt && (
          <CertificateOfOption open={open} opt={opt} setOpen={setOpen} getAllOpts={getAllOpts} />
        )}

      </Stack>

    </Paper>
  );
} 

export default BookOfOptions;