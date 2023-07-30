import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { useState } from "react";
import { Paper, Stack, Toolbar } from "@mui/material";

import { Position, getFullPosInfo, } from "../../../queries/bod";
import { GetOfficersList } from "../../../components/comp/bod/GetOfficersList";
import { CopyLongStrSpan } from "../../../components/common/utils/CopyLongStr";
import { useBookOfDirectorsGetDirectorsPosList, useBookOfDirectorsGetManagersPosList } from "../../../generated";

function BookOfDirectors() {

  const { boox } = useComBooxContext();

  const [ directorsList, setDirectorsList ] = useState<readonly Position[]>();

  const {
    refetch: getDirectorsList
  } = useBookOfDirectorsGetDirectorsPosList({
    address: boox ? boox[2] : undefined,
    onSuccess(res) {
      if (boox)
        getFullPosInfo(boox[2], res).then(
          list => setDirectorsList(list)
        );
    }
  })

  const [ officersList, setOfficersList ] = useState<readonly Position[]>();

  const {
    refetch: getOfficersList
  } = useBookOfDirectorsGetManagersPosList({
    address: boox ? boox[2] : undefined,
    onSuccess(res) {
      if (boox)
        getFullPosInfo(boox[2], res).then(
          list => setOfficersList(list)
        );
    }
  })

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, maxWidth: 1680, border:1, borderColor:'divider' }} >

      <Stack direction='row' >
        <Toolbar sx={{ textDecoration:'underline' }}>
          <h3>BOD - Book Of Directors</h3>
        </Toolbar>

        {boox && (
          <CopyLongStrSpan title="Addr" size="body1" src={boox[2].toLowerCase()} />
        )}

      </Stack>

      {directorsList && (
        <GetOfficersList list={directorsList} title="Directors List" getOfficersList={getDirectorsList} />
      )}
        
      {officersList && (
        <GetOfficersList list={officersList} title="Officers List" getOfficersList={getOfficersList} />
      )}


    </Paper>
  );
} 

export default BookOfDirectors;