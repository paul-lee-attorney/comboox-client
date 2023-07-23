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

import { HexType } from "../../../../interfaces";

import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { VoteCountingOfGm } from "../../gmm/VoteCountingOfGm";
import { voteEnded } from "../../../../queries/meetingMinutes";
import { getHeadOfFile } from "../../../../queries/filesFolder";
import { CirculateSha } from "./CirculateSha";
import { SignSha } from "./SignSha";
import { ProposeDocOfGm } from "../../gmm/ProposeDocOfGm";
import { VoteForDocOfGm } from "../../gmm/VoteForDocOfGm";
import { ActivateSha } from "./ActivateSha";
import { FinalizeSha } from "./FinalizeSha";

interface ShaLifecycleProps {
  sha: HexType;
  isFinalized: boolean;
}

export function ShaLifecycle({sha, isFinalized}: ShaLifecycleProps) {

  const { boox } = useComBooxContext();
  const [ activeStep, setActiveStep ] = useState<number>();
  const [ seqOfMotion, setSeqOfMotion ] = useState<bigint>();
  const [ passed, setPassed ] = useState<boolean>(false);
  const [ finalized, setFinalized ] = useState<boolean>(isFinalized);

  useEffect(()=>{
    const updateActiveStep = async () => {

      if (boox) {

        let head = await getHeadOfFile(boox[1], sha);
        let fileState = head.state;
        let seq = head.seqOfMotion;
        let nextStep = 0;
        
        switch (fileState) {
          case 1: 
            nextStep = finalized ? 1: 0;
            break;
          case 4: 
            let flag = await voteEnded(boox[5], seq);
            nextStep = flag ? 5 : 4;
            break;
          case 5: 
            nextStep = 6;
            break;
          case 6: // Rejected
            nextStep = 8;
            break;
          default:
            nextStep = fileState;
        }
  
        setActiveStep( nextStep );
  
        if (seq) setSeqOfMotion(seq); 
      }
    };

    updateActiveStep();
  }, [boox, sha, finalized, passed, activeStep]);

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
                  <h3>Finalize SHA</h3>
                </StepLabel>
                <StepContent  >
                  <Typography>
                    Finalize terms & conditions of SHA (only for Owner of SHA).
                  </Typography>
                  <FinalizeSha isSha={true} addr={ sha } setIsFinalized={setFinalized} setNextStep={ setActiveStep } />
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
                  <CirculateSha addr={ sha } setNextStep={ setActiveStep } />
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
                  <SignSha addr={ sha } setNextStep={ setActiveStep } />
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
                  <ProposeDocOfGm addr={ sha } seqOfVR={8} setNextStep={ setActiveStep } />
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

                  {seqOfMotion?.toString() && (
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
                    Count vote result of SHA (only for Members).
                  </Typography>
                  {seqOfMotion?.toString() && (
                    <VoteCountingOfGm seqOfMotion={ seqOfMotion } setResult={setPassed} setNextStep={ setActiveStep } setOpen={()=>{}} getMotionsList={()=>{}}/>
                  )}
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
                  <ActivateSha addr={ sha } setNextStep={ setActiveStep } />
                  
                </StepContent>

              </Step>

              <Step index={7} >

                <StepLabel>
                  <h3>In Force</h3>
                </StepLabel>
                <StepContent  >
                  
                  <Typography color={'HighlightText'}>
                    The SHA currently is In Force.
                  </Typography>

                </StepContent>

              </Step>

              <Step index={8} >

                <StepLabel>
                  <h3>Revoked</h3>
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
  );
} 
