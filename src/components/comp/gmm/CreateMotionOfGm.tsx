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

interface CreateMotionProps {
  getMotionsList: () => any,
}

export function CreateMotionOfGm({ getMotionsList }: CreateMotionProps) {
  const [ typeOfMotion, setTypeOfMotion ] = useState<string>('director');

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
          defaultValue={'director'}
        >
          <FormControlLabel value="director" control={<Radio size='small' />} label="Nominate/Remove Director" />
          <FormControlLabel value="doc" control={<Radio size='small' />} label="Approve Document" />
          <FormControlLabel value="action" control={<Radio size='small' />} label="Approve Action" />
        </RadioGroup>

      </Stack>

      <Collapse in={ typeOfMotion == 'director' } >
        <CreateMotionForBoardSeats getMotionsList={getMotionsList} />
      </Collapse>

      <Collapse in={ typeOfMotion == 'doc' } >
        <CreateMotionForDoc getMotionsList={getMotionsList} />
      </Collapse>

      <Collapse in={ typeOfMotion == 'action' } >
        <CreateMotionForAction getMotionsList={getMotionsList} />
      </Collapse>
    </Paper>
  );
}



