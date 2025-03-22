import { Stack } from "@mui/material";
import { GetOfficersList } from "../../rod/components/GetOfficersList";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { useEffect, useState } from "react";
import { getDirectorsFullPosInfo, Position } from "../../rod/rod";
import { booxMap } from "../../../common";

export function DirectorsList() {

  const { boox } = useComBooxContext();

  const [ directorsList, setDirectorsList ] = useState<readonly Position[]>();

  useEffect(()=>{
    if (boox) {

      getDirectorsFullPosInfo(boox[booxMap.ROD]).then(
        ls => setDirectorsList(ls)
      );
    }
  }, [boox]); 

  return (

    <Stack direction='row' sx={{m:1}} >
      {directorsList && directorsList.length > 0 && (
        <GetOfficersList list={directorsList} title="Directors List" />
      )}
    </Stack>

  );

}