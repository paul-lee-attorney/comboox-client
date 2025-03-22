
import { Paper } from "@mui/material";

import { CashBox } from "./GeneralInfo/CashBox";
import { DirectorsList } from "./GeneralInfo/DirectorsList";

import { HeadChart } from "./GeneralInfo/HeadChart";
import { MembersList } from "../rom/components/MembersList";

export function GeneralInfo() {

  return (
    <Paper elevation={3} 
      sx={{
        alignContent:'center', 
        justifyContent:'center', 
        m:1, p:1, border:1, 
        borderColor:'divider' 
      }} 
    >
      <HeadChart />

      <MembersList />

      <DirectorsList />

      <CashBox />

      {/* {compInfo?.regNum == 8 && (
        <FinStatement />
      )} */}

    </Paper>
  );
} 