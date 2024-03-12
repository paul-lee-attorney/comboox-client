
import { 
  Card,
  CardContent,
  Paper, Stack, Typography,
} from "@mui/material";

import { AddrZero, HexType } from "../../../../scripts/common";
import { useEffect, useState } from "react";
import { Member, getCurrency, getOwner, getProjectInfo } from "../../../../scripts/center/pop";
import { ActionsOfOwner } from "./ActionsOfOwner";
import { longDataParser, longSnParser } from "../../../../scripts/common/toolsKit";
import { currencies } from "../../../comp/gk/GeneralInfo";
import { CopyLongStrSpan } from "../../../common/utils/CopyLongStr";

export interface PayrollProps{
  addr: HexType;
}

export function OwnerPage({ addr }:PayrollProps) {

  const [ time, setTime ] = useState(0);

  const refresh = () => {
    setTime(Date.now());
  }

  const [ currency, setCurrency ] = useState<number>(0);
  const [ owner, setOwner ] = useState<HexType>(AddrZero);
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
    getOwner(addr).then(
      res => {
        console.log('owner: ', res);
        setOwner(res);
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

  return (
    <Paper elevation={3} sx={{m:1, p:1, border:1, borderColor:'divider'}} >
      <Stack direction='column' sx={{m:1, alignItems:'start', justifyItems:'start'}} >    

        <Typography variant="h5" sx={{m:1, textDecoration:'underline' }} >
          <b>Project Info</b>
        </Typography>

        <Card variant='outlined' sx={{m:1, mr:3, width:'100%' }}>
          <CardContent>

            <Stack direction='row'>
              <Typography variant="body1" sx={{ m:1 }} >
                Owner: 
              </Typography>
              <CopyLongStrSpan title='Addr' src={owner} />
            </Stack>
            <hr />

            <Typography variant="body1" sx={{ m:1 }} >
              Project Manager: { longSnParser(proInfo?.userNo.toString() ?? '0') }
            </Typography>
            <Typography variant="body1" sx={{ m:1 }} >
              Booking Currency: { currencies[currency] }
            </Typography>

            <hr />

            <Typography variant="body1" sx={{ m:1 }} >
              Budget: { longDataParser(proInfo?.budgetAmt.toString() ?? '0') }
            </Typography>
            <Typography variant="body1" sx={{ m:1 }} >
              Verified: { longDataParser(proInfo?.receivableAmt.toString() ?? '0') }
            </Typography>
            <Typography variant="body1" sx={{ m:1 }} >
              Paid: { longDataParser(proInfo?.paidAmt.toString() ?? '0') }
            </Typography>
            <Typography variant="body1" sx={{ m:1 }} >
              Payable: { longDataParser(proInfo?.pendingAmt.toString() ?? '0') }
            </Typography>
            <Typography variant="body1" sx={{ m:1 }} >
              Payable in Wei: { longDataParser(proInfo?.pendingAmt.toString() ?? '0') }
            </Typography>
          </CardContent>
        </Card>

      </Stack>

      <ActionsOfOwner addr={ addr } refresh={ refresh } />
    </Paper>
  );
} 
