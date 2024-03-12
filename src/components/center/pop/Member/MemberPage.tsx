
import { 
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Paper, Select, Stack, Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { BalanceOf, Member, balanceOfWei, getBalanceOf, getMemberInfo, qtyOfTeams } from "../../../../scripts/center/pop";
import { bigIntToStrNum, centToDollar, longDataParser, longSnParser } from "../../../../scripts/common/toolsKit";
import { PayrollProps } from "../Owner/OwnerPage";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { ActionsOfMember } from "./ActionsOfMember";

export function MemberPage({ addr }:PayrollProps) {

  const [ time, setTime ] = useState(0);

  const refresh = () => {
    setTime(Date.now());
  }

  const [ seqOfTeam, setSeqOfTeam ] = useState<number>();
  const [ teamNoList, setTeamNoList ] = useState<number[]>();

  useEffect(() => { 
    qtyOfTeams(addr).then(
      res => {
        if (res > 0) {
          let ls:number[] = [];
          for (let i = 1; i <= res; i++){
            ls.push(i);
          }
          setTeamNoList(ls);
        } 
      }
    );
  }, [ addr, time ]);

  const { userNo } = useComBooxContext();

  const [ member, setMember ] = useState<Member>();

  useEffect(() => {
    if (seqOfTeam && userNo) {
      getMemberInfo(addr, userNo, seqOfTeam).then(
        info => {
          setMember(info);
        }
      );
    }
  }, [ addr, seqOfTeam, userNo ]);

  const [ balanceOf, setBalanceOf ] = useState<BalanceOf>();

  useEffect(() => {

    if (userNo) {      
      getBalanceOf(addr, userNo).then(
        res => {
          setBalanceOf(v => {
            let output!:BalanceOf;
            if (v) output = {...v};
            output.me = res;

            return output;
          })
        }
      );
    }
    
    balanceOfWei(addr).then(
      res => {
        setBalanceOf(v => {
          let output!:BalanceOf;
          if (v) output = {...v};
          output.cash = res;

          return output;
        });
      }
    );

    getBalanceOf(addr, 0).then(
      res => {
        setBalanceOf(v => {
          let output!:BalanceOf;
          if (v) output = {...v};
          output.project = res;

          return output;
        });
      }
    );

  }, [ addr, userNo ]);
  
  return (
    <Paper elevation={3} sx={{m:1, p:1, border:1, borderColor:'divider'}} >
      <Stack direction='column' sx={{m:1, alignItems:'start', justifyItems:'start'}} >    

        <Stack direction='row' >
          <Typography variant="h5" sx={{m:1, textDecoration:'underline' }} >
            <b>Member Info</b>
          </Typography>

          {teamNoList && (
            <FormControl variant="outlined" size="small" sx={{ m:1, ml: 50, minWidth: 168 }}>
              <InputLabel id="seqOfTeam-label">SeqOfTeam</InputLabel>
              <Select
                labelId="seqOfTeam-label"
                id="seqOfTeam-select"
                label="SeqOfTeam"
                value={ seqOfTeam?.toString() ?? '' }
                onChange={(e) => setSeqOfTeam(Number(e.target.value))}
              >
                {teamNoList.map((v, i) => (
                  <MenuItem key={i} value={v.toString()}>{v}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

        </Stack>

        <Card variant='outlined' sx={{m:1, mr:3, width:'100%' }}>
          <CardContent>
            <Typography variant="body1" sx={{ m:1 }} >
              SeqOfTeam: { longSnParser(member?.seqOfTeam.toString() ?? '0') }
            </Typography>
            <Typography variant="body1" sx={{ m:1 }} >
              UserNo: { longSnParser(member?.userNo.toString() ?? '0') }
            </Typography>

            <hr />

            <Typography variant="body1" sx={{ m:1 }} >
              Rate: { centToDollar(member?.rate.toString() ?? '0') }
            </Typography>
            <Typography variant="body1" sx={{ m:1 }} >
              Estimated: { longDataParser(member?.estimated.toString() ?? '0') }
            </Typography>
            <Typography variant="body1" sx={{ m:1 }} >
              Applied: { longDataParser(member?.applied.toString() ?? '0') }
            </Typography>

            <hr />

            <Typography variant="body1" sx={{ m:1 }} >
              Budget: { centToDollar(member?.budgetAmt.toString() ?? '0') }
            </Typography>
            <Typography variant="body1" sx={{ m:1 }} >
              Applied: { centToDollar(member?.pendingAmt.toString() ?? '0') }
            </Typography>
            <Typography variant="body1" sx={{ m:1 }} >
              Verified: { centToDollar(member?.receivableAmt.toString() ?? '0') }
            </Typography>
            <Typography variant="body1" sx={{ m:1 }} >
              Paid: { centToDollar(member?.paidAmt.toString() ?? '0') }
            </Typography>

            <hr />

            <Typography variant="body1" sx={{ m:1 }} >
              BalanceOfProject: { bigIntToStrNum((balanceOf?.project ?? BigInt(0)), 18) }
            </Typography>
            <Typography variant="body1" sx={{ m:1 }} >
              CashInBox: { centToDollar(balanceOf?.cash.toString() ?? '0') }
            </Typography>
            <Typography variant="body1" sx={{ m:1 }} >
              BalanceOf: { centToDollar(balanceOf?.me.toString() ?? '0') }
            </Typography>
          

          </CardContent>
        </Card>

      </Stack>

      <ActionsOfMember addr={ addr } seqOfTeam={ seqOfTeam } memberNo={ userNo } refresh={ refresh } />

    </Paper>
  );
} 
