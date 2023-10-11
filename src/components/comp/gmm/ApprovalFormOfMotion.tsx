import { 
  Button, 
  Collapse, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Paper, 
  TextField, 
  Toolbar 
} from "@mui/material";

import { useComBooxContext } from "../../../scripts/common/ComBooxContext";
import { GetVotingRule } from "../roc/rules/VotingRules/GetVotingRule";
import { GetPosition } from "../rod/GetPosition";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HexType, booxMap } from "../../../scripts/common";
import { Article } from "@mui/icons-material";
import { dateParser, longSnParser } from "../../../scripts/common/toolsKit";
import { ProposeMotionToGeneralMeeting } from "./VoteMotions/ProposeMotionToGeneralMeeting";
import { CastVoteOfGm } from "./VoteMotions/CastVoteOfGm";
import { VoteCase, getVoteResult, voteEnded } from "../../../scripts/common/meetingMinutes";
import { VoteCountingOfGm } from "./VoteMotions/VoteCountingOfGm";
import { TakeSeat } from "./ExecMotions/TakeSeat";
import { RemoveDirector } from "./ExecMotions/RemoveDirector";
import { ExecActionOfGm } from "./ExecMotions/ExecActionOfGm";
import { BallotsList } from "../../common/meetingMinutes/BallotsList";
import { statesOfMotion } from "../../common/meetingMinutes/GetMotionsList";
import { getFile } from "../../../scripts/common/filesFolder";
import { ApprovalFormOfBoardMotionProps } from "../bmm/ApprovalFormOfBoardMotion";

export const motionType = ['ElectOfficer', 'RemoveDirector', 'ApproveDocument', 'ApproveAction'];

