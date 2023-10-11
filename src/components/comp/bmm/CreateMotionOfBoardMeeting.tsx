import { Dispatch, SetStateAction, useState } from "react";

import { 
  Box, Collapse, 
  FormControlLabel, 
  Paper, Radio, RadioGroup, 
  Stack, Toolbar, 
} from "@mui/material";
import { CreateMotionForOfficer } from "./CreateMotions/CreateMotionForOfficer";
import { CreateMotionToApproveDoc } from "./CreateMotions/CreateMotionToApproveDoc";
import { CreateAction } from "./CreateMotions/CreateAction";
import { ProposeToTransferFund } from "./CreateMotions/ProposeToTransferFund";

export interface CreateMotionProps {
  refresh: ()=>void;
}

export function CreateMotionOfBoardMeeting({ refresh }: CreateMotionProps) {

  const nameOfTypes = ['Nominate/Remove Officer', 'Approve Document', 'Transfer Fund', 'Approve Action'];

  const compOfTypes = [
    <CreateMotionForOfficer key={0} refresh={refresh} />,
    <CreateMotionToApproveDoc key={1} refresh={refresh} />,
    <ProposeToTransferFund key={2} refresh={refresh} />,
    <CreateAction key={3} refresh={refresh} />,
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
          onChange={(e)=>setTypeOfMotion(parseInt(e.target.value ?? '0'))}
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



