import { useComBooxContext } from "../../../scripts/common/ComBooxContext";
import { useState } from "react";
import { Paper, Stack, Toolbar } from "@mui/material";

import { Position, getFullPosInfo, } from "../../../scripts/comp/rod";
import { GetOfficersList } from "../../../components/comp/rod/GetOfficersList";
import { CopyLongStrSpan } from "../../../components/common/utils/CopyLongStr";
import { useRegisterOfDirectorsGetDirectorsPosList, useRegisterOfDirectorsGetManagersPosList } from "../../../generated";
import { booxMap } from "../../../scripts/common";

function RegisterOfDirectors() {

  const { boox } = useComBooxContext();

  const [ directorsList, setDirectorsList ] = useState<readonly Position[]>();

  const {
    refetch: getDirectorsList
  } = useRegisterOfDirectorsGetDirectorsPosList({
    address: boox ? boox[booxMap.ROD] : undefined,
    onSuccess(res) {
      if (boox)
        getFullPosInfo(boox[booxMap.ROD], res).then(
          list => setDirectorsList(list)
        );
    }
  })

  const [ officersList, setOfficersList ] = useState<readonly Position[]>();

  const {
    refetch: getOfficersList
  } = useRegisterOfDirectorsGetManagersPosList({
    address: boox ? boox[booxMap.ROD] : undefined,
    onSuccess(res) {
      if (boox)
        getFullPosInfo(boox[booxMap.ROD], res).then(
          list => setOfficersList(list)
        );
    }
  })

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