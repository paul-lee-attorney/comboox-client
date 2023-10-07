import { Collapse, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Toolbar } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { RefundDebt } from "./Actions/RefundDebt";
import { ExtendPledge } from "./Actions/ExtendPledge";
import { LockPledge } from "./Actions/LockPledge";
import { ReleasePledge } from "./Actions/ReleasePledge";
import { ExecPledge } from "./Actions/ExecPledge";
import { RevokePledge } from "./Actions/RevokePledge";
import { TransferPledge } from "./Actions/TransferPledge";
import { Pledge } from "../../../scripts/comp/rop";

export interface ActionsOfPledgeProps{
  pld: Pledge;
  setOpen: Dispatch<SetStateAction<boolean>>;
  getAllPledges: ()=>void;
}

export function ActionsOfPledge({pld, setOpen, getAllPledges}: ActionsOfPledgeProps) {

  const [ typeOfAction, setTypeOfAction ] = useState<string>('0');
  
  const actionsOfPledge = [
    'Refund Debt', 'Extend Pledge', 'Lock Pledge', 'Release Pledge', 
    'Exercise Pledge', 'Revoke Pledge', 'Transfer Pledge'
  ]

  const compsOfAction = [
    <RefundDebt key={0} pld={pld} setOpen={setOpen} getAllPledges={getAllPledges} />, 
    <ExtendPledge key={1} pld={pld} setOpen={setOpen} getAllPledges={getAllPledges} />,
    <LockPledge key={2} pld={pld} setOpen={setOpen} getAllPledges={getAllPledges} />,
    <ReleasePledge key={3} pld={pld} setOpen={setOpen} getAllPledges={getAllPledges} />,
    <ExecPledge key={4} pld={pld} setOpen={setOpen} getAllPledges={getAllPledges} />, 
    <RevokePledge key={5} pld={pld} setOpen={setOpen} getAllPledges={getAllPledges} />,
    <TransferPledge key={6} pld={pld} setOpen={setOpen} getAllPledges={getAllPledges} />,
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
            {actionsOfPledge.map((v, i) => (
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

