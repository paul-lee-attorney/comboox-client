import { useEffect, useState } from "react";

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

import { HexType, booxMap } from "../../../../scripts/common";

import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { VoteCountingOfGm } from "../../gmm/VoteMotions/VoteCountingOfGm";
import { voteEnded } from "../../../../scripts/common/meetingMinutes";
import { SignIa } from "./SignIa";
import { CirculateIa } from "./CirculateIa";
import { ProposeDocOfGm } from "../../gmm/VoteMotions/ProposeDocOfGm";
import { VoteForDocOfGm } from "../../gmm/VoteMotions/VoteForDocOfGm";
import { useFilesFolderGetHeadOfFile } from "../../../../generated";
import { FinalizeIa } from "./FinalizeIa";
import { getTypeOfIA } from "../../../../scripts/comp/ia";
import { established } from "../../../../scripts/common/sigPage";


interface IaLifecycleProps {
  ia: HexType;
  isFinalized: boolean;
}

export function IaLifecycle({ia, isFinalized}: IaLifecycleProps) {

  const { boox } = useComBooxContext();
  const [ activeStep, setActiveStep ] = useState<number>(0);
  const [ seqOfMotion, setSeqOfMotion ] = useState<bigint>();

  const [ typeOfIa, setTypeOfIa ] = useState<number>();
  const [ finalized, setFinalized ] = useState<boolean>(isFinalized);

  useEffect(()=>{
    getTypeOfIA(ia).then(
      res => setTypeOfIa(res)
    )
  }, [ia, activeStep])

  useFilesFolderGetHeadOfFile({
    address: boox ? boox[booxMap.ROA] : undefined,
    args: ia ? [ia] : undefined,
    onSuccess(head) {
      let seq = head.seqOfMotion;
      if (seq) setSeqOfMotion(seq);

      let fileState = head.state;
      let flag = false;

      switch (fileState) {
          case 1: 
            setActiveStep(finalized ? 1: 0);
            break;
          case 2:
            established(ia).then(
              flag => setActiveStep(flag ? 3 : 2)
            )
            break;
          case 3: 
            if (boox ) voteEnded(boox[booxMap.GMM], seq).then(
              flag => setActiveStep(flag ? 5 : 4)
            );            
            break;
          case 4: 
            setActiveStep(6);
            break;
          case 5: // Rejected
            setActiveStep(8);
            break;
          default:
            setActiveStep(fileState + 1);
      }

    }
  })


  return (
    <Stack sx={{ width: '100%', alignItems:'center' }} direction={'column'} >
      
      <Paper elevation={3}
        sx={{
          m:1, p:1,
          border:1,
          borderColor:'divider'
        }} 
      >
        {activeStep != undefined && (
          <Box sx={{ width:1280 }} >
            <Stepper sx={{ pl:5 }} activeStep={ activeStep } orientation="vertical" >

              <Step index={0} >
                
                <StepLabel>
                  <h3>Finalize IA</h3>
                </StepLabel>
                <StepContent  >
                  <Typography>
                    Finalize terms & conditions of IA (only for Owner of IA).
                  </Typography>
                  {/* <LockContents addr={ ia } setIsFinalized={setFinalized} setNextStep={ setActiveStep } /> */}

                  <FinalizeIa addr={ ia } setIsFinalized={ setFinalized } setNextStep={ setActiveStep }  />
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
                  <CirculateIa addr={ ia } setNextStep={ setActiveStep } />
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
                  <SignIa addr={ ia } setNextStep={ setActiveStep } />
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
                  {typeOfIa && (
                    <ProposeDocOfGm addr={ ia } seqOfVR={typeOfIa} setNextStep={ setActiveStep } />
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

                  {seqOfMotion != undefined && (
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
                  {seqOfMotion != undefined && (
                    <VoteCountingOfGm seqOfMotion={ seqOfMotion } setResult={()=>{}} setNextStep={ setActiveStep } setOpen={()=>{}} getMotionsList={()=>{}} />
                  )}
                </StepContent>

              </Step>

              <Step index={6} >

                <StepLabel>
                  <h3>Is Approved</h3>
                </StepLabel>
                <StepContent  >
                  <Typography>
                    The IA is approved by Shareholders.
                  </Typography>                  
                </StepContent>

              </Step>

              <Step index={7} >

                <StepLabel>
                  <h3>Closed</h3>
                </StepLabel>
                <StepContent  >
                  
                  <Typography>
                    The IA currently is Closed.
                  </Typography>

                </StepContent>

              </Step>

              <Step index={8} >

                <StepLabel>
                  <h3>Revoked</h3>
                </StepLabel>
                <StepContent  >
                  
                  <Typography>
                    The IA currently is revoked.
                  </Typography>

                </StepContent>

              </Step>

            </Stepper>
          </Box>
        )}

      </Paper>

    </Stack>   
  );
} 