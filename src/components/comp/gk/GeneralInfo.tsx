import { useState } from "react";

import { Paper, Toolbar, TextField, Stack } from "@mui/material";

import { useComBooxContext } from "../../../scripts/ComBooxContext";

import { longDataParser, longSnParser } from "../../../scripts/toolsKit";

import { MembersEquityList } from "../bom/MembersList";
import { Position, getFullPosInfo } from "../../../queries/bod";
import { GetOfficersList } from "../bod/GetOfficersList";

import { 
  useAccessControlGetDk,
  useBookOfDirectorsGetDirectorsPosList,
  useBookOfMembersControllor, 
  useBookOfMembersOwnersEquity, 
  useBookOfMembersVotesOfController, 
  useGeneralKeeperNameOfCompany, 
  useGeneralKeeperRegNumOfCompany, 
  useGeneralKeeperSymbolOfCompany 
} from "../../../generated";
import { ConfigSetting } from "./ConfigSetting";
import { CopyLongStrTF } from "../../common/utils/CopyLongStr";

export function GeneralInfo() {
  const { gk, boox } = useComBooxContext();

  const [ compName, setCompName ] = useState<string>('');

  useGeneralKeeperNameOfCompany({
    address: gk,
    onSuccess(name) {
      setCompName(name)
    }
  })

  const [ regNum, setRegNum ] = useState<string>('');

  useGeneralKeeperRegNumOfCompany({
    address: gk,
    onSuccess(num) {
      setRegNum( num.toString() )
    }
  })

  const [ symbol, setSymbol ] = useState<string>('');

  useGeneralKeeperSymbolOfCompany({
    address: gk,
    onSuccess(res) {
      setSymbol(res)
    }
  })

  const [ dk, setDK ] = useState<string>('');

  useAccessControlGetDk({
    address: gk,
    onSuccess(res) {
      setDK(res)
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


  return (
    <>
      <Paper elevation={3} 
        sx={{
          alignContent:'center', 
          justifyContent:'center', 
          m:1, p:1, border:1, 
          borderColor:'divider' 
        }} 
      >
        <Stack direction='row' >
          
          <Toolbar sx={{ mr: 5,  textDecoration:'underline' }}>
            <h3>General Info</h3>
          </Toolbar>

          <ConfigSetting companyName={ compName } symbol={symbol}  />

        </Stack>
        <table width={1680}>
          <thead>

            <tr>        
              <td colSpan={4}>
                {compName && (
                  <TextField 
                    value={ compName } 
                    variant='outlined'
                    size='small' 
                    label="NameOfCompany" 
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
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
                    variant='outlined'
                    size='small' 
                    label="RegNum" 
                    inputProps={{readOnly: true}}
                    sx={{
                      minWidth: 120,
                      m:1,
                    }}
                    fullWidth
                  />
                )}
              </td>

              <td >
                {symbol && (
                  <TextField 
                    value={symbol} 
                    variant='outlined'
                    size='small' 
                    label="SymbolOfCompany" 
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                    }}
                    fullWidth
                  />
                )}
              </td>

              <td >
                {gk && (
                  <CopyLongStrTF title="AddressOfCompany" src={gk} size="h4" />
                )}
              </td>
              <td >
                {dk && (
                  <CopyLongStrTF title="BoardSecretary" src={dk} size="h4" />
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
                    variant='outlined'
                    size='small' 
                    label="ActualControllor" 
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                    }}
                    fullWidth
                  />
                )}
              </td>
              <td>
                {votesOfController && (
                  <TextField 
                    value={ longDataParser(votesOfController) } 
                    variant='outlined'
                    size='small' 
                    label="VotesOfController" 
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                    }} 
                    fullWidth
                  />
                )}
              </td>
              <td>
                {par && (
                  <TextField 
                    value={ longDataParser(par)} 
                    variant='outlined'
                    size='small' 
                    label="RegisteredCapital" 
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                    }}
                    fullWidth
                  />
                )}
              </td>
              <td>
                {paid && (
                  <TextField 
                    value={ longDataParser(paid) } 
                    variant='outlined'
                    size='small' 
                    label="PaidInCapital" 
                    inputProps={{readOnly: true}}
                    sx={{
                      m: 1,
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