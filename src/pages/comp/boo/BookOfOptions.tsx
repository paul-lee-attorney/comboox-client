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
import { HexType } from "../../../interfaces";
import { readContract } from "@wagmi/core";
import { OptionsList } from "../../../components/comp/boo/OptionsList";
import { CertificateOfOption } from "../../../components/comp/boo/CertificateOfOption";
import { CopyLongStrSpan } from "../../../components/common/utils/CopyLongStr";
import { OptWrap, defaultOptWrap } from "../../../queries/boo";

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

  const [ optsList, setOptsList ] = useState<readonly OptWrap[]>([defaultOptWrap]);

  const {
    refetch: getAllOpts,
  } = useBookOfOptionsGetAllOptions ({
    address: boox ? boox[7] : undefined,
    onSuccess(ls) {
      if (ls && boox) {

        setOptsList(ls.map(v=>({
          opt: v,
          obligors: [0],
        })));

        let len = ls.length;

        while (len > 0) {
          let opt = ls[len-1];
          
          getObligors(boox[7], opt.head.seqOfOpt).then(
            obligors => {
              setOptsList(v => (v.map(k=>{
                if (k.opt.head.seqOfOpt == opt.head.seqOfOpt)
                  k.obligors = obligors;
                return k;
              })))
            }
          );

          len--;

        }
        
      }
    }
  })

  const [ open, setOpen ] = useState<boolean>(false);
  const [ opt, setOpt ] = useState<OptWrap>( defaultOptWrap );

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
          <CertificateOfOption open={open} optWrap={opt} setOpen={setOpen} getAllOpts={getAllOpts} />
        )}

      </Stack>

    </Paper>
  );
} 

export default BookOfOptions;