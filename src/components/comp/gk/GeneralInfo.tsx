import { useEffect, useState } from "react";

import { Paper, Toolbar, TextField, Stack } from "@mui/material";

import { useComBooxContext } from "../../../scripts/ComBooxContext";

import { centToDollar, dateParser, getGWeiPart, getWeiPart, longDataParser, longSnParser, toStr } from "../../../scripts/toolsKit";

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
  useGeneralKeeperGetCompInfo,
  useRegCenterBalanceOf
} from "../../../generated";

import { ConfigSetting } from "./ConfigSetting";
import { CopyLongStrTF } from "../../common/utils/CopyLongStr";
import { User } from "../../../queries/rc";
import { AddrOfRegCenter, HexType } from "../../../interfaces";
import { CompInfo, balanceOfGwei } from "../../../queries/gk";
import { PickupDeposit } from "./PickupDeposit";


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

  const [ balanceOfCBP, setBalanceOfCBP ] = useState<string>('0');

  const [ balanceOfETH, setBalanceOfETH ] = useState<string>('0');

  const getGwei = async () => {
    if (gk) {
      let gwei = await balanceOfGwei(gk);
      setBalanceOfETH(gwei.toString());
    }
  }

  const {
    refetch: getBalanceOf
  } = useRegCenterBalanceOf({
    address: AddrOfRegCenter,
    args: gk ? [ gk ] : undefined,
    onSuccess(amt) {
      setBalanceOfCBP(amt.toString());
      getGwei();
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
        <Stack direction='row' sx={{ alignItems:'center' }} >
          
          <Toolbar sx={{ mr: 5,  textDecoration:'underline' }}>
            <h3>General Info</h3>
          </Toolbar>

          {compInfo && (
            <ConfigSetting companyName={ compInfo.name } symbol={  compInfo.symbol }  />
          )}

          <PickupDeposit getBalanceOf={getBalanceOf} />

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
                    value={ centToDollar(votesOfController) } 
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
                    value={ centToDollar(par)} 
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
                    value={ centToDollar(paid) } 
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
            <td>
              <TextField 
                size="small"
                variant='outlined'
                label='BalanceOfCBP (Giga CBP)'
                inputProps={{readOnly: true}}
                fullWidth
                sx={{
                  m:1,
                }}
                value={ longDataParser(balanceOfCBP.length > 27 ? balanceOfCBP.substring(0, balanceOfCBP.length - 27) : '0') }
              />
            </td>
            <td>
              <TextField 
                size="small"
                variant='outlined'
                label='BalanceOfCBP (CBP)'
                inputProps={{readOnly: true}}
                fullWidth
                sx={{
                  m:1,
                }}
                value={ longDataParser(
                    balanceOfCBP.length > 18 
                  ? balanceOfCBP.length > 27
                    ? balanceOfCBP.substring(balanceOfCBP.length - 27, balanceOfCBP.length - 18)
                    : balanceOfCBP.substring(0, balanceOfCBP.length - 18) 
                  : '0') }
              />
            </td>
            <td>
              <TextField 
                size="small"
                variant='outlined'
                label='BalanceOfCBP (GLee)'
                inputProps={{readOnly: true}}
                fullWidth
                sx={{
                  m:1,
                }}
                value={ getGWeiPart(balanceOfCBP) }
              />
            </td>
            <td>
              <TextField 
                size="small"
                variant='outlined'
                label='BalanceOfCBP (Lee)'
                inputProps={{readOnly: true}}
                fullWidth
                sx={{
                  m:1,
                }}
                value={ getWeiPart(balanceOfCBP)}
              />
            </td>
          </tr>

          <tr>
            <td>
              <TextField 
                size="small"
                variant='outlined'
                label='BalanceOfETH (Giga ETH)'
                inputProps={{readOnly: true}}
                fullWidth
                sx={{
                  m:1,
                }}
                value={ longDataParser(balanceOfETH.length > 27 ? balanceOfETH.substring(0, balanceOfETH.length - 27) : '0') }
              />
            </td>
            <td>
              <TextField 
                size="small"
                variant='outlined'
                label='BalanceOfETH (ETH)'
                inputProps={{readOnly: true}}
                fullWidth
                sx={{
                  m:1,
                }}
                value={ longDataParser(
                    balanceOfETH.length > 18 
                  ? balanceOfETH.length > 27
                    ? balanceOfETH.substring(balanceOfETH.length - 27, balanceOfETH.length - 18)
                    : balanceOfETH.substring(0, balanceOfETH.length - 18) 
                  : '0') }
              />
            </td>
            <td>
              <TextField 
                size="small"
                variant='outlined'
                label='BalanceOfETH (GWei)'
                inputProps={{readOnly: true}}
                fullWidth
                sx={{
                  m:1,
                }}
                value={ longDataParser(
                    balanceOfETH.length > 9 
                  ? balanceOfETH.length > 18
                    ? balanceOfETH.substring(balanceOfETH.length - 18, balanceOfETH.length - 9)
                    : balanceOfETH.substring(0, balanceOfETH.length - 9) 
                  : '0') }
              />
            </td>
            <td>
              <TextField 
                size="small"
                variant='outlined'
                label='BalanceOfETH (Wei)'
                inputProps={{readOnly: true}}
                fullWidth
                sx={{
                  m:1,
                }}
                value={ longDataParser(
                    balanceOfETH.length > 9
                  ? balanceOfETH.substring(balanceOfETH.length - 9)
                  : balanceOfETH
                )}
              />
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