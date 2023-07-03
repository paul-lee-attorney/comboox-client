import { useEffect, useState } from "react";

import { Paper, Toolbar, TextField } from "@mui/material";

import { useComBooxContext } from "../../../scripts/ComBooxContext";


import { nameOfCompany, regNumOfCompany, symbolOfCompany } from "../../../queries/gk";
import { getControllor, getOwnersEquity, getVotesOfController } from "../../../queries/rom";

import { longDataParser, longSnParser } from "../../../scripts/toolsKit";

import { MembersEquityList } from "../rom/MembersList";
import { Position } from "../../../queries/bod";
import { useBookOfDirectorsGetDirectorsFullPosInfo } from "../../../generated";
import { GetOfficersList } from "../bod/GetOfficersList";


export function GeneralInfo() {
  const { gk, boox } = useComBooxContext();

  const [ compName, setCompName ] = useState<string>();
  const [ regNum, setRegNum ] = useState<string>();
  const [ symbol, setSymbol ] = useState<string>();

  const [ controllor, setControllor ] = useState<string>();
  const [ votesOfController, setVotesOfController ] = useState<string>();
  const [ par, setPar ] = useState<string>();
  const [ paid, setPaid ] = useState<string>();

  useEffect(()=>{
    if (gk && boox) {
      nameOfCompany(gk).then(
        res => setCompName(res)
      );
      regNumOfCompany(gk).then(
        res => setRegNum(res.toString())
      );
      symbolOfCompany(gk).then(
        res => setSymbol(res)
      );
      
      getControllor(boox[8]).then(
        res => setControllor(res.toString())
      );
      getVotesOfController(boox[8]).then(
        res => setVotesOfController(res.toString())
      );
      getOwnersEquity(boox[8]).then(
        res => {
          setPar(res.par.toString());
          setPaid(res.paid.toString());
        }
      )
    }
  }, [gk, boox]);

  const [ directorsList, setDirectorsList ] = useState<readonly Position[]>();

  const {
    refetch: getDirectorsList
  } = useBookOfDirectorsGetDirectorsFullPosInfo({
    address: boox ? boox[2] : undefined,
    onSuccess(list) {
      setDirectorsList(list);
    }
  });

  return (
    <>
      <Paper elevation={3} 
        sx={{
          alignContent:'center', 
          justifyContent:'center', 
          p:1, m:1, border:1, 
          borderColor:'divider' 
        }} 
      >
        <Toolbar sx={{ textDecoration:'underline' }}>
          <h3>General Info</h3>
        </Toolbar>

        <table width={1680}>
          <thead>

            <tr>        
              <td colSpan={4}>
                {compName && (
                  <TextField 
                    value={ compName } 
                    variant='filled' 
                    label="NameOfCompany" 
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1, p:1
                    }}
                    fullWidth
                  />
                )}
              </td>
            </tr>

            <tr>        
              <td >
                {regNum && (
                  <TextField 
                    value={ longSnParser(regNum) } 
                    variant='filled' 
                    label="RegNum" 
                    inputProps={{readOnly: true}}
                    sx={{
                      minWidth: 120,
                      m:1, p:1
                    }}
                    fullWidth
                  />
                )}
              </td>

              <td >
                {symbol && (
                  <TextField 
                    value={symbol} 
                    variant='filled' 
                    label="SymbolOfCompany" 
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1, p:1
                    }}
                    fullWidth
                  />
                )}
              </td>

              <td colSpan={2} >
                {gk && (
                  <TextField 
                    value={gk} 
                    variant='filled' 
                    label="AddressOfCompany" 
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1, p:1
                    }}
                    fullWidth
                  />
                )}
              </td>
            </tr>
          </thead>
          
          <tbody>

            <tr>
              <td>
                {controllor && (
                  <TextField 
                    value={ longSnParser(controllor) } 
                    variant='filled' 
                    label="ActualControllor" 
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1, p:1
                    }}
                    fullWidth
                  />
                )}
              </td>
              <td>
                {votesOfController && (
                  <TextField 
                    value={ longDataParser(votesOfController) } 
                    variant='filled' 
                    label="VotesOfController" 
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1, p:1
                    }} 
                    fullWidth
                  />
                )}
              </td>
              <td>
                {par && (
                  <TextField 
                    value={ longDataParser(par)} 
                    variant='filled' 
                    label="RegisteredCapital" 
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1, p:1
                    }}
                    fullWidth
                  />
                )}
              </td>
              <td>
                {paid && (
                  <TextField 
                    value={ longDataParser(paid) } 
                    variant='filled' 
                    label="PaidInCapital" 
                    inputProps={{readOnly: true}}
                    sx={{
                      m: 1, p:1
                    }}
                    fullWidth
                  />
                )}
              </td>
            </tr>

            <tr>
              <td colSpan={4}>
                <MembersEquityList />
              </td>
            </tr>

            <tr>
              <td colSpan={4}>
                {directorsList && (
                  <GetOfficersList list={directorsList} title="Directors List" getOfficersList={getDirectorsList} />
                )}
              </td>
            </tr>

          </tbody>
        </table>
      </Paper>
    </>
  );
} 