
import { 
  Card,
  CardContent,
  Paper, Stack, Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { Member, getCurrency, getProjectInfo, getTeamInfoList } from "../../../../scripts/center/pop";
import { ActionsOfManager } from "./ActionsOfManager";
import { centToDollar, longDataParser, longSnParser, weiToEth } from "../../../../scripts/common/toolsKit";
import { currencies } from "../../../comp/gk/GeneralInfo";
import { PayrollProps } from "../Owner/OwnerPage";
import { GetTeamsList } from "./GetTeamsList";

export function ManagerPage({ addr }:PayrollProps) {

  const [ time, setTime ] = useState(0);

  const refresh = () => {
    setTime(Date.now());
  }

  const [ currency, setCurrency ] = useState<number>(0);
  const [ proInfo, setProInfo ] = useState<Member>();

  useEffect(() => { 
    getCurrency(addr).then(
      res => {
        console.log('currency: ', res);
        setCurrency(res);
      }
    );
  }, [ addr, time ]);

  useEffect(() => { 
    getProjectInfo(addr).then(
      info => {
        info.pendingAmt = info.receivableAmt - info.paidAmt;
        setProInfo(info);
      }
    );
  }, [ addr, time ]);

  const [ list, setList ] = useState<Member[]>();

  useEffect(() => {
    getTeamInfoList(addr).then(
      res => {
        if (res.length > 0) {
          setList(res);
        }
      }
    );
  }, [addr, time]);

  const [ seqOfTeam, setSeqOfTeam ] = useState<number>(0);

  return (
    <Paper elevation={3} sx={{m:1, p:1, border:1, borderColor:'divider'}} >
      <Stack direction='column' sx={{m:1, alignItems:'start', justifyItems:'start'}} >    

        <Typography variant="h5" sx={{m:1, textDecoration:'underline' }} >
          <b>Project Info</b>
        </Typography>

        <Card variant='outlined' sx={{m:1, mr:3, width:'100%' }}>
          <CardContent>
            <Typography variant="body1" sx={{ m:1 }} >
              Project Manager: { longSnParser(proInfo?.userNo.toString() ?? '0') }
            </Typography>
            <Typography variant="body1" sx={{ m:1 }} >
              Booking Currency: { currencies[currency] }
            </Typography>

            <hr />

            <Typography variant="body1" sx={{ m:1 }} >
              Rate: { centToDollar(proInfo?.rate.toString() ?? '0') }
            </Typography>
            <Typography variant="body1" sx={{ m:1 }} >
              Estimated: { longDataParser(proInfo?.estimated.toString() ?? '0') }
            </Typography>
            <Typography variant="body1" sx={{ m:1 }} >
              Applied: { longDataParser(proInfo?.applied.toString() ?? '0') }
            </Typography>

            <hr />

            <Typography variant="body1" sx={{ m:1 }} >
              Budget: { centToDollar(proInfo?.budgetAmt.toString() ?? '0') }
            </Typography>
            <Typography variant="body1" sx={{ m:1 }} >
              Verified: { centToDollar(proInfo?.receivableAmt.toString() ?? '0') }
            </Typography>
            <Typography variant="body1" sx={{ m:1 }} >
              Paid: { centToDollar(proInfo?.paidAmt.toString() ?? '0') }
            </Typography>
            <Typography variant="body1" sx={{ m:1 }} >
              Payable: { centToDollar(proInfo?.pendingAmt.toString() ?? '0') }
            </Typography>
            <Typography variant="body1" sx={{ m:1 }} >
              Payable in ETH: { weiToEth(proInfo?.pendingAmt.toString() ?? '0') }
            </Typography>
          </CardContent>
        </Card>

      </Stack>

      {list && (
        <GetTeamsList setSeq={setSeqOfTeam} list={list} />
      )}

      <ActionsOfManager addr={ addr } seqOfTeam={ seqOfTeam } refresh={ refresh } />
    </Paper>
  );
} 