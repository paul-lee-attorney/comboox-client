
import { Paper } from "@mui/material";

import { ActionsOnMotionProps } from "../ActionsOnMotion";
import { getMyUserNo } from "../../../../rc";
import MotionUpDownLoad from "../../../../../api/MotionUpDownLoad";
import { CheckFilerFunc } from "../../../../../api/FileUpload";
import { getTypeOfMotion } from "../../meetingMinutes";

export function UploadMotionFile({ motion, setOpen, refresh }:ActionsOnMotionProps) {
  
  const checkProposer:CheckFilerFunc = async (proposer) => {
    if (!proposer) return false;

    let myNo = await getMyUserNo(proposer.account.address);

    if (!myNo) return false;
    console.log('myNo: ', myNo);

    if (myNo == motion.body.proposer) return true;
    else {
      console.log('not proposer');
      return false;
    }
  }

  return (

    <Paper elevation={3} sx={{ m:1, p:1, color:'divider', border:1 }} >
      <MotionUpDownLoad typeOfMotion={getTypeOfMotion(motion)} contents={motion.contents.toString(16).padStart(64, '0')} checkProposer={checkProposer} />
    </Paper>

  );
}

