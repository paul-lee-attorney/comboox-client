import { 
  Collapse, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Paper, 
  Select, 
  Stack, 
  Toolbar 
} from "@mui/material";

import { useState } from "react";
import { AddrZero, HexType } from "../../../read";
import { Refule } from "./ActionsOfFule/Refule";
import { FillTank } from "./ActionsOfFule/FillTank";
import { WithdrawIncome } from "./ActionsOfFule/WithdrawIncome";
import { SetRate } from "./ActionsOfFule/SetRate";
import { SetOwner } from "./ActionsOfFule/SetOwner";
import { SetRegCenter } from "./ActionsOfFule/SetRegCenter";

export interface ActionsOfFuleProps{
  user: HexType;
  isOwner: boolean;
  getFinInfo: ()=>void;
  getSetting: ()=>void;
}

export interface ActionOfFuleProps{
  refresh: ()=>void;
}

export function ActionsOfFule({ user, isOwner, getFinInfo, getSetting }: ActionsOfFuleProps) {

  const [ typeOfAction, setTypeOfAction ] = useState<string>('0');
  
  const actionsOfUser = [
    'Refule', 'Fill Tank', 'Withdraw Income', 'Set Rate', 'Set Owner', 'Set RegCenter'
  ]

  const compsOfAction = [
    <Refule key={0} refresh={ getFinInfo } />,
    <FillTank key={1} refresh={ getFinInfo } />,
    <WithdrawIncome key={2} refresh={ getFinInfo } />,
    <SetRate key={3} refresh={ getSetting } />,
    <SetOwner key={4} refresh={ getSetting } />,
    <SetRegCenter key={5} refresh={ getSetting } />,
   ]

  return( 
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >
      <Stack direction={'row'} sx={{ alignItems:'center', color:'black', }} >

        <Toolbar  sx={{ textDecoration:'underline' }} >
          <h4>Actions of User:</h4>
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
            {actionsOfUser.map((v, i) => {
              if (i==0 && user == AddrZero) return null;
              if (i>0 && !isOwner) return null;
              return (<MenuItem key={ v } value={ i } > <b>{v}</b> </MenuItem>);
            })}
          </Select>
        </FormControl>

      </Stack>

      { compsOfAction.map((v,i)=>{
        if (i==0 && user == AddrZero) return null;
        if (i>0 && !isOwner) return null;

        return (
          <Collapse key={i} in={ typeOfAction == i.toString() } >
            {v}
          </Collapse>
        );
      }) }

    </Paper>
  );
}

