import { useState } from "react";
import { Position } from "../../../queries/bod";
import { useBookOfDirectors, useBookOfDirectorsGetFullPosInfoInHand } from "../../../generated";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { BigNumber } from "ethers";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { AssignmentInd } from "@mui/icons-material";
import { longSnParser } from "../../../scripts/toolsKit";
import { GetOfficersList } from "./GetOfficersList";
import { GetPosInHand } from "./GetPosInHand";




interface GetFullPosInfoInHandProps {
  userNo: number;
}


export function GetFullPosInfoInHand({userNo}:GetFullPosInfoInHandProps) {
  const { boox } = useComBooxContext();

  const [ posList, setPosList ] = useState<readonly Position[]>(); 

  const [ open, setOpen ] = useState<boolean>(false);

  const {
    refetch: getPosInHand
  } = useBookOfDirectorsGetFullPosInfoInHand({
    address: boox ? boox[2]:undefined,
    args: [BigNumber.from(userNo)],
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