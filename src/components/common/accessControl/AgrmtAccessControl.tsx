
import { 
  Paper, Stack,
} from "@mui/material";

import { HexType } from "../../../scripts/common";
import { SetOwner } from "./SetOwner";
import { SetGeneralCounsel } from "./SetGeneralCounsel";
import { AppointAttorney } from "./AppointAttorney";
import { RemoveAttorney } from "./RemoveAttorney";
import { QuitAttorney } from "./QuitAttorney";
import { FinalizeSha } from "../../comp/roc/sha/FinalizeSha";

interface AgrmtAccessControlProps{
  isSha: boolean;
  agrmt: HexType;
}

export function AgrmtAccessControl({ isSha, agrmt }:AgrmtAccessControlProps) {

  return (
    <Stack direction={'column'}  >
      <Paper elevation={3} sx={{m:1, p:1, border:1, borderColor:'divider'}}>
        <SetOwner addr={ agrmt } />
        <SetGeneralCounsel addr={ agrmt } />
        <FinalizeSha isSha={isSha} addr={ agrmt } setIsFinalized={()=>{}} setNextStep={()=>{}} />           
      </Paper>

      <Paper elevation={3} sx={{m:1, p:1, border:1, borderColor:'divider'}} >
        <AppointAttorney addr={ agrmt } />
        <RemoveAttorney addr={ agrmt } />
        <QuitAttorney addr={ agrmt } />
      </Paper>
    </Stack>
  );
} 
