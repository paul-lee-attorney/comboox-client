import { Collapse, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Toolbar } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { RefundDebt } from "./RefundDebt";
import { ExtendPledge } from "./ExtendPledge";
import { LockPledge } from "./LockPledge";
import { ReleasePledge } from "./ReleasePledge";
import { ExecPledge } from "./ExecPledge";
import { RevokePledge } from "./RevokePledge";
import { TransferPledge } from "./TransferPledge";
import { Pledge } from "../../../queries/bop";


export interface ActionsOfPledgeProps{
  pld: Pledge;
  setOpen: Dispatch<SetStateAction<boolean>>;
  getAllPledges: ()=>void;
}

export function ActionsOfPledge({pld, setOpen, getAllPledges}: ActionsOfPledgeProps) {

  const [ typeOfAction, setTypeOfAction ] = useState<string>('0');
  
  return(
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >
      <Stack direction={'row'} sx={{ alignItems:'center', color:'black' }} >

        <Toolbar>
          <h4>Type Of Action:</h4>
        </Toolbar>

        <FormControl variant="outlined" sx={{ m: 1, minWidth: 168 }}>
          <InputLabel id="typeOfAction-label">TypeOfAction</InputLabel>
          <Select
            labelId="typeOfAction-label"
            id="typeOfAction-select"
            label="TypeOfAction"
            value={ typeOfAction }
            onChange={(e) => setTypeOfAction(e.target.value)}
          >
            <MenuItem value={ '0' } > Refund Debt </MenuItem>
            <MenuItem value={ '1' } > Extend Pledge </MenuItem>
            <MenuItem value={ '2' } > Lock Pledge </MenuItem>
            <MenuItem value={ '3' } > Release Pledge </MenuItem>
            <MenuItem value={ '4' } > Exercise Pledge </MenuItem>
            <MenuItem value={ '5' } > Revoke Pledge </MenuItem>
            <MenuItem value={ '6' } > Transfer Pledge </MenuItem>
          </Select>
        </FormControl>

      </Stack>

      <Collapse in={ typeOfAction == '0' } >
        <RefundDebt pld={pld} setOpen={setOpen} getAllPledges={getAllPledges} />
      </Collapse>

      <Collapse in={ typeOfAction == '1' } >
        <ExtendPledge pld={pld} setOpen={setOpen} getAllPledges={getAllPledges} />
      </Collapse>

      <Collapse in={ typeOfAction == '2' } >
        <LockPledge pld={pld} setOpen={setOpen} getAllPledges={getAllPledges} />
      </Collapse>

      <Collapse in={ typeOfAction == '3' } >
        <ReleasePledge pld={pld} setOpen={setOpen} getAllPledges={getAllPledges} />
      </Collapse>

      <Collapse in={ typeOfAction == '4' } >
        <ExecPledge pld={pld} setOpen={setOpen} getAllPledges={getAllPledges} />
      </Collapse>

      <Collapse in={ typeOfAction == '5' } >
        <RevokePledge pld={pld} setOpen={setOpen} getAllPledges={getAllPledges} />
      </Collapse>

      <Collapse in={ typeOfAction == '6' } >
        <TransferPledge pld={pld} setOpen={setOpen} getAllPledges={getAllPledges} />
      </Collapse>

    </Paper>
  );
}

