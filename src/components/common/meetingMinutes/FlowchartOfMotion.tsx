import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Toolbar } from "@mui/material";
import { Motion } from "../../../pages/comp/bog/bookOfGM";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { GetVotingRule } from "../../comp/boh/rules/GetVotingRule";
import { GetPosition } from "../../comp/bod/GetPosition";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HexType } from "../../../interfaces";
import { filesFolderABI } from "../../../generated";
import { readContract } from "@wagmi/core";
import { Article } from "@mui/icons-material";
import { dateParser, longSnParser } from "../../../scripts/toolsKit";
import { ProposeMotionOfGm } from "../../comp/bog/ProposeMotionOfGm";
import { CastVoteOfGm } from "../../comp/bog/CastVoteOfGm";
import { VoteCase, getVoteResult } from "../../comp/bog/VoteForDocOfGm";
import { BallotsList } from "./BallotsList";

export interface FlowchartOfMotionProps{
  open: boolean,
  motion: Motion,
  setOpen: (flag: boolean)=>void,
  obtainMotionsList: ()=>any,
}

export const motionType = ['ElectOfficer', 'RemoveOfficer', 'ApproveDocument', 'ApproveAction'];

async function getSnOfFile(folder: HexType, addr: HexType): Promise<HexType>{
  let sn:HexType = await readContract({
    address: folder,
    abi: filesFolderABI,
    functionName: 'getSNOfFile',
    args: [addr],
  })
  return sn;
}

export function FlowchartOfMotion({open, motion, setOpen, obtainMotionsList}: FlowchartOfMotionProps) {

  const { boox } = useComBooxContext();

  const [ voteResult, setVoteResult ] = useState<VoteCase[]>();

  useEffect(()=>{
    getVoteResult(motion.head.seqOfMotion, boox[3]).then(
      list => setVoteResult(list)
    )
  }, [motion, boox]);

  const [ addrOfDoc, setAddrOfDoc ]=useState<HexType>();
  const [ snOfDoc, setSnOfDoc ] = useState<string>();

  useEffect(()=>{
    setAddrOfDoc(`0x${motion.contents.toHexString().padStart(66, '0').substring(26, 66)}`);
    if (addrOfDoc && motion.head.seqOfVR < 9) {
      let folder:HexType = motion.head.seqOfVR == 8
                          ? boox[4] : boox[1];
      getSnOfFile(folder, addrOfDoc).then(
        sn => setSnOfDoc(sn)
      );
    }
  }, [motion, addrOfDoc, boox]);

  return (
    <Dialog
      maxWidth="xl"
      open={open}
      onClose={()=>setOpen(false)}
      aria-labelledby="dialog-title"
      sx={{m:1, p:1}} 
    >
      <DialogTitle id="dialog-title">
        {"Flowchart of Motion"}
      </DialogTitle>
      <DialogContent>
          <table width={1280} >
            <thead> 
              <tr>
                <td colSpan={2}>
                  <Toolbar>
                    <h4> Motion Of General Meeting - {motionType[motion.head.typeOfMotion-1]} </h4>
                  </Toolbar>
                </td>
                <td colSpan={2}>
                  <Toolbar>
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

              {/* {(motion.head.typeOfMotion == 1 || motion.head.typeOfMotion == 2) && ( */}
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
                                  ? '/comp/boh/sha/bodyTerms'
                                  : '/comp/boa/ia/bodyTerms'
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
                      addr={boox[3]}
                      seqOfMotion={motion.head.seqOfMotion}
                      attitude={ 1 }
                      allVote={voteResult[0]}
                      voteCase={voteResult[1]}
                    />
                  </td>
                  <td>
                    <BallotsList 
                      addr={boox[3]}
                      seqOfMotion={motion.head.seqOfMotion}
                      attitude={ 3 }
                      allVote={voteResult[0]}
                      voteCase={voteResult[3]}
                    />
                  </td>
                  <td>
                    <BallotsList 
                      addr={boox[3]}
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
                  <ProposeMotionOfGm seqOfMotion={motion.head.seqOfMotion.toString()} setOpen={setOpen} getMotionsList={obtainMotionsList} />
                  </td>
                </tr>
              )}

              {motion.body.state == 2 && (
                <tr>
                  <td colSpan={4}>
                  <CastVoteOfGm seqOfMotion={motion.head.seqOfMotion} setOpen={setOpen} getMotionsList={obtainMotionsList} />
                  </td>
                </tr>
              )}


            </tbody>
          </table>

      </DialogContent>
      <DialogActions>
        <Button onClick={()=>setOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>

  )
}