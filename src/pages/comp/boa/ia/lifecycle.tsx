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

import { HexType } from "../../../../interfaces";

import { 
  ShaNavi, 
  LockContents,
  ProposeDocOfGm,
  CirculateIa,
  VoteForDocOfGm,
} from '../../../../components';

import { 
  useInvestmentAgreementGetTypeOfIa, 
} from "../../../../generated";

import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { BigNumber } from "ethers";
import { SignIa } from "../../../../components/comp/boa/ia/SignIa";
import { VoteCountingOfGm } from "../../../../components/comp/bog/VoteCountingOfGm";
import { voteEnded } from "../../../../queries/meetingMinutes";
import { Head, getHeadOfFile } from "../../../../queries/filesFolder";
import { isFinalized } from "../../../../queries/accessControl";

function Lifecycle() {

  const { boox } = useComBooxContext();

  const {query} = useRouter();
  const ia:HexType = `0x${query?.addr?.toString().substring(2)}`;
  const snOfDoc: string = query?.snOfDoc?.toString() ?? '';

  const [ typeOfIa, setTypeOfIa ] = useState<number>();

  const {
    refetch: getTypeOfIa
  } = useInvestmentAgreementGetTypeOfIa({
    address: ia,
    onSuccess(data) {
      setTypeOfIa(data);
    }
  })

  const [ activeStep, setActiveStep ] = useState<number>();

  const [ fileState, setFileState ] = useState<number>();

  const [ seqOfMotion, setSeqOfMotion ] = useState<BigNumber>();

  const [ voteIsPassed, setVoteIsPassed ] = useState<boolean>();

  // const {
  //   data: headOfFile,
  //   refetch: refetchHeadOfFile,
  // } = useFilesFolderGetHeadOfFile({
  //   address: boox[1],
  //   args: [ia],
  //   onSuccess(data) {
  //     setFileState(data.state);
  //   }
  // })

  useEffect(()=>{
    getHeadOfFile(boox[1], ia).then(
      (head:Head) => setFileState(head.state)
    )
  })

  useEffect(()=> {
    if (fileState)
    switch (fileState) {
      case 1: // created
        isFinalized(ia).then(
          (flag) => setActiveStep(flag ? 1: 0)
        );
        break;
      case 2: // circulated
        setActiveStep(fileState);
        break;
      case 3: // established
        setActiveStep(fileState); 
        break;
      case 4: // Proposed
        getHeadOfFile(boox[1], ia).then(
          (head:Head) => {
            setSeqOfMotion(head.seqOfMotion);
            voteEnded(boox[3], head.seqOfMotion).
              then(flag => setActiveStep(
                flag ? 5 : 4
              ));
          }
        );
        break;
      case 5: // Approved
        setActiveStep(6);
        break;
      case 6: // Rejected
        setActiveStep(7);
        break;
      case 7: // Executed
        setActiveStep(8);
        break;
      case 8: // Revoked
        setActiveStep(9);
      break;

    }
  }, [ia, fileState, boox])

  return (
    <>
      <Stack sx={{ width: '100%', alignItems:'center' }} direction={'column'} >
        
        {ia != '0x' && snOfDoc && (
          <ShaNavi contractName={'Investment Agreement'} addr={ ia } snOfDoc={ snOfDoc } thisPath='./lifecycle' />
        )}
                
        <Paper elevation={3}
          sx={{
            m:1, p:1,
            border:1,
            borderColor:'divider'
          }} 
        >
          {activeStep != undefined && (
            <Box sx={{ width:1680 }} >
              <Stepper sx={{ pl:5 }} activeStep={ activeStep } orientation="vertical" >

                <Step index={0} >
                  
                  <StepLabel>
                    <h3>Finalize IA</h3>
                  </StepLabel>
                  <StepContent  >
                    <Typography>
                      Finalize terms & conditions of IA (only for Owner of IA).
                    </Typography>
                    <LockContents addr={ ia } setNextStep={ setActiveStep } />
                  </StepContent>

                </Step>


                <Step index={1} >

                  <StepLabel>
                    <h3>Circulate IA</h3>
                  </StepLabel>
                  <StepContent  >
                    <Typography>
                      Circulate IA to parties for execution (only for Parties of IA).
                    </Typography>
                    <CirculateIa addr={ ia } setNextStep={ setFileState } />
                  </StepContent>

                </Step>

                <Step index={2} >

                  <StepLabel>
                    <h3>Sign IA</h3>
                  </StepLabel>
                  <StepContent  >
                    <Typography>
                      Sign IA to accept its terms (only for Parties of IA).
                    </Typography>
                    <SignIa addr={ ia } setNextStep={ setFileState } />
                  </StepContent>

                </Step>

                <Step index={3} >

                  <StepLabel>
                    <h3>Propose IA</h3>
                  </StepLabel>
                  <StepContent  >
                    <Typography>
                      Propose IA to General Meeting for approval (only for Parties & Members).
                    </Typography>

                    {ia != '0x' && typeOfIa && (
                      <ProposeDocOfGm addr={ ia } seqOfVR={ typeOfIa } setNextStep={ setFileState } />
                    )}

                  </StepContent>

                </Step>

                <Step index={4} >

                  <StepLabel>
                    <h3>Vote for IA</h3>
                  </StepLabel>
                  <StepContent  >
                    <Typography>
                      Cast vote in General Meeting to approve IA.
                    </Typography>

                    {seqOfMotion && (
                      <VoteForDocOfGm seqOfMotion={ seqOfMotion } setNextStep={ setActiveStep } />
                    )}
                  </StepContent>

                </Step>

                <Step index={5} >

                  <StepLabel>
                    <h3>Count Vote</h3>
                  </StepLabel>
                  <StepContent  >
                    <Typography>
                      Count vote result of IA (only for Members).
                    </Typography>
                    {ia != '0x' && seqOfMotion && (
                      <VoteCountingOfGm seqOfMotion={ seqOfMotion } setResult={ setVoteIsPassed } />
                    )}
                  </StepContent>

                </Step>

                <Step index={6} >

                  <StepLabel>
                    <h3>Approved</h3>
                  </StepLabel>
                  <StepContent  >
                    <Typography>
                      IA is Approved.
                    </Typography>
                    
                  </StepContent>

                </Step>

                <Step index={7} >

                  <StepLabel>
                    <h3>Rejected</h3>
                  </StepLabel>
                  <StepContent  >
                    
                    <Typography color={'HighlightText'}>
                      IA is Rejected.
                    </Typography>

                  </StepContent>

                </Step>

                <Step index={8} >

                  <StepLabel>
                    <h3>Executed</h3>
                  </StepLabel>
                  <StepContent  >
                    
                    <Typography color={'HighlightText'}>
                      IA is executed.
                    </Typography>

                  </StepContent>

                </Step>

                <Step index={ 9 } >

                  <StepLabel>
                    <h3>Revoked</h3>
                  </StepLabel>
                  <StepContent  >
                    
                    <Typography color={'HighlightText'}>
                      IA is revoked.
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