import { Collapse, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Toolbar } from "@mui/material";
import { useState } from "react";
import { RegInvestor } from "./ActionsOfInvestor/RegInvestor";
import { ApproveInvestor } from "./ActionsOfInvestor/ApproveInvestor";
import { RevokeInvestor } from "./ActionsOfInvestor/RevokeInvestor";

export interface ActionsOfInvestorProps{
  acct: string;
  getAllInvestors: ()=>void;
}

export function ActionsOfInvestor({ acct: acct, getAllInvestors: getAllInvestors}: ActionsOfInvestorProps) {

  const [ typeOfAction, setTypeOfAction ] = useState<string>('0');
  
  const actionsOfListing = [
    'Register Investor', 'Approve Investor', 'Revoke Investor'
  ]

  const compsOfAction = [
    <RegInvestor key={0} acct={ acct } getAllInvestors={ getAllInvestors }  />,
    <ApproveInvestor key={1} acct={ acct } getAllInvestors={ getAllInvestors }  />,
    <RevokeInvestor key={2} acct={ acct } getAllInvestors={ getAllInvestors }  />,
  ]

  return(
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >
      <Stack direction={'row'} sx={{ alignItems:'center', color:'black' }} >

        <Toolbar>
          <h4>Register / Approve Investor:</h4>
        </Toolbar>

        <FormControl variant="outlined" size="small" sx={{ m: 1, minWidth: 218 }}>
          <InputLabel id="typeOfAction-label">TypeOfAction</InputLabel>
          <Select
            labelId="typeOfAction-label"
            id="typeOfAction-select"
            label="TypeOfAction"
            value={ typeOfAction }
            onChange={(e) => setTypeOfAction(e.target.value)}
          >
            {actionsOfListing.map((v, i) => (
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

