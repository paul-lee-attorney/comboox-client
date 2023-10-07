import { useState } from "react";
import { useComBooxContext } from "../../../scripts/common/ComBooxContext";
import { Button, Stack, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";
import { Pledge } from "../../../scripts/comp/rop";
import { getPledge } from "../../../scripts/comp/rop";
import { booxMap } from "../../../scripts/common";

interface SearchPledgeProps{
  setPld:(pld:Pledge)=>void;
  setOpen:(flag:boolean)=>void;
}

export function SearchPledge({setPld, setOpen}:SearchPledgeProps) {
  const { boox } = useComBooxContext();

  const [ seqOfShare, setSeqOfShare ] = useState<string>();
  const [ seqOfPld, setSeqOfPld ] = useState<string>();

  const obtainPledge = async ()=>{
    if (boox && seqOfShare && seqOfPld) {
      let pld = await getPledge(boox[booxMap.ROP], seqOfShare, seqOfPld);
      setPld(pld);
      setOpen(true);
    }
  }

  return (
    <Stack direction={'row'} >
      <TextField 
        sx={{ m: 1, minWidth: 120 }} 
        id="tfSeqOfShare" 
        label="seqOfShare" 
        variant="outlined"
        onChange={(e) => 
          setSeqOfShare(e.target.value)
        }
        value = { seqOfShare }
        size='small'
      />

      <TextField 
        sx={{ m: 1, minWidth: 218 }} 
        id="tfSeqOfPld" 
        label="seqOfPld" 
        variant="outlined"
        onChange={(e) => 
          setSeqOfPld(e.target.value)
        }
        value = { seqOfPld }
        size='small'
      />

      <Button 
        disabled={ !seqOfShare || !seqOfPld }
        sx={{ m:1, width:168, height: 40 }} 
        variant="contained" 
        endIcon={ <Search /> }
        onClick={ obtainPledge }
        size='small'
      >
        Search
      </Button>

    </Stack>
  );

}






