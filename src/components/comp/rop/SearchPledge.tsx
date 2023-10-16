import { useState } from "react";
import { useComBooxContext } from "../../../scripts/common/ComBooxContext";
import { Button, Stack, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";
import { Pledge } from "../../../scripts/comp/rop";
import { getPledge } from "../../../scripts/comp/rop";
import { MaxPrice, MaxSeqNo, booxMap } from "../../../scripts/common";
import { FormResults, defFormResults, hasError, onlyNum } from "../../../scripts/common/toolsKit";

interface SearchPledgeProps{
  setPld:(pld:Pledge)=>void;
  setOpen:(flag:boolean)=>void;
}

export function SearchPledge({setPld, setOpen}:SearchPledgeProps) {
  const { boox } = useComBooxContext();

  const [ seqOfShare, setSeqOfShare ] = useState<string>();
  const [ seqOfPld, setSeqOfPld ] = useState<string>();

  const [ valid, setValid ] = useState<FormResults>(defFormResults);

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
        error={ valid['SeqOfShare'].error }
        helperText={ valid['SeqOfShare'].helpTx }
        onChange={(e) => {
          let input = e.target.value;
          onlyNum('SeqOfShare', input, MaxPrice, setValid);
          setSeqOfShare(input);
        }}
        value = { seqOfShare }
        size='small'
      />

      <TextField 
        sx={{ m: 1, minWidth: 218 }} 
        id="tfSeqOfPld" 
        label="seqOfPld" 
        variant="outlined"
        error={ valid['SeqOfPld'].error }
        helperText={ valid['SeqOfPld'].helpTx }
        onChange={(e) => {
          let input = e.target.value;
          onlyNum('SeqOfPld', input, MaxSeqNo, setValid);
          setSeqOfPld(input);
        }}
        value = { seqOfPld }
        size='small'
      />

      <Button 
        disabled={ !seqOfShare || !seqOfPld || hasError(valid)}
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






