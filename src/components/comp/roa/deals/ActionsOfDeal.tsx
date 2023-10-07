import { Collapse, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Toolbar } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";

import { Deal } from "../../../../scripts/comp/ia";
import { HexType } from "../../../../scripts/common";
import { PushToCoffer } from "./ActionsOfDeal/PushToCoffer";
import { PickupShare } from "./ActionsOfDeal/PickupShare";
import { IssueShare } from "./ActionsOfDeal/IssueShare";
import { TransferShare } from "./ActionsOfDeal/TransferShare";
import { TerminateDeal } from "./ActionsOfDeal/TerminateDeal";
import { ExecDragAlong } from "./ActionsOfDeal/ExecDragAlong";
import { ExecTagAlong } from "./ActionsOfDeal/ExecTagAlong";
import { ExecAntiDilution } from "./ActionsOfDeal/ExecAntiDilution";
import { ExecFirstRefusal } from "./ActionsOfDeal/ExecFirstRefusal";
import { TakeGiftShares } from "./ActionsOfDeal/TakeGiftShares";
import { PayOffApprovedDeal } from "./ActionsOfDeal/PayOffApprovedDeal";
import { RequestToBuy } from "./ActionsOfDeal/RequestToBuy";
import { Timeline } from "./OrderOfDeal";

export interface ActionsOfDealProps{
  ia: HexType;
  deal: Deal;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setDeal: Dispatch<SetStateAction<Deal>>;
  refreshDealsList: ()=>void;
}

export interface ActionsOfDealCenterProps extends ActionsOfDealProps{
  timeline: Timeline;
  timestamp: number;
}

export function ActionsOfDeal({ia, deal, setOpen, setDeal, refreshDealsList, timeline, timestamp}: ActionsOfDealCenterProps) {

  const [ typeOfAction, setTypeOfAction ] = useState<string>('0');

  const actionsOfDeal = [
    'FirstRefusal', 'AntiDilution', 'DragAlong', 'TagAlong', 'PushToCoffer',
    'IssueShare', 'TransferShare', 'PayOffApprovedDeal', 'RequestToBuy', 'PickupShare', 
    'TerminateDeal', 'TakeGift',
  ]

  const compsOfAction = [
    <ExecFirstRefusal key={0} ia={ia} deal={deal} setOpen={setOpen} setDeal={setDeal} refreshDealsList={refreshDealsList} />,
    <ExecAntiDilution key={1} ia={ia} deal={deal} setOpen={setOpen} setDeal={setDeal} refreshDealsList={refreshDealsList} />,
    <ExecDragAlong key={2} ia={ia} deal={deal} setOpen={setOpen} setDeal={setDeal} refreshDealsList={refreshDealsList} />,
    <ExecTagAlong key={3} ia={ia} deal={deal} setOpen={setOpen} setDeal={setDeal} refreshDealsList={refreshDealsList} />,
    <PushToCoffer key={4} ia={ia} deal={deal} setOpen={setOpen} setDeal={setDeal} refreshDealsList={refreshDealsList} />,
    <IssueShare key={5} ia={ia} deal={deal} setOpen={setOpen} setDeal={setDeal} refreshDealsList={refreshDealsList} />,
    <TransferShare key={6} ia={ia} deal={deal} setOpen={setOpen} setDeal={setDeal} refreshDealsList={refreshDealsList} />,
    <PayOffApprovedDeal key={7} ia={ia} deal={deal} setOpen={setOpen} setDeal={setDeal} refreshDealsList={refreshDealsList} />,
    <RequestToBuy key={8} ia={ia} deal={deal} setOpen={setOpen} setDeal={setDeal} refreshDealsList={refreshDealsList} />,
    <PickupShare key={9} ia={ia} deal={deal} setOpen={setOpen} setDeal={setDeal} refreshDealsList={refreshDealsList} />,
    <TerminateDeal key={10} ia={ia} deal={deal} setOpen={setOpen} setDeal={setDeal} refreshDealsList={refreshDealsList} />,
    <TakeGiftShares key={11} ia={ia} deal={deal} setOpen={setOpen} setDeal={setDeal} refreshDealsList={refreshDealsList} />,
  ]

  let activeSteps:number[] = [];
      
  if ( timestamp < timeline.frDeadline ) {

      if (deal.head.typeOfDeal == 1) activeSteps = [ 0, 1 ];
      else activeSteps = [ 0 ];

  } else if ( timestamp < timeline.dtDeadline ) {

      if (deal.head.typeOfDeal == 1) activeSteps = [ 1 ];
      else activeSteps = [ 2, 3 ];

  } else if ( timestamp < timeline.terminateStart ) {

      if (deal.head.typeOfDeal == 1) activeSteps = [ 1 ];
      else activeSteps = [];

  } else if ( timestamp < timeline.votingDeadline && timeline.stateOfFile < 3 ) {
      activeSteps = [ 10 ];

  } else if ( timestamp < timeline.closingDeadline ) {

      if (timeline.stateOfFile == 4) {
        
        if (deal.body.state == 1) {

          if (deal.head.typeOfDeal == 1) activeSteps = [ 4, 5, 7 ];
          else if (deal.head.typeOfDeal == 8) activeSteps = [ 11 ];
          else activeSteps = [ 4, 6, 7 ];

        } else if (deal.body.state == 2) {

          if (deal.head.typeOfDeal == 1) activeSteps = [ 5, 7, 9 ];
          else activeSteps = [ 6, 7, 9 ];

        } else activeSteps = [];

      } else if (timeline.stateOfFile == 5) {
        activeSteps = [ 10 ];
        if (deal.head.typeOfDeal == 2 || deal.head.typeOfDeal == 3) 
          activeSteps.push(8);
      } 

  } else if ( timestamp >= timeline.closingDeadline && timeline.stateOfFile > 1 ) {
    activeSteps = [10];
    if (deal.head.typeOfDeal == 8) activeSteps.push(11);
  } 
  
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
            {activeSteps && activeSteps.map((v, i) => (
              <MenuItem key={i} value={ v } > <b>{ actionsOfDeal[ v ] }</b> </MenuItem>
            ))}

          </Select>
        </FormControl>

      </Stack>

      {activeSteps && activeSteps.map((v, i) => (
        <Collapse key={i} in={ typeOfAction == v.toString() } >
          { compsOfAction[ v ] }
        </Collapse>        
      ))}

    </Paper>
  );
}

