import { useEffect, useState } from "react";

import { Paper, Toolbar, TextField } from "@mui/material";

import { useComBooxContext } from "../../../scripts/ComBooxContext";

import { longDataParser, longSnParser } from "../../../scripts/toolsKit";

import { MembersEquityList } from "../bom/MembersList";
import { Position, getDirectorsFullPosInfo, getPosition } from "../../../queries/bod";
import { GetOfficersList } from "../bod/GetOfficersList";

import { 
  useBookOfDirectorsGetDirectorsPosList, 
  useBookOfMembersControllor, 
  useBookOfMembersOwnersEquity, 
  useBookOfMembersVotesOfController, 
  useGeneralKeeperNameOfCompany, 
  useGeneralKeeperRegNumOfCompany, 
  useGeneralKeeperSymbolOfCompany 
} from "../../../generated";

export function GeneralInfo() {
  const { gk, boox } = useComBooxContext();

  const [ compName, setCompName ] = useState<string>();

  useGeneralKeeperNameOfCompany({
    address: gk,
    onSuccess(name) {
      setCompName(name)
    }
  })

  const [ regNum, setRegNum ] = useState<string>();

  useGeneralKeeperRegNumOfCompany({
    address: gk,
    onSuccess(num) {
      setRegNum( num.toString() )
    }
  })

  const [ symbol, setSymbol ] = useState<string>();

  useGeneralKeeperSymbolOfCompany({
    address: gk,
    onSuccess(res) {
      setSymbol(res)
    }
  })

  const [ controllor, setControllor ] = useState<string>();

  useBookOfMembersControllor({
    address: boox ? boox[4] : undefined,
    onSuccess(res) {
      setControllor(res.toString())
    }
  })

  const [ votesOfController, setVotesOfController ] = useState<string>();

  useBookOfMembersVotesOfController({
    address: boox ? boox[4] : undefined,
    onSuccess(res) {
      setVotesOfController(res.toString())
    }
  })

  const [ par, setPar ] = useState<string>();
  const [ paid, setPaid ] = useState<string>();

  useBookOfMembersOwnersEquity({
    address: boox ? boox[4] : undefined,
    onSuccess(res) {
      setPar(res.par.toString());
      setPaid(res.paid.toString());
    }
  })

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
  //           }
  //         )
  //         len--;
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
                {directorsList && directorsList.length > 0 && (
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