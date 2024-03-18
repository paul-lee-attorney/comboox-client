
import { Paper, Typography } from "@mui/material";

import { useEffect, useState } from "react";
import { Member, getOwner, getProjectInfo, getTeamInfoList } from "../../../read/lop";
import { ActionsOfManager } from "./ActionsOfManager";
import { PayrollProps } from "../../Owner/write/OwnerPage";
import { GetTeamsList } from "../read/GetTeamsList";
import { MemberInfo } from "../../Member/read/MemberInfo";
import { useComBooxContext } from "../../../../../_providers/ComBooxContextProvider";
import { useWalletClient } from "wagmi";
import { AddrZero, HexType } from "../../../../../read";

export function ManagerPage({ addr }:PayrollProps) {

  const { data: signer } = useWalletClient();
  const { userNo } = useComBooxContext();

  const [ time, setTime ] = useState(0);

  const refresh = () => {
    setTime(Date.now());
  }

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

  const [ pm, setPM ] = useState<number>(0);

  useEffect(()=>{
    getProjectInfo(addr).then(
      res => setPM(res.userNo)
    )
  }, [addr, time]);

  const [ owner, setOwner ] = useState<HexType>(AddrZero);

  useEffect(()=>{
    getOwner(addr).then(
      res => setOwner(res)
    )
  }, [addr, time])

  return (
    <Paper elevation={3} sx={{m:1, p:1, border:1, borderColor:'divider'}} >

      { ((signer && signer.account.address == owner) || 
        (userNo && userNo == pm)) && (
          <>
            <Typography variant="h5" sx={{ m:2 }} >
              <b>Project Info</b>
            </Typography>

            <MemberInfo addr={addr} time={time} seqOfTeam={0} acct={0} />

            {list && (
              <GetTeamsList setSeq={setSeqOfTeam} list={list} />
            )}

            <ActionsOfManager addr={ addr } seqOfTeam={ seqOfTeam } refresh={ refresh } />
          </>
      )}

    </Paper>
  );
} 
