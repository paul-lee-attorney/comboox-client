import { BigNumber } from "ethers";
import { useBookOfSharesDecreaseCapital, usePrepareBookOfSharesDecreaseCapital } from "../../../generated";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { useEffect, useState } from "react";
import { Button, Stack, TextField } from "@mui/material";
import { RemoveCircle } from "@mui/icons-material";
import { Share, getShare } from "../../../queries/bos";

interface DelShareProps {
  getList: ()=>any;
}

export function DelShare ({getList}:DelShareProps) {

  const { boox } = useComBooxContext();

  const [ seq, setSeq ] = useState<string>();

  const [ share, setShare ] = useState<Share>();

  useEffect(()=>{
    if (seq && boox){
      getShare(boox[7], parseInt(seq)).then(
        target => setShare(target)
      )
    }
  }, [seq, boox]);

  const {
    config: delShareConfig
  } = usePrepareBookOfSharesDecreaseCapital({
    address: boox ? boox[7] : undefined,
    args: seq && share
        ? [BigNumber.from(seq), share.body.paid, share.body.par]
        : undefined,
  })

  const {
    isLoading: delShareLoading,
    write: delShare
  } = useBookOfSharesDecreaseCapital({
    ...delShareConfig,
    onSuccess(){
      setSeq(undefined);
      getList();
    }
  })

  return (
    <Stack direction='row' sx={{m:1, p:1, alignItems:'center'}}>

      <TextField
        variant="outlined"
        label="SeqOfShare"
        sx={{
          m:1,
          minWidth: 218
        }}
        onChange={(e)=>setSeq(e.target.value)}
        value={seq}
        size='small'
      />

      <Button
        sx={{m:1, p:1}}
        variant='contained'
        endIcon={<RemoveCircle />}
        disabled={ !delShare || delShareLoading }
        onClick={()=>delShare?.()}
        size="small"
      >
        Remove Share
      </Button>

    </Stack>
  );
}