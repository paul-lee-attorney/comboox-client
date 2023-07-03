import { useEffect, useState } from "react";

import { Paper, Stack, Box, Stepper, Step, StepLabel, StepContent } from "@mui/material";

import { useComBooxContext } from "../../scripts/ComBooxContext";

import { SetCompId } from "../../components/comp/gk/SetCompId";
import { SetMaxQtyOfMembers } from "../../components/comp/gk/SetMaxQtyOfMembers";
import { InitBos } from "../../components/comp/bos/InitBos";
import { TurnKey } from "../../components/comp/gk/TurnKey";
import { GeneralInfo } from "../../components/comp/gk/GeneralInfo";
import { getBookeeper } from "../../queries/accessControl";
import { getKeeper } from "../../queries/gk";
import { Position, getDirectorsFullPosInfo } from "../../queries/bod";
import { useBookOfDirectorsGetDirectorsFullPosInfo } from "../../generated";


function HomePage() {
  const { gk, boox } = useComBooxContext();
  const [ activeStep, setActiveStep ] = useState<number>();

  useEffect(()=>{
    const checkDirectKeepers = async ()=> {
      if (gk && boox) {
        let dkOfRom = await getBookeeper(boox[8]);
        let romKeeper = await getKeeper(gk, 8);
        let dkOfBos = await getBookeeper(boox[7]);
        let bosKeeper = await getKeeper(gk, 7);
  
        if (dkOfRom == romKeeper && dkOfBos == bosKeeper)
          setActiveStep(4);
        else setActiveStep(0);
      }
    }

    checkDirectKeepers();
  }, [gk, boox])

  return (
    <Stack direction='column' width='100%' height='100%' >
      <Box width={'100%'} height={'100%'} >
        <Paper elevation={3} sx={{m:2, p:1, border:1, height:'100%', borderColor:'divider' }}>

          {activeStep != undefined && activeStep < 4 && (
            <Stepper sx={{ mt: 2, height: 800, alignItems:'start' }} activeStep={ activeStep } orientation="horizontal" >

              <Step index={0} >

                <StepLabel>
                  <h3>Company ID</h3>
                </StepLabel>

                <StepContent sx={{ alignItems:'center', justifyContent:'center'}} >

                  <SetCompId nextStep={setActiveStep} />

                </StepContent>

              </Step>

              <Step index={1} >

                <StepLabel>
                  <h3>Max Members</h3>
                </StepLabel>

                <StepContent sx={{ alignItems:'center', justifyContent:'center'}} >

                  <SetMaxQtyOfMembers nextStep={setActiveStep} />

                </StepContent>

              </Step>

              <Step index={2} >

                <StepLabel>
                  <h3>Book Of Shares</h3>
                </StepLabel>

                <StepContent sx={{ alignItems:'center', justifyContent:'center'}} >

                  <InitBos nextStep={setActiveStep} />

                </StepContent>

              </Step>

              <Step index={3} >

                <StepLabel>
                  <h3>Turn Key</h3>
                </StepLabel>

                <StepContent sx={{ alignItems:'center', justifyContent:'center'}} >

                  <TurnKey nextStep={setActiveStep} />

                </StepContent>

              </Step>

            </Stepper>
          )}

          {activeStep != undefined && activeStep > 3 && (
            <GeneralInfo />
          )}

        </Paper>
      </Box>
    </Stack>
  );
} 

export default HomePage;