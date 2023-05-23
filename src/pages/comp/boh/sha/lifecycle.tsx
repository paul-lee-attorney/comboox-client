import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { 
  Stack,
  Paper,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
} from "@mui/material";

import { AddrZero, Bytes32Zero, HexType } from "../../../../interfaces";

import { 
  ShaNavi, 
  CirculateSha,
  FinalizeSha,
  ProposeSha,
  SignSha,
  VoteForSha,
  VoteCounting,
  ActivateSha,
} from '../../../../components';

import { 
  accessControlABI,
  filesFolderABI,
  meetingMinutesABI,
  useAccessControl, 
  useAccessControlFinalized, 
  useFilesFolderGetHeadOfFile, 
  useMeetingMinutes, 
  useMeetingMinutesVoteEnded 
} from "../../../../generated";

import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { BigNumber } from "ethers";
import { readContract } from "@wagmi/core";

async function finalized(sha: HexType): Promise<boolean> {
  let flag = await readContract({
    address: sha,
    abi: accessControlABI,
    functionName: 'finalized',
  })

  return flag;
}

async function getSeqOfMotion(boh: HexType, sha: HexType): Promise<BigNumber>{
  let head = await readContract({
    address: boh,
    abi: filesFolderABI,
    functionName: 'getHeadOfFile',
    args: [ sha ],
  });

  return head.seqOfMotion;
}

async function voteEnded(bog: HexType, seqOfMotion: BigNumber): Promise<boolean> {
  let flag = await readContract({
    address: bog,
    abi: meetingMinutesABI,
    functionName: 'voteEnded',
    args: [ seqOfMotion ],
  })

  return flag;
}

function Lifecycle() {

  const { boox } = useComBooxContext();

  const {query} = useRouter();
  const sha:HexType = `0x${query?.addr?.toString().substring(2)}`;

  const [ activeStep, setActiveStep ] = useState<number>();

  // const [ finalized, setFinalized ] = useState(false);

  // const {
  //   refetch: refetchFinalized
  // } = useAccessControlFinalized({
  //   address: sha,
  //   onSuccess(flag) {
  //     setFinalized(flag);
  //   }
  // });

  // const [ voteEnded, setVoteEnded ] = useState(false);
  
  // const {
  //   refetch: refetchVoteEnded
  // } = useMeetingMinutesVoteEnded({
  //   address: boox[3],
  //   args: [BigNumber.from(sha)],
  //   onSuccess(flag) {
  //     setVoteEnded(flag);
  //   }
  // })

  const [ fileState, setFileState ] = useState<number>();

  const {
    data: headOfFile,
    refetch: refetchFileState
  } = useFilesFolderGetHeadOfFile({
    address: boox[4],
    args: [sha],
    onSuccess(data) {
      setFileState(data.state);
    }
  })

  useEffect(()=> {
    if (fileState)
    switch (fileState) {
      case 1: 
        finalized(sha).then(
          (flag) => setActiveStep(flag ? 1: 0)
        );
        break;
      case 2: 
        setActiveStep(fileState);
        break;
      case 3: // Propose Sha
        setActiveStep(fileState); 
        break;
      case 4: // Vote for Sha
        getSeqOfMotion(boox[4], sha).then(
          seqOfMotion => voteEnded(boox[3], seqOfMotion).
            then(flag => setActiveStep(
              flag ? 5: 4
            ))
        );
        break;
      case 5: 
        setActiveStep(6);
        break;
      case 6: 
        setActiveStep(8);
        break;
      case 7: 
        setActiveStep(7);
        break;
    }
  }, [sha, fileState, boox])

  // useEffect(() => {
  //   console.log('sha: ', sha);
  //   if (query.addr)
  //     setSha(`0x${query.addr.toString().substring(2)}`);
  //   console.log('sha: ', sha);
  // }, [query.addr, sha])

  // useEffect(()=>{
  //   refetchFileState();
  // });

  return (
    <>
      <Stack sx={{ width: '100%', alignItems:'center' }} direction={'column'} >
        <ShaNavi contractName={'Shareholders Agreement'} addr={ sha } thisPath='./lifecycle' />
        
        <Paper
          sx={{
            m:1, p:1,
            border:1,
            borderColor:'divider'
          }} 
        >
          {activeStep != undefined && (
            <Box sx={{ width:1440 }} >
              <Stepper sx={{ pl:5 }} activeStep={ activeStep } orientation="vertical" >

                <Step index={0} >
                  
                  <StepLabel>
                    <h3>Finalize SHA</h3>
                  </StepLabel>
                  <StepContent  >
                    <Typography>
                      Finalize terms & conditions of SHA (only for Owner of SHA).
                    </Typography>
                    <FinalizeSha addr={ sha } setNextStep={ setActiveStep } />
                  </StepContent>

                </Step>


                <Step index={1} >

                  <StepLabel>
                    <h3>Circulate SHA</h3>
                  </StepLabel>
                  <StepContent  >
                    <Typography>
                      Circulate SHA to parties for execution (only for Parties of SHA).
                    </Typography>
                    <CirculateSha addr={ sha } setNextStep={ setFileState } />
                  </StepContent>

                </Step>

                <Step index={2} >

                  <StepLabel>
                    <h3>Sign SHA</h3>
                  </StepLabel>
                  <StepContent  >
                    <Typography>
                      Sign SHA to accept its terms (only for Parties of SHA).
                    </Typography>
                    <SignSha addr={ sha } setNextStep={ setFileState } />
                  </StepContent>

                </Step>

                <Step index={3} >

                  <StepLabel>
                    <h3>Propose SHA</h3>
                  </StepLabel>
                  <StepContent  >
                    <Typography>
                      Propose SHA to General Meeting for approval (only for Parties & Members).
                    </Typography>
                    <ProposeSha addr={ sha } setNextStep={ setFileState } />
                  </StepContent>

                </Step>

                <Step index={4} >

                  <StepLabel>
                    <h3>Vote for SHA</h3>
                  </StepLabel>
                  <StepContent  >
                    <Typography>
                      Cast vote in General Meeting to approve SHA.
                    </Typography>

                    <VoteForSha addr={ sha } setNextStep={ setActiveStep } />
                  </StepContent>

                </Step>

                <Step index={5} >

                  <StepLabel>
                    <h3>Count Vote</h3>
                  </StepLabel>
                  <StepContent  >
                    <Typography>
                      Count vote result of SHA review (only for Members).
                    </Typography>
                    <VoteCounting addr={ sha } setNextStep={ setFileState } />
                  </StepContent>

                </Step>

                <Step index={6} >

                  <StepLabel>
                    <h3>Activate SHA</h3>
                  </StepLabel>
                  <StepContent  >
                    <Typography>
                      Activate SHA into leagal forces (only for Parties of SHA).
                    </Typography>
                    <ActivateSha addr={ sha } setNextStep={ setFileState } />
                    
                  </StepContent>

                </Step>

                <Step index={7} >

                  <StepLabel>
                    <h3>Be In Force</h3>
                  </StepLabel>
                  <StepContent  >
                    
                    <Typography color={'HighlightText'}>
                      The SHA currently is In Force.
                    </Typography>

                  </StepContent>

                </Step>

                <Step index={8} >

                  <StepLabel>
                    <h3>Be Revoked</h3>
                  </StepLabel>
                  <StepContent  >
                    
                    <Typography color={'HighlightText'}>
                      SHA currently is revoked.
                    </Typography>

                  </StepContent>

                </Step>

              </Stepper>
            </Box>
          )}

        </Paper>

      </Stack>    
    
    </>
  );
} 

export default Lifecycle;