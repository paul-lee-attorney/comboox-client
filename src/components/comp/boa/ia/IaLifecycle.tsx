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
import { BigNumber } from "ethers";
import { VoteCountingOfGm } from "../../bog/VoteCountingOfGm";
import { voteEnded } from "../../../../queries/meetingMinutes";
import { getHeadOfFile } from "../../../../queries/filesFolder";
import { SignIa } from "./SignIa";
import { getTypeOfIA } from "../../../../queries/ia";
import { LockContents } from "../../../common/accessControl/LockContents";
import { CirculateIa } from "./CirculateIa";
import { ProposeDocOfGm } from "../../bog/ProposeDocOfGm";
import { VoteForDocOfGm } from "../../bog/VoteForDocOfGm";

interface IaLifecycleProps {
  ia: HexType;
  isFinalized: boolean;
}

export function IaLifecycle({ia, isFinalized}: IaLifecycleProps) {

  const { boox } = useComBooxContext();
  const [ activeStep, setActiveStep ] = useState<number>();
  const [ seqOfMotion, setSeqOfMotion ] = useState<BigNumber>();

  const [ typeOfIa, setTypeOfIa ] = useState<number>();
  const [ finalized, setFinalized ] = useState<boolean>(isFinalized);

  useEffect(()=>{
    const obtainTypeOfIa = async ()=>{
      let typeOfIa = await getTypeOfIA(ia);
      setTypeOfIa(typeOfIa);
    };

    obtainTypeOfIa();
  })

  useEffect(()=>{
    const updateActiveStep = async () => {

      if (boox) {

        let head = await getHeadOfFile(boox[1], ia);
        let fileState = head.state;
        let seq = head.seqOfMotion;
        let nextStep = 0;
        
        switch (fileState) {
          case 1: 
            nextStep = finalized ? 1: 0;
            break;
          case 4: 
            let flag = await voteEnded(boox[3], seq);
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
  }, [boox, ia, isFinalized]);

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
                  <LockContents addr={ ia } setIsFinalized={setFinalized} setNextStep={ setActiveStep } />
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
                  {seqOfMotion && (
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