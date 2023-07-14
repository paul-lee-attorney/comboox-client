import { useState } from "react";

import { 
  Paper, 
  Toolbar,
  Stack,
} from "@mui/material";

import { useComBooxContext } from "../../../scripts/ComBooxContext";

import { 
  useBookOfPledgesGetAllPledges,
} from "../../../generated";
import { Pledge } from "../../../queries/bop";
import { PledgesList } from "../../../components/comp/bop/PledgesList";
import { CertificateOfPledge } from "../../../components/comp/bop/CertificateOfPledge";
import { CreatePledge } from "../../../components/comp/bop/CreatePledge";

function BookOfPledges() {
  const { boox } = useComBooxContext();

  const [ pldList, setPldList ] = useState<readonly Pledge[]>([]);

  const {
    refetch: getAllPledges,
  } = useBookOfPledgesGetAllPledges ({
    address: boox ? boox[8] : undefined,
    onSuccess(data) {
      setPldList(data);
    }
  })

  const [ open, setOpen ] = useState<boolean>(false);
  const [ pld, setPld ] = useState<Pledge>();

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, maxWidth:1680, border:1, borderColor:'divider' }} >
      <Toolbar>
        <h3>BOP - Book Of Pledges (Addr: {boox ? boox[8] : ''})</h3>
      </Toolbar>

      <Stack direction='column' sx={{m:1, p:1}} >

        <CreatePledge getAllPledges={getAllPledges} />

        <PledgesList 
          list={ pldList }  
          setPledge={ setPld }
          setOpen={ setOpen }
        />
      
        {pld && (
          <CertificateOfPledge open={open} pld={pld} setOpen={setOpen} getAllPledges={getAllPledges} />
        )}

      </Stack>

    </Paper>
  );
} 

export default BookOfPledges;