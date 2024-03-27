import { useState } from "react";

import { 
  Box, Collapse, 
  FormControlLabel, 
  Paper, Radio, RadioGroup, 
  Stack, Toolbar, Typography, 
} from "@mui/material";

import { CreateMotionForBoardSeats } from "./create_motions/CreateMotionForBoardSeats";
import { CreateMotionForDoc } from "./create_motions/CreateMotionForDoc";
import { CreateMotionForAction } from "./create_motions/CreateMotionForAction";
import { ProposeToTransferFund } from "./create_motions/ProposeToTransferFund";
import { ProposeToDistributeProfits } from "./create_motions/ProposeToDistributeProfits";

import { CreateMotionProps } from "../../bmm/components/CreateMotionOfBoardMeeting";

export function CreateMotionOfGm({ refresh }: CreateMotionProps) {

  const nameOfTypes = [
    'Nominate/Remove Director', 'Approve Document', 'Transfer Fund', 
    'Distribute Profits', 'Approve Action', 
  ];

  const compOfTypes = [
    <CreateMotionForBoardSeats key={0} refresh={refresh} />,
    <CreateMotionForDoc key={1} refresh={refresh} />,
    <ProposeToTransferFund key={2} refresh={refresh} />,
    <ProposeToDistributeProfits key={3} refresh={refresh} />,
    <CreateMotionForAction key={4} refresh={refresh} />,
  ]
  
  const [ typeOfMotion, setTypeOfMotion ] = useState<number>(0);

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >
      <Stack direction={'row'} sx={{ alignItems:'center', color:'black' }} >

        <Box sx={{ minWidth:200 }} >
          <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
            <b>Create Motion - Type Of Motion: </b>
          </Typography>
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



