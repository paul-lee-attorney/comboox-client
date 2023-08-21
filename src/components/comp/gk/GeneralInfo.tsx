import { useState } from "react";

import { Paper, Toolbar, TextField, Stack } from "@mui/material";

import { useComBooxContext } from "../../../scripts/ComBooxContext";

import { dateParser, longDataParser, longSnParser, toStr } from "../../../scripts/toolsKit";

import { MembersEquityList } from "../rom/MembersList";
import { Position, getFullPosInfo } from "../../../queries/rod";
import { GetOfficersList } from "../rod/GetOfficersList";

import { 
  useAccessControlGetDk,
  useRegisterOfDirectorsGetDirectorsPosList,
  useRegisterOfMembersControllor, 
  useRegisterOfMembersOwnersEquity, 
  useRegisterOfMembersVotesOfController, 
  useGeneralKeeperGetCompUser,
  useGeneralKeeperGetCompInfo
} from "../../../generated";
import { ConfigSetting } from "./ConfigSetting";
import { CopyLongStrTF } from "../../common/utils/CopyLongStr";
import { User } from "../../../queries/rc";
import { HexType } from "../../../interfaces";
import { CompInfo } from "../../../queries/gk";


export const currencies:string[] = [
  'USD', 'GBP', 'EUR', 'JPY', 'KRW', 'CNY',
  'AUD', 'CAD', 'CHF', 'ARS', 'PHP', 'NZD', 
  'SGD', 'NGN', 'ZAR', 'RUB', 'INR', 'BRL'
]

export function GeneralInfo() {
  const { gk, boox } = useComBooxContext();

  const [ compInfo, setCompInfo ] = useState<CompInfo>();

  useGeneralKeeperGetCompInfo({
    address: gk,
    onSuccess(res) {

      let info:CompInfo = {
        regNum: res.regNum,
        regDate: res.regDate,
        currency: res.currency,
        symbol: toStr(Number(res.symbol)),
        name: res.name
      }
      setCompInfo(info);
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

  useRegisterOfMembersControllor({
    address: boox ? boox[4] : undefined,
    onSuccess(res) {
      setControllor(res.toString())
    }
  })

  const [ votesOfController, setVotesOfController ] = useState<string>();

  useRegisterOfMembersVotesOfController({
    address: boox ? boox[4] : undefined,
    onSuccess(res) {
      setVotesOfController(res.toString())
    }
  })

  const [ par, setPar ] = useState<string>();
  const [ paid, setPaid ] = useState<string>();

  useRegisterOfMembersOwnersEquity({
    address: boox ? boox[4] : undefined,
    onSuccess(res) {
      setPar(res.par.toString());
      setPaid(res.paid.toString());
    }
  })

  const [ directorsList, setDirectorsList ] = useState<readonly Position[]>();

  const {
    refetch: getDirectorsList
  } = useRegisterOfDirectorsGetDirectorsPosList({
    address: boox ? boox[2] : undefined,
    onSuccess(res) {
      if (boox)
        getFullPosInfo(boox[2], res).then(
          list => setDirectorsList(list)
        );
    }
  })

  const [ compUser, setCompUser ] = useState<User>();

  const{
    refetch: getCompUser
  } = useGeneralKeeperGetCompUser({
    address: gk,
    onSuccess(res) {
      setCompUser(res);
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

          {compInfo && (
            <ConfigSetting companyName={ compInfo.name } symbol={  compInfo.symbol }  />
          )}


        </Stack>
        <table width={1680}>
          <thead>

            <tr>        
              <td colSpan={2}>
                {compInfo && (
                  <TextField 
                    value={ compInfo.name } 
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

              <td>
                <TextField 
                  value={ currencies[ compInfo?.currency ?? 0 ] } 
                  variant='outlined'
                  size='small' 
                  label="BookingCurrency" 
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                  }}
                  fullWidth
                />
              </td>

              <td>
                <TextField 
                  value={ dateParser(compInfo?.regDate ?? 0) } 
                  variant='outlined'
                  size='small' 
                  label="RegDate" 
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                  }}
                  fullWidth
                />
              </td>

            </tr>

            <tr>        
              <td >
                {compInfo && (
                  <TextField 
                    value={ longSnParser(compInfo.regNum.toString()) } 
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
                {compInfo && (
                  <TextField 
                    value={compInfo.symbol} 
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