import { useEffect, useState } from "react";

import { 
  Paper, 
  Toolbar,
  Stack,
} from "@mui/material";

import { useComBooxContext } from "../../../scripts/common/ComBooxContext";

import { Pledge, getAllPledges } from "../../../scripts/comp/rop";
import { PledgesList } from "../../../components/comp/rop/PledgesList";
import { CertificateOfPledge } from "../../../components/comp/rop/CertificateOfPledge";
import { CreatePledge } from "../../../components/comp/rop/CreatePledge";
import { CopyLongStrSpan } from "../../../components/common/utils/CopyLongStr";
import { booxMap } from "../../../scripts/common";

function RegisterOfPledges() {
  const { boox } = useComBooxContext();

  const [ pldList, setPldList ] = useState<readonly Pledge[]>([]);
  const [ time, setTime ] = useState<number>(0);

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

        <Toolbar sx={{ textDecoration:'underline' }} >
          <h3>ROP - Register Of Pledges</h3>
        </Toolbar>

        {boox && (
          <CopyLongStrSpan title="Addr"  src={ boox[booxMap.ROP].toLowerCase() } />
        )}

      </Stack>

      <Stack direction='column' sx={{m:1, p:1}} >

        <CreatePledge setTime={setTime} />

        <PledgesList 
          list={ pldList }  
          setPledge={ setPld }
          setOpen={ setOpen }
        />
      
        {pld && (
          <CertificateOfPledge open={open} pld={pld} setOpen={setOpen} setTime={setTime} />
        )}

      </Stack>

    </Paper>
  );
} 

export default RegisterOfPledges;