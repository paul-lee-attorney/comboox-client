import { useState } from "react";
import { Position } from "../../../queries/rod";
import { useRegisterOfDirectorsGetFullPosInfoInHand } from "../../../generated";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { GetPosInHand } from "./GetPosInHand";
import { longSnParser } from "../../../scripts/toolsKit";

interface GetFullPosInfoInHandProps {
  userNo: number;
}


export function GetFullPosInfoInHand({userNo}:GetFullPosInfoInHandProps) {
  const { boox } = useComBooxContext();

  const [ posList, setPosList ] = useState<readonly Position[]>(); 

  const [ open, setOpen ] = useState<boolean>(false);

  const {
    refetch: getPosInHand
  } = useRegisterOfDirectorsGetFullPosInfoInHand({
    address: boox ? boox[2]:undefined,
    args: [BigInt(userNo)],
    onSuccess(list) {
      setPosList(list);
    }
  })

  return (
    <>
      <Button
        variant="text"
        fullWidth={true}
        sx={{ m:1 }}
        onClick={()=>setOpen(true)}      
      >
        { longSnParser(userNo.toString()) }
      </Button>

      <Dialog
        maxWidth={false}
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="dialog-title"
      >
        <DialogTitle id="dialog-title" sx={{ textDecoration:'underline' }} >
          <b>Positions Inhand - UserNo: { longSnParser(userNo.toString()) }</b>
        </DialogTitle>

        <DialogContent>
          {posList && (
            <GetPosInHand list={posList} />
          )}
        </DialogContent>

        <DialogActions>
          <Button 
            sx={{m:1, ml:5, p:1, minWidth:128 }}
            variant="outlined"
            onClick={()=>setOpen(false)}
          >
            Close
          </Button>
        </DialogActions>

      </Dialog>
    
    </>
  );
}