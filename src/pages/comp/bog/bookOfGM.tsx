import { BigNumber } from "ethers";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { VotingRule } from "../../../components/comp/boh/rules/VotingRules";
import { useState } from "react";
import { HexType } from "../../../interfaces";
import { bookOfGmABI, useBookOfGmGetSeqList } from "../../../generated";
import { readContract } from "@wagmi/core";
import { Paper, Toolbar } from "@mui/material";
import { GetMotionsList } from "../../../components/common/meetingMinutes/GetMotionsList";
import { CreateMotionOfGm } from "../../../components/comp/bog/CreateMotionOfGm";
import { FlowchartOfMotion } from "../../../components/common/meetingMinutes/FlowchartOfMotion";
import { Share } from "../bos/bookOfShares";

export interface Head {
  typeOfMotion: number;
  seqOfMotion: BigNumber;
  seqOfVR: number;
  creator: number;
  executor: number;
  createDate: number;
  data: number;
}

export interface Body {
  proposer: number;
  proposeDate: number;
  shareRegDate: number;
  voteStartDate: number;
  voteEndDate: number;
  para: number;
  state: number;
}

export interface Motion {
  head: Head,
  body: Body,
  votingRule: VotingRule,
  contents: BigNumber,
}

export function motionSnParser(sn: HexType): Head {
  let head: Head = {
    typeOfMotion: parseInt(sn.substring(2, 6), 16),
    seqOfMotion: BigNumber.from(`0x${sn.substring(6, 22)}`),
    seqOfVR: parseInt(sn.substring(22, 26)),
    creator: parseInt(sn.substring(26, 36)),
    executor: parseInt(sn.substring(36, 46)),
    createDate: parseInt(sn.substring(46, 58)),
    data: parseInt(sn.substring(58, 66)),
  }
  return head;
}

async function getMotion(bog: HexType, seq: BigNumber): Promise<Motion> {
  let motion = await readContract({
    address: bog,
    abi: bookOfGmABI,
    functionName: 'getMotion',
    args: [seq],
  })

  return motion;
}

async function getMotionsList(bog: HexType, seqList: readonly BigNumber[]): Promise<Motion[]> {
  let len = seqList.length;
  let ls: Motion[] = [];
  let i = len >= 100 ? len - 100 : 0;

  while( i < len ) {
    let motion = await getMotion(bog, seqList[i]);
    ls.push(motion);
    i++;
  }

  return ls;
}

function BookOfGM() {

  const { gk, boox } = useComBooxContext();

  const [ motionsList, setMotionsList ] = useState<Motion[]>();

  const {
    refetch: getSeqList
  } = useBookOfGmGetSeqList({
    address: boox[3],
    onSuccess(ls) {
      getMotionsList(boox[3], ls).then(
        list => setMotionsList(list)
      )
    }
  });

  const [ open, setOpen ] = useState(false);
  const [ motion, setMotion ] = useState<Motion>();
  
  return (
    <Paper sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >
      <Toolbar>
        <h3>BOG - Minutes Book Of Shareholders General Meeting</h3>
      </Toolbar>

      <table width={1680}>
        <thead/>

        <tbody>

          <tr>
            <td colSpan={4} >
              <CreateMotionOfGm  getMotionsList={getSeqList} />
            </td>
          </tr>

          <tr>
            <td colSpan={4}>
              {motionsList && (
                <GetMotionsList 
                  list={motionsList} 
                  title="Motions List - General Meeting of Shareholders" 
                  setMotion={setMotion}
                  setOpen={setOpen}
                />
              )}
            </td>
          </tr>

          <tr>
            <td colSpan={4}>
              {motion && (
                <FlowchartOfMotion  open={open} motion={motion} setOpen={setOpen} obtainMotionsList={getSeqList} />
              )}
            </td>
          </tr>

        </tbody>

      </table>


    </Paper>
  );
} 

export default BookOfGM;