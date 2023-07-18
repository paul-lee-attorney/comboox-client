import { Dispatch, SetStateAction, useState } from "react";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { Button, Stack, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";
import { Pledge } from "../../../queries/bop";

import { Option } from "../boc/terms/Options/Options";
import { getOption } from "../../../queries/boo";


interface SearchOptionProps{
  setOpt: Dispatch<SetStateAction<Option>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function SearchOption({setOpt, setOpen}:SearchOptionProps) {
  const { boox } = useComBooxContext();

  const [ seqOfOpt, setSeqOfOpt ] = useState<number>();

  const obtainOpt = async ()=>{
    if (boox && seqOfOpt) {
      let opt = await getOption(boox[7], seqOfOpt);
      setOpt(opt);
      setOpen(true);
    }
  }

  return (
    <Stack direction={'row'} >
      <TextField 
        sx={{ m: 1, minWidth: 120 }} 
        id="tfSeqOfOpt" 
        label="SeqOfOption" 
        variant="outlined"
        onChange={(e) => 
          setSeqOfOpt(parseInt(e.target.value ?? '0'))
        }
        value = { seqOfOpt }
        size='small'
      />

      <Button 
        disabled={ !seqOfOpt }
        sx={{ m:1, width:168, height: 40 }} 
        variant="contained" 
        endIcon={ <Search /> }
        onClick={ obtainOpt }
        size='small'
      >
        Search
      </Button>

    </Stack>
  );

}






