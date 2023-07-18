import { Collapse, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Toolbar } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { UpdateOracle } from "./UpdateOracle";
import { ExecOption } from "./ExecOption";
import { PlaceSwapOrder } from "./PlaceSwapOrder";
import { LockSwapOrder } from "./LockSwapOrder";
import { ReleaseSwapOrder } from "./ReleaseSwapOrder";
import { ExecSwapOrder } from "./ExecSwapOrder";
import { RevokeSwapOrder } from "./RevokeSwapOrder";

export interface ActionsOfOptionProps{
  seqOfOpt: number;
  setOpen: Dispatch<SetStateAction<boolean>>;
  getAllOpts: ()=>void;
}

export function ActionsOfOption({seqOfOpt, setOpen, getAllOpts}: ActionsOfOptionProps) {

  const [ typeOfAction, setTypeOfAction ] = useState<string>('0');
  
  return(
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >
      <Stack direction={'row'} sx={{ alignItems:'center', color:'black' }} >

        <Toolbar>
          <h4>Type Of Action:</h4>
        </Toolbar>

        <FormControl variant="filled" sx={{ m: 1, minWidth: 168 }}>
          <InputLabel id="typeOfAction-label">TypeOfAction</InputLabel>
          <Select
            labelId="typeOfAction-label"
            id="typeOfAction-select"
            value={ typeOfAction }
            onChange={(e) => setTypeOfAction(e.target.value)}
          >
            <MenuItem value={ '0' } > Update Oracle </MenuItem>
            <MenuItem value={ '1' } > Exec Option </MenuItem>
            <MenuItem value={ '2' } > Place Swap Order </MenuItem>
            <MenuItem value={ '3' } > Lock Swap Order </MenuItem>
            <MenuItem value={ '4' } > Release Swap Order </MenuItem>
            <MenuItem value={ '5' } > Exec Swap Order </MenuItem>
            <MenuItem value={ '6' } > Revoke Swap Order </MenuItem>
          </Select>
        </FormControl>

      </Stack>

      <Collapse in={ typeOfAction == '0' } >
        <UpdateOracle seqOfOpt={seqOfOpt} setOpen={ setOpen } getAllOpts={ getAllOpts } />
      </Collapse>

      <Collapse in={ typeOfAction == '1' } >
        <ExecOption seqOfOpt={seqOfOpt} setOpen={ setOpen } getAllOpts={ getAllOpts } />
      </Collapse>

      <Collapse in={ typeOfAction == '2' } >
        <PlaceSwapOrder seqOfOpt={seqOfOpt} setOpen={ setOpen } getAllOpts={ getAllOpts } />
      </Collapse>

      <Collapse in={ typeOfAction == '3' } >
        <LockSwapOrder seqOfOpt={seqOfOpt} setOpen={ setOpen } getAllOpts={ getAllOpts } />
      </Collapse>

      <Collapse in={ typeOfAction == '4' } >
        <ReleaseSwapOrder seqOfOpt={seqOfOpt} setOpen={ setOpen } getAllOpts={ getAllOpts } />
      </Collapse>

      <Collapse in={ typeOfAction == '5' } >
        <ExecSwapOrder seqOfOpt={seqOfOpt} setOpen={ setOpen } getAllOpts={ getAllOpts } />
      </Collapse>

      <Collapse in={ typeOfAction == '6' } >
        <RevokeSwapOrder seqOfOpt={seqOfOpt} setOpen={ setOpen } getAllOpts={ getAllOpts } />
      </Collapse>

    </Paper>
  );
}

