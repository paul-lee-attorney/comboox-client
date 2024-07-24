
import { Paper } from "@mui/material";

import { ActionsOnMotionProps } from "../ActionsOnMotion";
import { getMyUserNo } from "../../../../rc";
import MotionUpDownLoad from "../../../../components/file_storage/MotionUpDownLoad";
import { CheckFilerFunc } from "../../../../components/file_storage/FileUpload";
import { getTypeOfMotion } from "../../meetingMinutes";
import { useComBooxContext } from "../../../../../_providers/ComBooxContextProvider";

export function UploadMotionFile({ motion, setOpen, refresh }:ActionsOnMotionProps) {
  
  const { setErrMsg } = useComBooxContext();

  const checkProposer:CheckFilerFunc = async (proposer) => {
    if (!proposer) {
      setErrMsg('No Proposer!');
      return false;
    }

    let myNo = await getMyUserNo(proposer.account.address);

    if (!myNo) {
      setErrMsg('UserNo Not Retrieved!');
      return false;
    }
    console.log('myNo: ', myNo);

    if (myNo == motion.body.proposer) return true;
    else {
      console.log('not proposer');
      return false;
    }
  }

  return (

    <Paper elevation={3} sx={{ m:1, p:1, color:'divider', border:1 }} >
      <MotionUpDownLoad seqOfMotion={motion.head.seqOfMotion.toString()} typeOfMotion={getTypeOfMotion(motion)} contents={motion.contents.toString(16).padStart(64, '0')} checkProposer={checkProposer} />
    </Paper>

  );
}

