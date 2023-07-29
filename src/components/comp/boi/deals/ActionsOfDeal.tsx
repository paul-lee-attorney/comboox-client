import { Collapse, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Toolbar } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";

import { Deal } from "../../../../queries/ia";
import { HexType } from "../../../../interfaces";
import { PushToCoffer } from "./Actions/PushToCoffer";
import { PickupShare } from "./Actions/PickupShare";
import { IssueShare } from "./Actions/IssueShare";
import { TransferShare } from "./Actions/TransferShare";
import { TerminateDeal } from "./Actions/TerminateDeal";
import { ExecDragAlong } from "./Actions/ExecDragAlong";
import { ExecTagAlong } from "./Actions/ExecTagAlong";
import { ExecAntiDilution } from "./Actions/ExecAntiDilution";
import { ExecFirstRefusal } from "./Actions/ExecFirstRefusal";
import { TakeGiftShares } from "./Actions/TakeGiftShares";
import { AcceptFirstRefusal } from "./Actions/AcceptFirstRefusal";

export interface ActionsOfDealProps{
  ia: HexType;
  deal: Deal;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setDeal: Dispatch<SetStateAction<Deal>>;
  refreshDealsList: ()=>void;
}

export function ActionsOfDeal({ia, deal, setOpen, setDeal, refreshDealsList}: ActionsOfDealProps) {

  const [ typeOfAction, setTypeOfAction ] = useState<string>('0');

  const actionsOfDeal = [
    'PushToCoffer', 'PickupShare', 'IssueShare', 'TransferShare', 'TerminateDeal',
    'DragAlong', 'TagAlong', 'AntiDilution', 'FirstRefusal', 'TakeGift', 'AcceptFirstRefusal'
  ]

  const compsOfAction = [
    <PushToCoffer key={0} ia={ia} deal={deal} setOpen={setOpen} setDeal={setDeal} refreshDealsList={refreshDealsList} />,
    <PickupShare key={1} ia={ia} deal={deal} setOpen={setOpen} setDeal={setDeal} refreshDealsList={refreshDealsList} />,
    <IssueShare key={2} ia={ia} deal={deal} setOpen={setOpen} setDeal={setDeal} refreshDealsList={refreshDealsList} />,
    <TransferShare key={3} ia={ia} deal={deal} setOpen={setOpen} setDeal={setDeal} refreshDealsList={refreshDealsList} />,
    <TerminateDeal key={4} ia={ia} deal={deal} setOpen={setOpen} setDeal={setDeal} refreshDealsList={refreshDealsList} />,
    <ExecDragAlong key={5} ia={ia} deal={deal} setOpen={setOpen} setDeal={setDeal} refreshDealsList={refreshDealsList} />,
    <ExecTagAlong key={6} ia={ia} deal={deal} setOpen={setOpen} setDeal={setDeal} refreshDealsList={refreshDealsList} />,
    <ExecAntiDilution key={6} ia={ia} deal={deal} setOpen={setOpen} setDeal={setDeal} refreshDealsList={refreshDealsList} />,
    <ExecFirstRefusal key={6} ia={ia} deal={deal} setOpen={setOpen} setDeal={setDeal} refreshDealsList={refreshDealsList} />,
    <TakeGiftShares key={6} ia={ia} deal={deal} setOpen={setOpen} setDeal={setDeal} refreshDealsList={refreshDealsList} />,
    <AcceptFirstRefusal key={6} ia={ia} deal={deal} setOpen={setOpen} setDeal={setDeal} refreshDealsList={refreshDealsList} />
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
            {actionsOfDeal.map((v, i) => (
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

