import { Alert, Box, Button, Divider, FormControl, InputLabel, MenuItem, Select, Stack, Tooltip, Typography } from "@mui/material";
import { 
  meetingMinutesABI,
  useGeneralKeeperCastVoteOfGm,
  useGeneralKeeperSignSha, 
  useMeetingMinutes, 
  useMeetingMinutesGetCaseOfAttitude, 
  usePrepareGeneralKeeperCastVoteOfGm, 
  usePrepareGeneralKeeperSignSha, 
  useSigPageGetParasOfPage 
} from "../../../../generated";

import { Bytes32Zero, ContractProps, FileHistoryProps, HexType } from "../../../../interfaces";
import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { DriveFileRenameOutline, Fingerprint, HowToVote } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { readContract } from "@wagmi/core";
import { toPercent } from "../../../../scripts/toolsKit";

interface StrParasOfSigPageType {
  circulateDate: number,
  established: boolean,
  counterOfBlanks: string,
  counterOfSigs: string,
  signingDays: string,
  closingDays: string,
}

function parseParasOfPage(data: any): StrParasOfSigPageType {
  let output: StrParasOfSigPageType = {
    circulateDate: data.sigDate,
    established: data.flag,
    counterOfBlanks: data.para.toString(),
    counterOfSigs: data.arg.toString(),
    signingDays: data.seq.toString(),
    closingDays: data.attr.toString(),
  }
  return output;
}

interface VoteCaseType {
  head: number,
  weight: BigNumber,  
}

// async function getVoteCase(addrOfBog: HexType, seqOfMotion: BigNumber, attitude: BigNumber): Promise<VoteCaseType> {
//   let voteCase = await readContract({
//     address: addrOfBog,
//     abi: meetingMinutesABI,
//     functionName: 'getCaseOfAttitude',
//     args: [seqOfMotion, attitude],
//   });

//   let output:VoteCaseType = {
//     head: voteCase.sumOfHead,
//     weight: voteCase.sumOfWeight,
//   }

//   return output;
// }

// async function getVoteResult( addrOfBog: HexType, addrOfSha: HexType ): Promise<VoteCaseType[]> {
//   let len = 4;
//   let output:VoteCaseType[] = [];

//   while (len > 0) {
//     let item = await getVoteCase(
//       addrOfBog, 
//       BigNumber.from(addrOfSha), 
//       BigNumber.from(len-1)
//     );
//     output.push(item);
//     len--;
//   }

//   return output;
// }

interface VoteForShaProps {
  seqOfMotion: BigNumber | undefined ;
  setNextStep: (next: number) => void;
}

export function VoteForSha({ seqOfMotion, setNextStep }: VoteForShaProps) {

  const [ voteResult, setVoteResult ] = useState<VoteCaseType[]>([]);
  const { gk, boox } = useComBooxContext();


  const {
    refetch: refetchAll
  } = useMeetingMinutesGetCaseOfAttitude({
    address: boox[3],
    args: seqOfMotion ? [seqOfMotion, BigNumber.from('0')] : undefined,
    onSuccess(data) {
      setVoteResult(v => {
        let arr = [...v];
        arr[0] = {
          head: data.sumOfHead,
          weight: data.sumOfWeight,
        };
        return arr;
      })
    }
  })

  const {
    refetch: refetchSupport
  } = useMeetingMinutesGetCaseOfAttitude({
    address: boox[3],
    args: [seqOfMotion, BigNumber.from('1')],
    onSuccess(data) {
      setVoteResult(v => {
        let arr = [...v];
        arr[1] = {
          head: data.sumOfHead,
          weight: data.sumOfWeight,
        };
        return arr;
      })
    }
  })

  const {
    refetch: refetchAgainst
  } = useMeetingMinutesGetCaseOfAttitude({
    address: boox[3],
    args: [seqOfMotion, BigNumber.from('2')],
    onSuccess(data) {
      setVoteResult(v => {
        let arr = [...v];
        arr[2] = {
          head: data.sumOfHead,
          weight: data.sumOfWeight,
        };
        return arr;
      })
    }
  })

  const {
    refetch: refetchAbstain
  } = useMeetingMinutesGetCaseOfAttitude({
    address: boox[3],
    args: [seqOfMotion, BigNumber.from('3')],
    onSuccess(data) {
      setVoteResult(v => {
        let arr = [...v];
        arr[3] = {
          head: data.sumOfHead,
          weight: data.sumOfWeight,
        };
        return arr;
      })
    }
  })

  const [ attitude, setAttitude ] = useState('3');

  const { 
    config
  } =  usePrepareGeneralKeeperCastVoteOfGm ({
    address: gk,
    args: [ seqOfMotion, BigNumber.from(attitude), Bytes32Zero ],
  });

  const {
    data,
    isLoading,
    write
  } = useGeneralKeeperCastVoteOfGm({
    ...config,
    onSuccess() {
      refetchAll();
      refetchSupport();
      refetchAgainst();
      refetchAbstain();
    }
  });

  return (
    <Stack direction={'row'} sx={{m:1, p:1, alignItems:'center'}}>

      <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="attitude-lable">Authority</InputLabel>
        <Select
          labelId="attitude-lable"
          id="attitude-select"
          value={ attitude }
          onChange={(e) => setAttitude(e.target.value)}

          label="Attitude"
        >
          <MenuItem value={'1'}>Support</MenuItem>
          <MenuItem value={'2'}>Against</MenuItem>
          <MenuItem value={'3'}>Abstain</MenuItem>
        </Select>
      </FormControl>

      <Button
        disabled={!write || isLoading}
        variant="contained"
        endIcon={<HowToVote />}
        sx={{ m:1, minWidth:218 }}
        onClick={()=>write?.()}
      >
        Cast Vote
      </Button>

        <Box sx={{ minWidth:880 }} >        
          <Alert 
            variant='outlined' 
            severity='info' 
            sx={{ height: 55,  m: 1 }} 
          >
            <Typography>
              Support: { voteResult[1]?.weight.toString() } by { voteResult[1]?.head.toString() } member(s) {' | '}
              Against: { voteResult[2]?.weight.toString() } by { voteResult[2]?.head.toString() } member(s) {' | '}
              Abstain: { voteResult[3]?.weight.toString() } by { voteResult[3]?.head.toString() } member(s)

              {voteResult[0]?.weight.toNumber() > 0 ?
                ' | Support Ratio:' + toPercent(voteResult[1]?.weight.mul(10000).div(voteResult[0]?.weight).toNumber()/10000) :
                ''
              }
            </Typography>

          </Alert>
        </Box>  

    </Stack>
  )

}