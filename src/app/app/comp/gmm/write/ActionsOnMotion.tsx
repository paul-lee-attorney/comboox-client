import { Dispatch, SetStateAction, useState } from "react";

import { Collapse, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Toolbar } from "@mui/material";

import { Motion } from "../../read/meetingMinutes";

import { ProposeMotionToGeneralMeeting } from "./ActionsOnMotion/ProposeMotionToGeneralMeeting";
import { CastVoteOfGm } from "./ActionsOnMotion/CastVoteOfGm";
import { VoteCountingOfGm } from "./ActionsOnMotion/VoteCountingOfGm";
import { TakeSeat } from "./ActionsOnMotion/TakeSeat";
import { RemoveDirector } from "./ActionsOnMotion/RemoveDirector";
import { ExecActionOfGm } from "./ActionsOnMotion/ExecActionOfGm";

export interface ActionsOnMotionProps {
  motion: Motion;
  setOpen: Dispatch<SetStateAction<boolean>>;
  refresh: ()=>void;
}

export interface ActionsOnMotionSelectProps extends ActionsOnMotionProps{
  voteIsEnd: boolean;
}

export function ActionsOnMotion({motion, voteIsEnd, setOpen, refresh}:ActionsOnMotionSelectProps){

  const [ typeOfAction, setTypeOfAction ] = useState<string>('0');
  
  const actionsOnMotion = [
    'Propose Motion', 'Cast Vote', 'Count Results', 'Take Seat', 
    'Remove Director', 'Exec Actions' 
  ]

  const compsOfAction = [
    <ProposeMotionToGeneralMeeting key={0} motion={motion} setOpen={setOpen} refresh={refresh} />,
    <CastVoteOfGm key={1} motion={motion} setOpen = {setOpen} refresh={refresh} />,
    <VoteCountingOfGm key={2} seqOfMotion={motion.head.seqOfMotion} setOpen = {setOpen} refresh={refresh} setResult={(flag:boolean)=>{}} setNextStep={(i:number)=>{}} />,
    <TakeSeat key={3} motion={motion} setOpen = {setOpen} refresh={refresh} />,
    <RemoveDirector key={4} motion={motion} setOpen = {setOpen} refresh={refresh} />,
    <ExecActionOfGm key={5} motion={motion} setOpen = {setOpen} refresh={refresh} />,
  ]

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >
      <Stack direction={'row'} sx={{ alignItems:'center', color:'black', }} >

        <Toolbar  sx={{ textDecoration:'underline' }} >
          <h4>Actions on Motion:</h4>
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
            {actionsOnMotion.map((v, i) => {
              if (motion.body.state == 1 && i != 0) return null;
              else if (motion.body.state == 2 && !voteIsEnd && i != 1) return null;
              else if (motion.body.state == 2 && voteIsEnd && i != 2) return null;
              else if (motion.body.state == 3 && motion.head.typeOfMotion == 1 && i != 3) return null;
              else if (motion.body.state == 3 && motion.head.typeOfMotion == 2 && i != 4) return null;
              else if (motion.body.state == 3 && motion.head.typeOfMotion == 4 && i != 5) return null;
              return (<MenuItem key={v} value={ i } > <b>{v}</b> </MenuItem>);
            })}
          </Select>
        </FormControl>

      </Stack>

      { compsOfAction.map((v,i)=>{
        if (motion.body.state == 1 && i != 0) return null;
        else if (motion.body.state == 2 && !voteIsEnd && i != 1) return null;
        else if (motion.body.state == 2 && voteIsEnd && i != 2) return null;
        else if (motion.body.state == 3 && motion.head.typeOfMotion == 1 && i != 3) return null;
        else if (motion.body.state == 3 && motion.head.typeOfMotion == 2 && i != 4) return null;
        else if (motion.body.state == 3 && motion.head.typeOfMotion == 4 && i != 5) return null;

        return (
          <Collapse key={i} in={ typeOfAction == i.toString() } >
            {v}
          </Collapse>
        );
      }) }

    </Paper>
    
  );
}