import { Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Paper, TextField, Toolbar } from "@mui/material";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { GetVotingRule } from "../../comp/boh/rules/GetVotingRule";
import { GetPosition } from "../../comp/bod/GetPosition";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HexType } from "../../../interfaces";
import { Article } from "@mui/icons-material";
import { dateParser, longSnParser } from "../../../scripts/toolsKit";
import { ProposeMotionToGeneralMeeting } from "../../comp/bog/ProposeMotionToGeneralMeeting";
import { CastVoteOfGm } from "../../comp/bog/CastVoteOfGm";
import { Motion, VoteCase, getVoteResult, voteEnded } from "../../../queries/meetingMinutes";
import { VoteCountingOfGm } from "../../comp/bog/VoteCountingOfGm";
import { TakeSeat } from "../../comp/bog/TakeSeat";
import { RemoveDirector } from "../../comp/bog/RemoveDirector";
import { ExecActionOfGm } from "../../comp/bog/ExecActionOfGm";
import { BallotsList } from "../../common/meetingMinutes/BallotsList";
import { getSnOfFile } from "../../../queries/filesFolder";

export interface FlowchartOfMotionProps{
  minutes: HexType;
  open: boolean;
  motion: Motion;
  setOpen: (flag: boolean)=>void;
  obtainMotionsList: ()=>any;
}

export const motionType = ['ElectOfficer', 'RemoveDirector', 'ApproveDocument', 'ApproveAction'];

export function FlowchartOfMotion({minutes, open, motion, setOpen, obtainMotionsList}: FlowchartOfMotionProps) {

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
    setAddrOfDoc(`0x${motion.contents.toHexString().padStart(66, '0').substring(26, 66)}`);
    if (boox && addrOfDoc && motion.head.seqOfVR < 9) {
      let folder:HexType = motion.head.seqOfVR == 8
                          ? boox[4] : boox[1];
      getSnOfFile(folder, addrOfDoc).then(
        sn => setSnOfDoc(sn)
      );
    }
  }, [motion, addrOfDoc, boox]);

  const [voteIsEnd, setVoteIsEnd] = useState<boolean>();

  useEffect(()=>{
    if ( boox ) {
      let minutes: HexType =
      motion.votingRule.authority == 1
      ? boox[3] : boox[2];
      voteEnded(minutes, motion.head.seqOfMotion).then(
        flag => {
          setVoteIsEnd(flag);
        }
      ); 
    }
  }, [motion, boox ])

  const [ voteIsPassed, setVoteIsPassed ] = useState<boolean>();

  return (
    <Dialog
      maxWidth={false}
      open={open}
      onClose={()=>setOpen(false)}
      aria-labelledby="dialog-title"
      sx={{m:1, p:1}} 
    >
      <DialogTitle id="dialog-title" sx={{ textDecoration:'underline' }}>
        <h4>{"Flowchart of Motion"}</h4>
      </DialogTitle>
      <DialogContent>
        <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >
          <table width={1580} >
            <thead> 
              <tr>
                <td colSpan={2}>
                  <Toolbar sx={{ color:'black', textDecoration:'underline' }}>
                    <h4> Motion Of General Meeting - {motionType[motion.head.typeOfMotion-1]} </h4>
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
                    <GetPosition seq={motion.contents.toNumber()} />
                  )}

                  {motion.head.typeOfMotion == 3 && snOfDoc && (
                    <Link
                      href={{
                        pathname: motion.head.seqOfVR == 8
                                ? '/comp/boh/Sha'
                                : '/comp/boa/Ia'
                        ,
                        query: {
                          addr: addrOfDoc,
                          snOfDoc: snOfDoc.substring(6, 26),
                        }
                      }}
                      as={motion.head.seqOfVR == 8
                          ? '/comp/boh/sha'
                          : '/comp/boa/ia'}
                    >            
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<Article />}
                        sx={{ m:1 }}
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
                      value = { motion.contents.toHexString() }
                      size='small'
                    />                                            
                  )}

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
                </tr>
              )}

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
                    <ProposeMotionToGeneralMeeting seqOfMotion={motion.head.seqOfMotion} setOpen={setOpen} getMotionsList={obtainMotionsList} />
                  </td>
                </tr>
              )}

              {motion.body.state == 2 && (
                <tr>
                  <td colSpan={4}>
                    <Collapse in={voteIsEnd == false}>
                      <CastVoteOfGm seqOfMotion={motion.head.seqOfMotion} setOpen={setOpen} getMotionsList={obtainMotionsList} />
                    </Collapse>
                    <Collapse in={voteIsEnd == true}>
                      <VoteCountingOfGm seqOfMotion={motion.head.seqOfMotion} setResult={setVoteIsPassed} setNextStep={()=>{}} setOpen={setOpen} getMotionsList={obtainMotionsList} />
                    </Collapse>
                  </td>
                </tr>
              )}

              {motion.body.state == 3 && motion.head.typeOfMotion == 1 && (
                <tr>
                  <td colSpan={4}>
                    <TakeSeat seqOfMotion={motion.head.seqOfMotion.toString()} seqOfPos={motion.contents.toNumber()} setOpen={setOpen} getMotionsList={obtainMotionsList} />
                  </td>
                </tr>
              )}

              {motion.body.state == 3 && motion.head.typeOfMotion == 2 && (
                <tr>
                  <td colSpan={4}>
                    <RemoveDirector seqOfMotion={motion.head.seqOfMotion.toString()} seqOfPos={motion.contents.toNumber()} setOpen={setOpen} getMotionsList={obtainMotionsList} />
                  </td>
                </tr>
              )}

              {motion.body.state == 3 && motion.head.typeOfMotion == 4 && (
                <tr>
                  <td colSpan={4}>
                    <ExecActionOfGm seqOfMotion={motion.head.seqOfMotion} seqOfVr={motion.head.seqOfVR} setOpen={setOpen} getMotionsList={obtainMotionsList} />
                  </td>
                </tr>
              )}


            </tbody>
          </table>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>setOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>

  )
}