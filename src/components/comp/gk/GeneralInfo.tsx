import { useEffect, useState } from "react";

import { Paper, Toolbar, TextField } from "@mui/material";

import { useComBooxContext } from "../../../scripts/ComBooxContext";


import { nameOfCompany, regNumOfCompany, symbolOfCompany } from "../../../queries/gk";
import { getControllor, getOwnersEquity, getVotesOfController } from "../../../queries/rom";

import { longDataParser, longSnParser } from "../../../scripts/toolsKit";

import { MembersEquityList } from "../bom/MembersList";
import { Position, getDirectorsFullPosInfo, getDirectorsPosList, getPosition } from "../../../queries/bod";
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

  const [ directorsList, setDirectorsList ] = useState<readonly Position[]>();

  const getDirectorsList = async ()=>{
    if (boox) {
      let list = await getDirectorsFullPosInfo(boox[2]);
      setDirectorsList(list);  
    }   
  };

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
      
      getControllor(boox[4]).then(
        res => setControllor(res.toString())
      );
      getVotesOfController(boox[4]).then(
        res => setVotesOfController(res.toString())
      );
      getOwnersEquity(boox[4]).then(
        res => {
          setPar(res.par.toString());
          setPaid(res.paid.toString());
        }
      );
      getDirectorsList();
    }
  });


  // const {
  //   refetch: getDirectorsList
  // } = useBookOfDirectorsGetDirectorsPosList({
  //   address: boox ? boox[2] : undefined,
  //   onSuccess(list) {
  //     let len = list.length;
  //     let output: Position[] = [];
  //     while (len > 0) {
  //       if (boox) {
  //         getPosition(boox[2], list[len-1]).then(
  //           v => {
  //             output.push(v);
  //             len--;
  //           }
  //         )
  //       }
  //     }
  //     setDirectorsList(output);
  //   }
  // });

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