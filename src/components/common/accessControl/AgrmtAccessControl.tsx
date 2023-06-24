
import { 
  Paper, Stack,
} from "@mui/material";

import { HexType } from "../../../interfaces";
import { SetOwner } from "./SetOwner";
import { SetGeneralCounsel } from "./SetGeneralCounsel";
import { AppointAttorney } from "./AppointAttorney";
import { RemoveAttorney } from "./RemoveAttorney";
import { QuitAttorney } from "./QuitAttorney";

interface AgrmtAccessControlProps{
  agrmt: HexType;
}

export function AgrmtAccessControl({ agrmt }:AgrmtAccessControlProps) {

  return (
    <Stack direction={'row'}  sx={{ justifyContent:'center' }}>

      <Stack direction={'column'}  >
        <Paper elevation={3} sx={{m:1, p:1, border:1, borderColor:'divider'}}>
          <SetOwner addr={ agrmt } />
          <SetGeneralCounsel addr={ agrmt } />              
        </Paper>
      </Stack>

      <Stack direction={'column'} >
        <Paper elevation={3} sx={{m:1, p:1, border:1, borderColor:'divider'}} >
          <AppointAttorney addr={ agrmt } />
          <RemoveAttorney addr={ agrmt } />
          <QuitAttorney addr={ agrmt } />
        </Paper>
      </Stack>

    </Stack>
  );
} 
