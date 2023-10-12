import { useEffect, useState } from "react";

import { Paper, Stack, Box, Stepper, Step, StepLabel, StepContent } from "@mui/material";

import { useComBooxContext } from "../../scripts/common/ComBooxContext";

import { SetMaxQtyOfMembers } from "../../components/comp/rom/SetMaxQtyOfMembers";
import { InitBos } from "../../components/comp/ros/InitBos";
import { TurnKey } from "../../components/comp/gk/TurnKey";
import { GeneralInfo } from "../../components/comp/gk/GeneralInfo";
import { getKeeper } from "../../scripts/comp/gk";
import { SetCompInfo } from "../../components/comp/gk/SetCompInfo";
import { booxMap } from "../../scripts/common";
import { getDK } from "../../scripts/common/accessControl";

function HomePage() {
  const { gk, boox } = useComBooxContext();
  const [ activeStep, setActiveStep ] = useState<number>(0);

  useEffect(()=>{
    if (boox) {
      getDK(boox[booxMap.ROM]).then(
        dk => {
          if (gk) {
            getKeeper(gk, booxMap.ROM).then(
              romKeeper => {
                if (romKeeper == dk) setActiveStep(4);
              }
            )
          }
        }
      )
    }
  }, [boox, gk]);

  return (
    <Stack direction='column' width='100%' height='100%' >
      <Box width={'100%'} height={'100%'} >
        <Paper elevation={3} sx={{m:2, p:1, border:1, height:'100%', borderColor:'divider' }}>

          {activeStep != undefined && activeStep < 4 && (
            <Stepper sx={{ mt: 2, height: 1200, alignItems:'start' }} activeStep={ activeStep } orientation="vertical" >

              <Step index={0} >

                <StepLabel>
                  <h3>Company ID</h3>
                </StepLabel>

                <StepContent sx={{ alignItems:'start', justifyContent:'start', justifyItems:'start'}} >

                  <SetCompInfo nextStep={setActiveStep} />

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
                  <h3>Register Of Shares</h3>
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