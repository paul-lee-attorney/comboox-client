import { Collapse, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Toolbar } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";

import { SetPlatformRule } from "./ActionsOfOwner/SetPlatformRule";
import { TransferOwnership } from "./ActionsOfOwner/TransferOwnership";
import { HandoverCenterKey } from "./ActionsOfOwner/HandoverCenterKey";
import { SetFeedRegistry } from "./ActionsOfOwner/SetFeedRegitry";

export interface ActionsOfOwnerProps{
  setTime: Dispatch<SetStateAction<number>>;
}

export function ActionsOfOwner({ setTime}: ActionsOfOwnerProps) {

  const [ typeOfAction, setTypeOfAction ] = useState<string>('0');
  
  const actionsOfUser = [
    'Set Platform Rule', 'Set Price Feed Registry', 'Transfer Ownership', 'Handover Center Key' 
  ]

  const compsOfAction = [
    <SetPlatformRule key={0} setTime={setTime} />,
    <SetFeedRegistry key={1} setTime={setTime} />,
    <TransferOwnership key={2} setTime={setTime} />,
    <HandoverCenterKey key={3} setTime={setTime} />
  ]

  return( 
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >
      <Stack direction={'row'} sx={{ alignItems:'center', color:'black', }} >

        <Toolbar  sx={{ textDecoration:'underline' }} >
          <h4>Actions of Owner:</h4>
        </Toolbar>

        <FormControl variant="outlined" size="small" sx={{ m:1, mr:5, minWidth: 218 }}>
          <InputLabel id="typeOfAction-label">TypeOfAction</InputLabel>
          <Select
            labelId="typeOfAction-label"
            id="typeOfAction-select"
            label="TypeOfAction"
            value={ typeOfAction }
            onChange={(e) => setTypeOfAction(e.target.value)}
          >
            {actionsOfUser.map((v, i) => (
              <MenuItem key={v} value={ i } > <b>{v}</b> </MenuItem>
            ))}
          </Select>
        </FormControl>

      </Stack>

      { compsOfAction.map((v,i)=>(
          <Collapse key={i} in={ typeOfAction == i.toString() } >
            {v}
          </Collapse>
      )) }

    </Paper>
  );
}