export function ApprovalFormOfMotion({minutes, open, motion, setOpen, refresh}: ApprovalFormOfBoardMotionProps) {

  const { boox } = useComBooxContext();

  const [ voteResult, setVoteResult ] = useState<VoteCase[]>();

  useEffect(()=>{
    getVoteResult(minutes, motion.head.seqOfMotion).then(
      list => setVoteResult(list)
    )
  }, [minutes, motion]);

  const [ addrOfDoc, setAddrOfDoc ]=useState<HexType>();
  const [ snOfDoc, setSnOfDoc ] = useState<string>();

  useEffect(()=>{
    setAddrOfDoc(`0x${motion.contents.toString(16).padStart(66, '0').substring(26, 66)}`);
    if (boox && addrOfDoc && motion.head.seqOfVR < 9) {
      let folder:HexType = motion.head.seqOfVR == 8
                          ? boox[booxMap.ROC] : boox[booxMap.ROA];
      getFile(folder, addrOfDoc).then(
        file => setSnOfDoc(file.snOfDoc)
      );
    }
  }, [motion, addrOfDoc, boox]);

  const [voteIsEnd, setVoteIsEnd] = useState<boolean>();

  useEffect(()=>{
    if ( boox ) {
      let minutes: HexType =
      motion.votingRule.authority == 1
      ? boox[booxMap.GMM] : boox[booxMap.BMM];
      voteEnded(minutes, motion.head.seqOfMotion).then(
        flag => {
          setVoteIsEnd(flag);
        }
      ); 
    }
  }, [motion, boox ])

  const [ voteIsPassed, setVoteIsPassed ] = useState<boolean>(false);

  return (
    <Dialog
      maxWidth={false}
      open={open}
      onClose={()=>setOpen(false)}
      aria-labelledby="dialog-title"
      sx={{m:1, p:1}} 
    >
      <DialogTitle id="dialog-title" sx={{ textDecoration:'underline' }}>
        <h4>{"Form of Motion"}</h4>
      </DialogTitle>
      <DialogContent>
        <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >
          <table width={1580} >
            <thead> 
              <tr>
                <td colSpan={2}>
                  <Toolbar sx={{ color:'black', textDecoration:'underline' }}>
                    <h4> General Meeting of Members - {motionType[motion.head.typeOfMotion-1]} </h4>
                  </Toolbar>
                </td>
                <td colSpan={2}>
                  <Toolbar sx={{ color:'black', textDecoration:'underline' }} >
                    <h6> No. ( { longSnParser(motion.head.seqOfMotion.toString()) } ) </h6>
                  </Toolbar>
                </td>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfCreator" 
                    label="Creator" 
                    variant="outlined"
                    value = { longSnParser(motion.head.creator.toString()) }
                    size='small'
                  />
                </td>            
                <td>
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfCreateDate" 
                    label="CreateDate" 
                    variant="outlined"
                    value = { dateParser(motion.head.createDate) }
                    size='small'
                  />
                </td>            
                <td>
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfProposer" 
                    label="Proposer" 
                    variant="outlined"
                    value = { longSnParser(motion.body.proposer.toString()) }
                    size='small'
                  />
                </td>            
                <td>
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfProposeDate" 
                    label="ProposeDate" 
                    variant="outlined"
                    value = { dateParser(motion.body.proposeDate) }
                    size='small'
                  />
                </td>

              </tr>

              {motion.body.state > 1 && (
                <tr>
                  <td>
                    <TextField 
                      fullWidth={true}
                      inputProps={{readOnly: true}}
                      sx={{ m: 1 }} 
                      id="tfShareRegDate" 
                      label="ShareRegDate" 
                      variant="outlined"
                      value = { dateParser(motion.body.shareRegDate) }
                      size='small'
                    />
                  </td>
                  <td>
                    <TextField 
                      fullWidth={true}
                      inputProps={{readOnly: true}}
                      sx={{ m: 1 }} 
                      id="tfVoteStartDate" 
                      label="VoteStartDate" 
                      variant="outlined"
                      value = { dateParser(motion.body.voteStartDate) }
                      size='small'
                    />
                  </td>
                  <td>
                    <TextField 
                      fullWidth={true}
                      inputProps={{readOnly: true}}
                      sx={{ m: 1 }} 
                      id="tfVoteEndDate" 
                      label="VoteEndDate" 
                      variant="outlined"
                      value = { dateParser(motion.body.voteEndDate) }
                      size='small'
                    />
                  </td>
                  <td>
                    <TextField 
                      fullWidth={true}
                      inputProps={{readOnly: true}}
                      sx={{ m: 1 }} 
                      id="tfStateOfMotion" 
                      label="StateOfMotion" 
                      variant="outlined"
                      value = { statesOfMotion[motion.body.state - 1] }
                      size='small'
                    />
                  </td>
                </tr>
              )}

              <tr>
                <td>
                  <TextField 
                    fullWidth
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfExectuor" 
                    label={ motion.head.typeOfMotion == 1 ? "Candidate" : "Executor" } 
                    variant="outlined"
                    value = { longSnParser(motion.head.executor.toString()) }
                    size='small'
                  />
                </td>

                <td>
                  <GetVotingRule seq={motion.head.seqOfVR} />
                </td>

                <td colSpan={2}>
                  {motion.head.typeOfMotion < 3 && (
                    <GetPosition 
                      seq={Number(motion.contents)} 
                    />
                  )}

                  {motion.head.typeOfMotion == 3 && snOfDoc && (
                    <Link
                      href={{
                        pathname: motion.head.seqOfVR == 8
                                ? '/comp/roc/Sha'
                                : '/comp/roa/Ia'
                        ,
                        query: {
                          addr: addrOfDoc,
                          snOfDoc: snOfDoc.substring(6, 26),
                        }
                      }}
                      as={motion.head.seqOfVR == 8
                          ? '/comp/roc/Sha'
                          : '/comp/roa/Ia'}
                    >            
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<Article />}
                        sx={{ m:1, height:40 }}
                      >
                        Doc: {addrOfDoc}
                      </Button>
                    </Link>
                  )}

                  {motion.head.typeOfMotion == 4 && (
                    <TextField 
                      fullWidth
                      inputProps={{readOnly: true}}
                      sx={{ m: 1 }} 
                      id="tfHashOfAction" 
                      label="HashOfAction" 
                      variant="outlined"
                      value = { motion.contents.toString(16) }
                      size='small'
                    />                                            
                  )}

                </td>
              </tr>

              {motion.body.state > 2 && voteResult && (
                <tr>
                  <td>
                    <BallotsList 
                      addr={minutes}
                      seqOfMotion={motion.head.seqOfMotion}
                      attitude={ 1 }
                      allVote={voteResult[0]}
                      voteCase={voteResult[1]}
                    />
                  </td>
                  <td>
                    <BallotsList 
                      addr={minutes}
                      seqOfMotion={motion.head.seqOfMotion}
                      attitude={ 3 }
                      allVote={voteResult[0]}
                      voteCase={voteResult[3]}
                    />
                  </td>
                  <td>
                    <BallotsList 
                      addr={minutes}
                      seqOfMotion={motion.head.seqOfMotion}
                      attitude={ 2 }
                      allVote={voteResult[0]}
                      voteCase={voteResult[2]}
                    />
                  </td>                  
                </tr>
              )}

              {motion.body.state == 1 && (
                <tr>
                  <td colSpan={4}>
                    <ProposeMotionToGeneralMeeting seqOfMotion={motion.head.seqOfMotion} setOpen={setOpen} refresh={refresh} />
                  </td>
                </tr>
              )}

              {motion.body.state == 2 && (
                <tr>
                  <td colSpan={4}>
                    <Collapse in={voteIsEnd == false}>
                      <CastVoteOfGm seqOfMotion={motion.head.seqOfMotion} setOpen={setOpen} refresh={refresh} />
                    </Collapse>
                    <Collapse in={voteIsEnd == true}>
                      <VoteCountingOfGm seqOfMotion={motion.head.seqOfMotion} setResult={setVoteIsPassed} setNextStep={()=>{}} setOpen={setOpen} refresh={refresh} />
                    </Collapse>
                  </td>
                </tr>
              )}

              {motion.body.state == 3 && motion.head.typeOfMotion == 1 && (
                <tr>
                  <td colSpan={4}>
                    <TakeSeat 
                      seqOfMotion={motion.head.seqOfMotion} 
                      seqOfPos={Number(motion.contents)} 
                      setOpen={setOpen} refresh={refresh}
                    />
                  </td>
                </tr>
              )}

              {motion.body.state == 3 && motion.head.typeOfMotion == 2 && (
                <tr>
                  <td colSpan={4}>
                    <RemoveDirector 
                      seqOfMotion={motion.head.seqOfMotion} 
                      seqOfPos={Number(motion.contents)} 
                      setOpen={setOpen} 
                      refresh={refresh}
                    />
                  </td>
                </tr>
              )}

              {motion.body.state == 3 && motion.head.typeOfMotion == 4 && (
                <tr>
                  <td colSpan={4}>
                    <ExecActionOfGm seqOfMotion={motion.head.seqOfMotion} seqOfVr={motion.head.seqOfVR} setOpen={setOpen} refresh={refresh} />
                  </td>
                </tr>
              )}
              
            </tbody>
          </table>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" sx={{ m:1, mx:3 }} onClick={()=>setOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>

  )
}