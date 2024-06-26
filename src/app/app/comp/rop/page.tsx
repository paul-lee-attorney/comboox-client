"use client"

import { useEffect, useState } from "react";

import { 
  Paper, 
  Toolbar,
  Stack,
  Typography,
} from "@mui/material";

import { Pledge, getAllPledges } from "./rop";
import { PledgesList } from "./components/PledgesList";
import { CertificateOfPledge } from "./components/CertificateOfPledge";
import { CreatePledge } from "./components/CreatePledge";
import { CopyLongStrSpan } from "../../common/CopyLongStr";
import { booxMap } from "../../common";
import { useComBooxContext } from "../../../_providers/ComBooxContextProvider";

function RegisterOfPledges() {
  const { boox } = useComBooxContext();

  const [ pldList, setPldList ] = useState<readonly Pledge[]>([]);
  const [ time, setTime ] = useState<number>(0);

  const refresh = ()=>{
    setTime(Date.now());
  }

  useEffect(()=>{
    if (boox) {
      getAllPledges(boox[booxMap.ROP]).then(
        res => setPldList(res)
      );
    }
  }, [boox, time]);

  const [ open, setOpen ] = useState<boolean>(false);
  const [ pld, setPld ] = useState<Pledge>();

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, maxWidth:1680, border:1, borderColor:'divider' }} >

      <Stack direction="row" >

        <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
          <b>ROP - Register Of Pledges</b>
        </Typography>

        {boox && (
          <CopyLongStrSpan title="Addr"  src={ boox[booxMap.ROP].toLowerCase() } />
        )}

      </Stack>

      <Stack direction='column' sx={{m:1, p:1}} >

        <CreatePledge refresh={refresh} />

        <PledgesList 
          list={ pldList }  
          setPledge={ setPld }
          setOpen={ setOpen }
        />
      
        {pld && (
          <CertificateOfPledge open={open} pld={pld} setOpen={setOpen} refresh={refresh} />
        )}

      </Stack>

    </Paper>
  );
} 

export default RegisterOfPledges;