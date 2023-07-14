import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { useEffect, useState } from "react";
import { Paper, Toolbar } from "@mui/material";

import { Position, getDirectorsFullPosInfo, getManagersFullPosInfo } from "../../../queries/bod";
import { GetOfficersList } from "../../../components/comp/bod/GetOfficersList";

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
      <Toolbar>
        <h3>BOD - Book Of Directors (Addr: {boox ? boox[2]: undefined}) </h3>
      </Toolbar>

      {directorsList && (
        <GetOfficersList list={directorsList} title="Directors List" getOfficersList={getDirectorsList} />
      )}
        
    </Paper>
  );
} 

export default BookOfDirectors;