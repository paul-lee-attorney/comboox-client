import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { useEffect, useState } from "react";
import { Paper, Stack, Toolbar } from "@mui/material";

import { Position, getDirectorsFullPosInfo, getManagersFullPosInfo } from "../../../queries/bod";
import { GetOfficersList } from "../../../components/comp/bod/GetOfficersList";
import { CopyLongStrSpan } from "../../../components/common/utils/CopyLongStr";

function BookOfDirectors() {

  const { boox } = useComBooxContext();

  const [ directorsList, setDirectorsList ] = useState<readonly Position[]>();

  const getDirectorsList = async ()=>{
    if (boox) {
      let list = await getDirectorsFullPosInfo(boox[2]);
      setDirectorsList(list);
    }
  }

  useEffect(()=>{
    getDirectorsList();
  });

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
        
    </Paper>
  );
} 

export default BookOfDirectors;