"use client"

import { useEffect, useState } from "react";

import { Paper, Stack, Box, Stepper, Step, StepLabel, StepContent } from "@mui/material";

import { useComBooxContext } from "../../_providers/ComBooxContextProvider";

import { booxMap } from "../common";
import { getDK } from "./common/draftControl";
import { getKeeper } from "./gk";

import { SetMaxQtyOfMembers } from "./components/SetMaxQtyOfMembers";
import { InitBos } from "./components/InitBos";
import { TurnKey } from "./components/TurnKey";
import { GeneralInfo } from "./components/GeneralInfo";
import { SetCompInfo } from "./components/SetCompInfo";


import { Deposits } from "./components/FinStatement/Deposits";
import { getHeadByBody } from "../rc";

function HomePage() {

  const { gk, boox } = useComBooxContext();
  const [ activeStep, setActiveStep ] = useState<number>(4);

  useEffect(()=>{
    if (boox) {
      getDK(boox[booxMap.ROM]).then(
        dk => {
          if (gk) {
            getKeeper(gk, booxMap.ROM).then(
              romKeeper => {
                if (romKeeper != dk) setActiveStep(0);
              }
            )
          }
        }
      )
    }
  }, [boox, gk]);

  const [ isV2, setIsV2 ] = useState(false);

  useEffect(()=>{
    if (gk) {
      getHeadByBody(gk).then(
        head => {
          if (head.version > 1) setIsV2(true);
        }
      )
    }
  }, [gk, setIsV2]);


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

          {/* <Deposits /> */}

        </Paper>
      </Box>
    </Stack>
  );
} 

export default HomePage;