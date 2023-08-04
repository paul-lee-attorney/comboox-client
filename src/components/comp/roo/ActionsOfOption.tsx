import { Collapse, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Toolbar } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { UpdateOracle } from "./Actions/UpdateOracle";
import { ExecOption } from "./Actions/ExecOption";
import { PlaceSwapOrder } from "./Actions/PlaceSwapOrder";
import { LockSwapOrder } from "./Actions/LockSwapOrder";
import { ReleaseSwapOrder } from "./Actions/ReleaseSwapOrder";
import { ExecSwapOrder } from "./Actions/ExecSwapOrder";
import { RevokeSwapOrder } from "./Actions/RevokeSwapOrder";

export interface ActionsOfOptionProps{
  seqOfOpt: number;
  setOpen: Dispatch<SetStateAction<boolean>>;
  getAllOpts: ()=>void;
}

export function ActionsOfOption({seqOfOpt, setOpen, getAllOpts}: ActionsOfOptionProps) {

  const [ typeOfAction, setTypeOfAction ] = useState<string>('0');

  const typesOfAction = [
    'Update Oracle', 'Exec Option', 'Place Swap', 'Lock Swap', 
    'Release Swap', 'Exec Swap', 'Revoke Swap'
  ]
  
  const compsOfAction = [
    <UpdateOracle key={0} seqOfOpt={seqOfOpt} setOpen={ setOpen } getAllOpts={ getAllOpts } />,
    <ExecOption key={1} seqOfOpt={seqOfOpt} setOpen={ setOpen } getAllOpts={ getAllOpts } />,
    <PlaceSwapOrder key={2} seqOfOpt={seqOfOpt} setOpen={ setOpen } getAllOpts={ getAllOpts } />,
    <LockSwapOrder key={3} seqOfOpt={seqOfOpt} setOpen={ setOpen } getAllOpts={ getAllOpts } />,
    <ReleaseSwapOrder key={4} seqOfOpt={seqOfOpt} setOpen={ setOpen } getAllOpts={ getAllOpts } />, 
    <ExecSwapOrder key={5} seqOfOpt={seqOfOpt} setOpen={ setOpen } getAllOpts={ getAllOpts } />,
    <RevokeSwapOrder key={6} seqOfOpt={seqOfOpt} setOpen={ setOpen } getAllOpts={ getAllOpts } />
  ]

  return(
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >

      <Stack direction={'row'} sx={{ alignItems:'center', color:'black' }} >

        <Toolbar>
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
            {typesOfAction.map((v, i) => (
              <MenuItem key={v} value={i} ><b>{v}</b></MenuItem>
            ))}
          </Select>
        </FormControl>

      </Stack>

      {compsOfAction.map((v, i) => (
        <Collapse key={i} in={ typeOfAction == i.toString() } >
          {v}
        </Collapse>
      ))}

    </Paper>
  );
}

