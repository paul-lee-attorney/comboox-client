"use client"

import { useEffect, useState } from "react";

import { Paper, Stack, Toolbar, Typography } from "@mui/material";

import { Position, getDirectorsFullPosInfo, getManagersFullPosInfo, } from "./rod";

import { GetOfficersList } from "./components/GetOfficersList";
import { CopyLongStrSpan } from "../../common/CopyLongStr";
import { booxMap } from "../../common";
import { useComBooxContext } from "../../../_providers/ComBooxContextProvider";

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
        <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
          <b>ROD - Register Of Directors</b>
        </Typography>

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