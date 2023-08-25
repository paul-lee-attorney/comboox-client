import { Collapse, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Toolbar } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";

import { Deal } from "../../../../queries/ia";
import { HexType } from "../../../../interfaces";
import { CheckValueOfSwap } from "./ActionsOfSwap/CheckValueOfSwap";

export interface ActionsOfSwapProps{
  ia: HexType;
  deal: Deal;
  seqOfSwap: string;
  setShow: Dispatch<SetStateAction<boolean>>;
}

export function ActionsOfSwap({ia, deal, seqOfSwap, setShow}: ActionsOfSwapProps) {

  const [ typeOfAction, setTypeOfAction ] = useState<string>('0');

  const actionsOfSwap = ['Check Value', 'Payoff Swap', 'Pickup Pledge'];

  const compsOfAction = [
    <CheckValueOfSwap key={0} ia={ia} deal={deal} seqOfSwap={seqOfSwap} setShow={setShow} />,
  ]

  return(
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >
      <Stack direction={'row'} sx={{ alignItems:'center', color:'black' }} >

        <Toolbar sx={{ textDecoration:'underline' }}>
          <h4>Type Of Action:</h4>
        </Toolbar>

        <FormControl variant="outlined" size="small" sx={{ m: 1, minWidth: 168 }}>
          <InputLabel id="typeOfAction-label">TypeOfAction</InputLabel>
          <Select
            labelId="typeOfAction-label"
            id="typeOfAction-select"
            label="TypeOfAction"
            value={ typeOfAction }
            onChange={(e) => setTypeOfAction(e.target.value)}
          >
            {actionsOfSwap.map((v, i) => (
              <MenuItem key={v} value={i} > <b>{v}</b> </MenuItem>
            ))}
          </Select>
        </FormControl>

      </Stack>

      {compsOfAction.map((v,i)=>(
        <Collapse key={i} in={ typeOfAction == i.toString() } >
          {v}
        </Collapse>
      ))}

    </Paper>
  );
}

