import { useState } from "react";
import { useGeneralKeeperExtendPledge } from "../../../generated";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { Button, Paper, Stack, TextField, Toolbar } from "@mui/material";
import { Start } from "@mui/icons-material";

interface ExtendPledgeProps{
  seqOfShare: number;
  seqOfPld: number;
  setOpen:(flag:boolean)=>void;
  getAllPledges:()=>void;
}

export function ExtendPledge({seqOfShare, seqOfPld, setOpen, getAllPledges}:ExtendPledgeProps) {

  const { gk } = useComBooxContext();
  
  const [ days, setDays ] = useState<number>();

  // const {
  //   config: extendPledgeConfig
  // } = usePrepareGeneralKeeperExtendPledge({
  //   address: gk,
  //   args: days
  //     ? [ BigInt(seqOfShare), 
  //         BigInt(seqOfPld), 
  //         BigInt(days)
  //       ]
  //     : undefined,
  // })

  const {
    isLoading: extendPledgeLoading,
    write: extendPledge,
  } = useGeneralKeeperExtendPledge({
    address: gk,
    args: days
      ? [ BigInt(seqOfShare), 
          BigInt(seqOfPld), 
          BigInt(days)
        ]
      : undefined,
    onSuccess(){
      getAllPledges();
      setOpen(false);
    }
  })

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >
      <Toolbar>
        <h4>Extend Pledge</h4>
      </Toolbar>

      <Stack direction='row' sx={{ alignItems:'center' }} >

        <TextField 
          variant='filled'
          label='ExtensionDays'
          sx={{
            m:1,
            minWidth: 218,
          }}
          onChange={(e) => setDays(parseInt(e.target.value ?? '0'))}
          value={ days?.toString() }
          size='small'
        />

        <Button 
          disabled={ extendPledgeLoading }
          sx={{ m: 1, minWidth: 168, height: 40 }} 
          variant="contained" 
          endIcon={ <Start /> }
          onClick={()=>extendPledge?.() }
          size='small'
        >
          Extend
        </Button>        

      </Stack>
    </Paper>
  );

}


