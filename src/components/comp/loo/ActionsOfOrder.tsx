import { Collapse, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Toolbar } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";

import { PlaceInitialOffer } from "./ActionsOfOrder/PlaceInitialOffer";
import { PlaceSellOrder } from "./ActionsOfOrder/PlaceSellOrder";
import { PlaceBuyOrder } from "./ActionsOfOrder/PlaceBuyOrder";
import { WithdrawInitialOffer } from "./ActionsOfOrder/WithdrawInitialOffer";
import { WithdrawSellOrder } from "./ActionsOfOrder/WithdrawSellOrder";


export interface ActionsOfOrderProps{
  classOfShare: number;
  seqOfOrder: number;
  refresh: ()=>void;
}

export function ActionsOfOrder({classOfShare, seqOfOrder, refresh}: ActionsOfOrderProps) {

  const [ typeOfAction, setTypeOfAction ] = useState<string>('0');
  
  const actionsOfListing = [
    'Buy Order', 'Sell Order', 'Initial Offer', 'Withdraw Initial Offer', 'Withdraw Sell Order'
  ]

  const compsOfAction = [
    <PlaceBuyOrder key={0} classOfShare={classOfShare} seqOfOrder={seqOfOrder} refresh={refresh} />,
    <PlaceSellOrder key={1} classOfShare={classOfShare} seqOfOrder={seqOfOrder} refresh={refresh} />,
    <PlaceInitialOffer key={2} classOfShare={classOfShare} seqOfOrder={seqOfOrder} refresh={refresh} />,
    <WithdrawInitialOffer key={3} classOfShare={classOfShare} seqOfOrder={seqOfOrder} refresh={refresh} />,
    <WithdrawSellOrder key={4} classOfShare={classOfShare} seqOfOrder={seqOfOrder} refresh={refresh} />,
  ]

  return(
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >
      <Stack direction={'row'} sx={{ alignItems:'center', color:'black' }} >

        <Toolbar>
          <h4>Sell / Buy Order:</h4>
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

