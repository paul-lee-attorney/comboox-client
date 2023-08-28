import { useRegisterOfSharesDecreaseCapital } from "../../../generated";
import { useComBooxContext } from "../../../scripts/common/ComBooxContext";
import { useEffect, useState } from "react";
import { Button, Stack, TextField } from "@mui/material";
import { RemoveCircle } from "@mui/icons-material";
import { Share, getShare } from "../../../scripts/comp/ros";
import { booxMap } from "../../../scripts/common";

interface DelShareProps {
  getList: ()=>any;
}

export function DelShare ({getList}:DelShareProps) {

  const { boox } = useComBooxContext();

  const [ seq, setSeq ] = useState<string>();

  const [ share, setShare ] = useState<Share>();

  useEffect(()=>{
    if (seq && boox){
      getShare(boox[booxMap.ROS], parseInt(seq)).then(
        target => setShare(target)
      )
    }
  }, [seq, boox]);

  const {
    isLoading: delShareLoading,
    write: delShare
  } = useRegisterOfSharesDecreaseCapital({
    address: boox ? boox[booxMap.ROS] : undefined,
    args: seq && share
        ? [BigInt(seq), share.body.paid, share.body.par]
        : undefined,
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
        disabled={ delShareLoading }
        onClick={()=>delShare?.()}
        size="small"
      >
        Remove Share
      </Button>

    </Stack>
  );
}