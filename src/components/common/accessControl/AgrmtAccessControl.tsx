
import { 
  Paper, Stack,
} from "@mui/material";

import { HexType } from "../../../scripts/common";
import { SetOwner } from "./SetOwner";
import { SetGeneralCounsel } from "./SetGeneralCounsel";
import { AppointAttorney } from "./AppointAttorney";
import { RemoveAttorney } from "./RemoveAttorney";
import { QuitAttorney } from "./QuitAttorney";
import { FinalizeSha } from "../../comp/roc/sha/Actions/FinalizeSha";
import { FinalizeIa } from "../../comp/roa/ia/FinalizeIa";

interface AgrmtAccessControlProps{
  isSha: boolean;
  agrmt: HexType;
}

export function AgrmtAccessControl({ isSha, agrmt }:AgrmtAccessControlProps) {

  return (
    <Stack direction={'column'}  sx={{ width: 980}} >
      <Paper elevation={3} sx={{m:1, p:1, border:1, borderColor:'divider'}}>
        <SetOwner addr={ agrmt } />
        <SetGeneralCounsel addr={ agrmt } />
        {isSha 
          ? <FinalizeSha addr={ agrmt } setIsFinalized={()=>{}} setNextStep={()=>{}} />           
          : <FinalizeIa addr={ agrmt } setIsFinalized={()=>{}} setNextStep={()=>{}} />  
        }
      </Paper>

      <Paper elevation={3} sx={{m:1, p:1, border:1, borderColor:'divider'}} >
        <AppointAttorney addr={ agrmt } />
        <RemoveAttorney addr={ agrmt } />
        <QuitAttorney addr={ agrmt } />
      </Paper>
    </Stack>
  );
} 
