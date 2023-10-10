import { useEffect, useState } from "react";

import { 
  Paper, 
  Toolbar,
  Stack,
} from "@mui/material";

import { useComBooxContext } from "../../../scripts/common/ComBooxContext";

import { booxMap } from "../../../scripts/common";
import { OptionsList } from "../../../components/comp/roo/OptionsList";
import { CertificateOfOption } from "../../../components/comp/roo/CertificateOfOption";
import { CopyLongStrSpan } from "../../../components/common/utils/CopyLongStr";
import { OptWrap, defaultOptWrap, getAllOpts } from "../../../scripts/comp/roo";

function RegisterOfOptions() {
  const { boox } = useComBooxContext();

  const [ optsList, setOptsList ] = useState<readonly OptWrap[]>([defaultOptWrap]);
  const [ time, setTime ] = useState(0);

  useEffect(()=>{
    if (boox) {
      getAllOpts(boox[booxMap.ROO]).then(
        res => setOptsList(res)
      );
    }
  }, [boox, time]);

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
          <CertificateOfOption open={open} optWrap={opt} setOpen={setOpen} setTime={setTime} />
        )}

      </Stack>

    </Paper>
  );
} 

export default RegisterOfOptions;