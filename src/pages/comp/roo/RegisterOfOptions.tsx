import { useState } from "react";

import { 
  Paper, 
  Toolbar,
  Stack,
} from "@mui/material";

import { useComBooxContext } from "../../../scripts/common/ComBooxContext";

import { 
  registerOfOptionsABI,
  useRegisterOfOptionsGetAllOptions,
} from "../../../generated";
import { HexType, booxMap } from "../../../scripts/common";
import { readContract } from "@wagmi/core";
import { OptionsList } from "../../../components/comp/roo/OptionsList";
import { CertificateOfOption } from "../../../components/comp/roo/CertificateOfOption";
import { CopyLongStrSpan } from "../../../components/common/utils/CopyLongStr";
import { OptWrap, defaultOptWrap } from "../../../scripts/comp/roo";

export async function getObligors(addr: HexType, seqOfOpt: number): Promise<number[]> {

  let res = await readContract({
    address: addr,
    abi: registerOfOptionsABI,
    functionName: 'getObligorsOfOption',
    args: [BigInt(seqOfOpt)],
  })

  return res.map(v => Number(v));
}

function RegisterOfOptions() {
  const { boox } = useComBooxContext();

  const [ optsList, setOptsList ] = useState<readonly OptWrap[]>([defaultOptWrap]);

  const {
    refetch: getAllOpts,
  } = useRegisterOfOptionsGetAllOptions ({
    address: boox ? boox[booxMap.ROO] : undefined,
    onSuccess(ls) {
      if (ls && boox) {

        setOptsList(ls.map(v=>({
          opt: v,
          obligors: [],
        })));

        let len = ls.length;

        while (len > 0) {
          let opt = ls[len-1];
          
          getObligors(boox[booxMap.ROO], opt.head.seqOfOpt).then(
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
          <h3>ROO - Register Of Options</h3>
        </Toolbar>

        {boox && (
          <CopyLongStrSpan title="Addr"  src={ boox[booxMap.ROO].toLowerCase() } />
        )}

      </Stack>

      <Stack direction='column' sx={{m:1, p:1}} >

        <OptionsList 
          list={ optsList }  
          setOpt={ setOpt }
          setOpen={ setOpen }
        />
      
        {opt && (
          <CertificateOfOption open={open} optWrap={opt} setOpen={setOpen} getAllOpts={()=>getAllOpts()} />
        )}

      </Stack>

    </Paper>
  );
} 

export default RegisterOfOptions;