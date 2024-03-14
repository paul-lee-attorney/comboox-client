
import { 
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Paper, Select, Stack, Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { Member, getMembersOfTeam, getTeamInfo, qtyOfTeams } from "../../../../scripts/center/pop";
import { ActionsOfLeader } from "./ActionsOfLeader";
import { centToDollar, longDataParser, longSnParser } from "../../../../scripts/common/toolsKit";
import { PayrollProps } from "../Owner/OwnerPage";
import { GetMembersList } from "./GetMembersList";

export function LeaderPage({ addr }:PayrollProps) {

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

  const [ teamInfo, setTeamInfo ] = useState<Member>();

  useEffect(() => {
    if (seqOfTeam != undefined) {
      getTeamInfo(addr, seqOfTeam).then(
        info => {
          setTeamInfo(info);
        }
      );
    }
  }, [ addr, seqOfTeam, time ]);

  const [ list, setList ] = useState<readonly Member[]>();

  useEffect(() => {
    if (seqOfTeam != undefined) {
      getMembersOfTeam(addr, seqOfTeam).then(
        res => setList(res)
      );
    }
  }, [addr, seqOfTeam, time]);

  const [ memberNo, setMemberNo ] = useState<number>();

  return (
    <Paper elevation={3} sx={{m:1, p:1, border:1, borderColor:'divider'}} >
      <Stack direction='column' sx={{m:1, alignItems:'start', justifyItems:'start'}} >    

        <Stack direction='row' >
          <Typography variant="h5" sx={{m:1, textDecoration:'underline' }} >
            <b>Team Info</b> - { seqOfTeam }
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
              Team Leader: { longSnParser(teamInfo?.userNo.toString() ?? '0') }
            </Typography>

            <hr />

            <Typography variant="body1" sx={{ m:1 }} >
              Rate: { centToDollar(teamInfo?.rate.toString() ?? '0') }
            </Typography>
            <Typography variant="body1" sx={{ m:1 }} >
              Estimated: { longDataParser(teamInfo?.estimated.toString() ?? '0') }
            </Typography>
            <Typography variant="body1" sx={{ m:1 }} >
              Applied: { longDataParser(teamInfo?.applied.toString() ?? '0') }
            </Typography>

            <hr />

            <Typography variant="body1" sx={{ m:1 }} >
              Budget: { centToDollar(teamInfo?.budgetAmt.toString() ?? '0') }
            </Typography>
            <Typography variant="body1" sx={{ m:1 }} >
              Applied: { centToDollar(teamInfo?.pendingAmt.toString() ?? '0') }
            </Typography>
            <Typography variant="body1" sx={{ m:1 }} >
              Verified: { centToDollar(teamInfo?.receivableAmt.toString() ?? '0') }
            </Typography>
            <Typography variant="body1" sx={{ m:1 }} >
              Paid: { centToDollar(teamInfo?.paidAmt.toString() ?? '0') }
            </Typography>

          </CardContent>
        </Card>

      </Stack>

      {list && (
        <GetMembersList setSeq={setMemberNo} list={list} />
      )}

      <ActionsOfLeader addr={ addr } seqOfTeam={ seqOfTeam } memberNo={ memberNo } refresh={ refresh } />

    </Paper>
  );
} 
