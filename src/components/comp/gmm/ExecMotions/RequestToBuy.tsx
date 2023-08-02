import { Dispatch, SetStateAction, useState } from "react";
import { Button, Paper, Stack, TextField, Toolbar } from "@mui/material";
import { PanToolOutlined } from "@mui/icons-material";
import { useGeneralKeeperRequestToBuy } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/ComBooxContext";

interface RequestToBuyProps {
  seqOfMotion: bigint;
  setOpen: Dispatch<SetStateAction<boolean>>;
  getMotionsList: ()=>void;
}

export function RequestToBuy({seqOfMotion, setOpen, getMotionsList}:RequestToBuyProps) {

  const {gk} = useComBooxContext();

  const [ seqOfDeal, setSeqOfDeal ] = useState<number>(0);
  const [ seqOfTarget, setSeqOfTarget ] = useState<number>(0);

  const closeFormOfMotion = ()=>{
    getMotionsList();
    setOpen(false);    
  }

  const {
    isLoading: requestToBuyLoading,
    write: requestToBuy,
  } = useGeneralKeeperRequestToBuy({
    address: gk,
    args: [ seqOfMotion, 
            BigInt(seqOfDeal), 
            BigInt(seqOfTarget)
          ],
    onSuccess() {
      closeFormOfMotion();
    }
  })

  return (

    <Paper elevation={3} sx={{
      m:1, p:1, 
      border: 1, 
      borderColor:'divider' 
      }} 
    >
      <Toolbar sx={{ textDecoration:'underline' }} >
        <h4>Request To Buy</h4>
      </Toolbar>

        <Stack direction={'row'} sx={{ alignItems:'center'}} >

          <TextField 
            variant='outlined'
            label='SeqOfDeal'
            size="small"
            sx={{
              m:1,
              minWidth: 218,
            }}
            onChange={(e) => setSeqOfDeal(parseInt(e.target.value ?? '0'))}
            value={ seqOfDeal.toString() }
          />

          <TextField 
            variant='outlined'
            label='SeqOfTarget'
            size="small"
            sx={{
              m:1,
              minWidth: 218,
            }}
            onChange={(e) => setSeqOfTarget(parseInt(e.target.value ?? '0'))}
            value={ seqOfTarget.toString() }
          />

          <Button 
            disabled = {!requestToBuy || requestToBuyLoading }
            sx={{ m: 1, minWidth: 218, height: 40 }} 
            variant="contained" 
            endIcon={<PanToolOutlined />}
            onClick={()=> requestToBuy?.()}
            size='small'
          >
            Request To Buy
          </Button>

        </Stack>

    </Paper>



  );
  
}