import { useEffect, useState } from "react";

import { 
  Box, Collapse, 
  FormControl, 
  FormControlLabel, 
  InputLabel, 
  MenuItem, 
  Paper, Radio, RadioGroup, 
  Select, 
  Stack, Typography, 
} from "@mui/material";

import { CreateMotionForBoardSeats } from "./create_motions/CreateMotionForBoardSeats";
import { CreateMotionForDoc } from "./create_motions/CreateMotionForDoc";
import { CreateMotionForAction } from "./create_motions/CreateMotionForAction";
import { ProposeToTransferFund } from "./create_motions/ProposeToTransferFund";
import { ProposeToDistributeProfits } from "./create_motions/ProposeToDistributeProfits";

import { CreateMotionProps } from "../../bmm/components/CreateMotionOfBoardMeeting";
import { ProposeToDeprecateGK } from "./create_motions/ProposeToDeprecateGK";
import { ProposeToMintCBP } from "./create_motions/ProposeToMintCBP";
import { isOwnerOfRegCenter } from "../../../rc";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { ProposeToPickupFuelIncome } from "./create_motions/ProposeToPickupFuelIncome";

export function CreateMotionOfGm({ refresh }: CreateMotionProps) {

  const { gk } = useComBooxContext();

  const [ isComBoox, setIsComBoox ] = useState(false);

  useEffect(()=>{
    const checkOwnerOfRC = async () => {
      if (!gk) return;
      let res = await isOwnerOfRegCenter(gk); 
      setIsComBoox(res);      
    }
    checkOwnerOfRC();
  }, [gk]);

  const nameOfTypes = [
    'Nominate/Remove Officer', 'Approve Document', 'Transfer Fund', 
    'Distribute Profits', 'Approve Action', 'Deprecate GK', 'Mint CBP',
    'Pickup Fuel Income'
  ];

  const compOfTypes = [
    <CreateMotionForBoardSeats key={0} refresh={refresh} />,
    <CreateMotionForDoc key={1} refresh={refresh} />,
    <ProposeToTransferFund key={2} refresh={refresh} />,
    <ProposeToDistributeProfits key={3} refresh={refresh} />,
    <CreateMotionForAction key={4} refresh={refresh} />,
    <ProposeToDeprecateGK key={5} refresh={refresh} />,
    <ProposeToMintCBP key={6} refresh={refresh} />,
    <ProposeToPickupFuelIncome key={7} refresh={refresh} />,
  ]
  
  const [ typeOfMotion, setTypeOfMotion ] = useState('0');

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >
      <Stack direction={'row'} sx={{ alignItems:'center', color:'black' }} >

        <Box sx={{ minWidth:200 }} >
          <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
            <b>Create Motion - Type Of Motion: </b>
          </Typography>
        </Box>

        <FormControl variant="outlined" size="small" sx={{ m:1, mr:5, minWidth: 288 }}>
          <InputLabel id="typeOfMotion-label">TypeOfMotion</InputLabel>
          <Select
            labelId="typeOfMotion-label"
            id="typeOfMotion-select"
            label="TypeOfMotion"
            value={ typeOfMotion }
            onChange={(e) => setTypeOfMotion(e.target.value)}
          >
            {nameOfTypes.map((v, i) => {
              if (!isComBoox && i > 5) return null;
              return (<MenuItem key={v} value={ i } > <b>{v}</b> </MenuItem>);
            })}
          </Select>
        </FormControl>

      </Stack>

      {compOfTypes.map((v, i) => (
        <Collapse key={i} in={ typeOfMotion == i.toString() } >
          {v}
        </Collapse>
      ))}

    </Paper>
  );
}



