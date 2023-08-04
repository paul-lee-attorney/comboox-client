import { useState } from "react";

import { 
  Box, Collapse, 
  FormControlLabel, 
  Paper, Radio, RadioGroup, 
  Stack, Toolbar, 
} from "@mui/material";
import { CreateMotionForOfficer } from "./CreateMotionForOfficer";
import { CreateMotionToApproveDoc } from "./CreateMotionToApproveDoc";
import { CreateAction } from "./CreateAction";

interface CreateMotionProps {
  getMotionsList: () => any,
}

export function CreateMotionOfBoardMeeting({ getMotionsList }: CreateMotionProps) {
  const [ typeOfMotion, setTypeOfMotion ] = useState<string>('officer');

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >
      <Stack direction={'row'} sx={{ alignItems:'center', color:'black' }} >

        <Box sx={{ minWidth:200 }} >
          <Toolbar >
            <h4>Create Motion - Type Of Motion: </h4>
          </Toolbar>
        </Box>

        <RadioGroup
          row
          aria-labelledby="createMotionRadioGrup"
          name="createMotionRadioGroup"
          onChange={(e)=>(setTypeOfMotion(e.target.value))}
          defaultValue={'officer'}
        >
          <FormControlLabel value="officer" control={<Radio size='small' />} label="Nominate/Remove Officer" />
          <FormControlLabel value="doc" control={<Radio size='small' />} label="Approve Document" />
          <FormControlLabel value="action" control={<Radio size='small' />} label="Approve Action" />
        </RadioGroup>

      </Stack>

      <Collapse in={ typeOfMotion == 'officer' } >
        <CreateMotionForOfficer getMotionsList={getMotionsList} />
      </Collapse>

      <Collapse in={ typeOfMotion == 'doc' } >
        <CreateMotionToApproveDoc getMotionsList={getMotionsList} />
      </Collapse>

      <Collapse in={ typeOfMotion == 'action' } >
        <CreateAction getMotionsList={getMotionsList} />
      </Collapse>
    </Paper>
  );
}



