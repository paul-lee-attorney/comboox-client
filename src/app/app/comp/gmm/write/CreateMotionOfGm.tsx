import { useState } from "react";

import { 
  Box, Collapse, 
  FormControlLabel, 
  Paper, Radio, RadioGroup, 
  Stack, Toolbar, 
} from "@mui/material";

import { CreateMotionForBoardSeats } from "./CreateMotions/CreateMotionForBoardSeats";
import { CreateMotionForDoc } from "./CreateMotions/CreateMotionForDoc";
import { CreateMotionForAction } from "./CreateMotions/CreateMotionForAction";
import { ProposeToTransferFund } from "./CreateMotions/ProposeToTransferFund";

import { CreateMotionProps } from "../../bmm/write/CreateMotionOfBoardMeeting";

export function CreateMotionOfGm({ refresh }: CreateMotionProps) {

  const nameOfTypes = ['Nominate/Remove Director', 'Approve Document', 'Transfer Fund', 'Approve Action'];
  const compOfTypes = [
    <CreateMotionForBoardSeats key={0} refresh={refresh} />,
    <CreateMotionForDoc key={1} refresh={refresh} />,
    <ProposeToTransferFund key={2} refresh={refresh} />,
    <CreateMotionForAction key={3} refresh={refresh} />,
  ]
  
  const [ typeOfMotion, setTypeOfMotion ] = useState<number>(0);

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >
      <Stack direction={'row'} sx={{ alignItems:'center', color:'black' }} >

        <Box sx={{ minWidth:200 }} >
          <Toolbar sx={{ textDecoration:'underline' }} >
            <h3>Create Motion - Type Of Motion: </h3>
          </Toolbar>
        </Box>

        <RadioGroup
          row
          aria-labelledby="createMotionRadioGrup"
          name="createMotionRadioGroup"
          onChange={(e)=>(setTypeOfMotion(parseInt(e.target.value ?? '0')))}
          defaultValue={0}
        >
          {nameOfTypes.map((v,i) => (
            <FormControlLabel key={i} value={i} control={<Radio size='small' />} label={v} />
          ))}
        </RadioGroup>

      </Stack>

      {compOfTypes.map((v, i) => (
        <Collapse key={i} in={ typeOfMotion == i } >
          {v}
        </Collapse>
      ))}

    </Paper>
  );
}



