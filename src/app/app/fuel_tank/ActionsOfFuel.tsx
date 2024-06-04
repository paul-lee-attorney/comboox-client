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
import { AddrZero, HexType } from "../common";
import { Refule } from "./ActionsOfFuel/Refuel";
import { FillTank } from "./ActionsOfFuel/FillTank";
import { WithdrawIncome } from "./ActionsOfFuel/WithdrawIncome";
import { SetRate } from "./ActionsOfFuel/SetRate";
import { SetNewOwner } from "./ActionsOfFuel/SetNewOwner";

export interface ActionsOfFuelProps{
  user: HexType;
  isOwner: boolean;
  getFinInfo: ()=>void;
  getSetting: ()=>void;
}

export interface ActionOfFuelProps{
  refresh: ()=>void;
}

export function ActionsOfFuel({ user, isOwner, getFinInfo, getSetting }: ActionsOfFuelProps) {

  const [ typeOfAction, setTypeOfAction ] = useState<string>('');
  
  const actionsOfUser = [
    'Refule', 'Fill Tank', 'Withdraw Income', 'Set Rate', 'Set Owner',
  ]

  const compsOfAction = [
    <Refule key={0} refresh={ getFinInfo } />,
    <FillTank key={1} refresh={ getFinInfo } />,
    <WithdrawIncome key={2} refresh={ getFinInfo } />,
    <SetRate key={3} refresh={ getSetting } />,
    <SetNewOwner key={4} refresh={ getSetting } />,
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

