import { useComBooxContext } from "../../../scripts/common/ComBooxContext";
import { useEffect, useState } from "react";
import { Paper, Stack, Toolbar } from "@mui/material";

import { Position, getDirectorsFullPosInfo, getManagersFullPosInfo, } from "../../../scripts/comp/rod";
import { GetOfficersList } from "../../../components/comp/rod/GetOfficersList";
import { CopyLongStrSpan } from "../../../components/common/utils/CopyLongStr";
import { booxMap } from "../../../scripts/common";

function RegisterOfDirectors() {

  const { boox } = useComBooxContext();

  const [ directorsList, setDirectorsList ] = useState<readonly Position[]>();
  const [ officersList, setOfficersList ] = useState<readonly Position[]>();

  useEffect(()=>{
    if (boox) {
      getDirectorsFullPosInfo(boox[booxMap.ROD]).then(
        ls => setDirectorsList(ls)
      );
      getManagersFullPosInfo(boox[booxMap.ROD]).then(
        ls => setOfficersList(ls)
      );
    }
  }, [boox]);

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, maxWidth: 1680, border:1, borderColor:'divider' }} >

      <Stack direction='row' >
        <Toolbar sx={{ textDecoration:'underline' }}>
          <h3>ROD - Register Of Directors</h3>
        </Toolbar>

        {boox && (
          <CopyLongStrSpan title="Addr"  src={boox[booxMap.ROD].toLowerCase()} />
        )}

      </Stack>

      {directorsList && (
        <GetOfficersList list={directorsList} title="Directors List" />
      )}
        
      {officersList && (
        <GetOfficersList list={officersList} title="Officers List" />
      )}


    </Paper>
  );
} 

export default RegisterOfDirectors;