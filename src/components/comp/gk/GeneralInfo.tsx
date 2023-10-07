import { useState } from "react";

import { Paper, Toolbar, TextField, Stack } from "@mui/material";

import { useComBooxContext } from "../../../scripts/common/ComBooxContext";

import { centToDollar, dateParser, getEthPart, getGEthPart, getGWeiPart, getWeiPart, longSnParser, toStr } from "../../../scripts/common/toolsKit";

import { MembersEquityList } from "../rom/MembersList";
import { Position, getFullPosInfo } from "../../../scripts/comp/rod";
import { GetOfficersList } from "../rod/GetOfficersList";

import { 
  useAccessControlGetDk,
  useRegisterOfDirectorsGetDirectorsPosList,
  useRegisterOfMembersControllor, 
  useRegisterOfMembersOwnersEquity, 
  useGeneralKeeperGetCompUser,
  useGeneralKeeperGetCompInfo,
  useRegCenterBalanceOf,
  useGeneralKeeperTotalDeposits,
} from "../../../generated";

import { ConfigSetting } from "./ConfigSetting";
import { CopyLongStrTF } from "../../common/utils/CopyLongStr";
import { User } from "../../../scripts/center/rc";
import { AddrOfRegCenter, booxMap } from "../../../scripts/common";
import { CompInfo, balanceOfGwei } from "../../../scripts/comp/gk";
import { PickupDeposit } from "./PickupDeposit";
import { InvHistoryOfMember } from "../rom/InvHistoryOfMember";
import { votesOfGroup } from "../../../scripts/comp/rom";
import { DepositOfMine } from "./DepositOfMine";


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
  const [ votesOfController, setVotesOfController ] = useState<string>();

  useRegisterOfMembersControllor({
    address: boox ? boox[booxMap.ROM] : undefined,
    onSuccess(res) {
      if (boox) {
        setControllor(res.toString());
        votesOfGroup(boox[booxMap.ROM], BigInt(res)).then(
          votes => setVotesOfController(votes.toString())
        );
      }
    }
  })

  const [ par, setPar ] = useState<string>();
  const [ paid, setPaid ] = useState<string>();

  useRegisterOfMembersOwnersEquity({
    address: boox ? boox[booxMap.ROM] : undefined,
    onSuccess(res) {
      setPar(res.par.toString());
      setPaid(res.paid.toString());
    }
  })

  const [ directorsList, setDirectorsList ] = useState<readonly Position[]>();

  const {
    refetch: getDirectorsList
  } = useRegisterOfDirectorsGetDirectorsPosList({
    address: boox ? boox[booxMap.ROD] : undefined,
    onSuccess(res) {
      if (boox)
        getFullPosInfo(boox[booxMap.ROD], res).then(
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
  const [ depositsOfETH, setDepositsOfETH ] = useState<string>('0');

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

  const {
    refetch: getDeposits
  } = useGeneralKeeperTotalDeposits({
    address: gk,
    onSuccess(amt) {
      setDepositsOfETH(amt.toString());
    }
  })

  const [ acct, setAcct ] = useState<number>(0);
  const [ open, setOpen ] = useState(false);

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

        <table>
          <tbody>

            <tr >
              <td colSpan={4}>
                <Paper elevation={3} sx={{m:1, p:1 }} >

                  <Stack direction='row' sx={{ alignItems:'center' }} >
          
                    <Toolbar sx={{ mr: 5,  textDecoration:'underline' }}>
                      <h3>General Info</h3>
                    </Toolbar>

                    {compInfo && (
                      <ConfigSetting companyName={ compInfo.name } symbol={  compInfo.symbol }  />
                    )}

                  </Stack>

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
                        <CopyLongStrTF title="AddressOfCompany" src={gk} />
                      )}
                    </td>
                    <td >
                      {dk && (
                        <CopyLongStrTF title="Secretary" src={dk} />
                      )}
                    </td>
                  </tr>

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

                </Paper>
              </td>
            </tr>

            <tr>
              <td colSpan={4}>
                <Paper elevation={3} sx={{m:1, p:1, }} >

                  <Stack direction='row' sx={{ alignItems:'center' }} >
            
                    <Toolbar sx={{ mr: 5,  textDecoration:'underline' }}>
                      <h3>Cash Box</h3>
                    </Toolbar>

                    <PickupDeposit getBalanceOf={getBalanceOf} getDeposits={getDeposits} />

                    <DepositOfMine />

                  </Stack>

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
                        value={ getGEthPart(balanceOfCBP) }
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
                        value={ getEthPart(balanceOfCBP) }
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
                        value={ getGEthPart(balanceOfETH) }
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
                        value={ getEthPart(balanceOfETH) }
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
                        value={ getGWeiPart(balanceOfETH) }
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
                        value={ getWeiPart(balanceOfETH) }
                      />
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <TextField 
                        size="small"
                        variant='outlined'
                        label='Deposits (Giga ETH)'
                        inputProps={{readOnly: true}}
                        fullWidth
                        sx={{
                          m:1,
                        }}
                        value={ getGEthPart(depositsOfETH) }
                      />
                    </td>
                    <td>
                      <TextField 
                        size="small"
                        variant='outlined'
                        label='Deposits (ETH)'
                        inputProps={{readOnly: true}}
                        fullWidth
                        sx={{
                          m:1,
                        }}
                        value={ getEthPart(depositsOfETH) }
                      />
                    </td>
                    <td>
                      <TextField 
                        size="small"
                        variant='outlined'
                        label='Deposits (GWei)'
                        inputProps={{readOnly: true}}
                        fullWidth
                        sx={{
                          m:1,
                        }}
                        value={ getGWeiPart(depositsOfETH) }
                      />
                    </td>
                    <td>
                      <TextField 
                        size="small"
                        variant='outlined'
                        label='Deposits (Wei)'
                        inputProps={{readOnly: true}}
                        fullWidth
                        sx={{
                          m:1,
                        }}
                        value={ getWeiPart(depositsOfETH) }
                      />
                    </td>
                  </tr>


                </Paper>
              </td>
            </tr>

            <tr>
              <td colSpan={4}>
                <MembersEquityList setAcct={setAcct} setOpen={setOpen} />

                {acct > 0 && open && (
                  <InvHistoryOfMember acct={ acct } open={ open } setOpen={ setOpen } />
                )}

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