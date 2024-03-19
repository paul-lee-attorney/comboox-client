"use client"

import { useEffect, useState } from "react";

import { 
  Paper, 
  Toolbar,
  Stack,
  Typography,
} from "@mui/material";


import { booxMap } from "../../read";
import { OptionsList } from "./read/OptionsList";
import { CertificateOfOption } from "./write/CertificateOfOption";
import { CopyLongStrSpan } from "../../read/CopyLongStr";
import { OptWrap, defaultOptWrap, getAllOpts } from "./read/roo";
import { useComBooxContext } from "../../_providers/ComBooxContextProvider";

function RegisterOfOptions() {
  const { boox } = useComBooxContext();

  const [ optsList, setOptsList ] = useState<readonly OptWrap[]>([defaultOptWrap]);
  const [ time, setTime ] = useState(0);

  const refresh = ()=>{
    setTime(Date.now());
  }

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

        <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
          <b>ROO - Register Of Options</b>
        </Typography>

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
          <CertificateOfOption open={open} optWrap={opt} setOpen={setOpen} refresh={refresh} />
        )}

      </Stack>

    </Paper>
  );
} 

export default RegisterOfOptions;