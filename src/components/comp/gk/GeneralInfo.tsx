import { useEffect, useState } from "react";

import { Paper, Toolbar, TextField, Stack } from "@mui/material";

import { useComBooxContext } from "../../../scripts/common/ComBooxContext";

import { centToDollar, dateParser, getEthPart, getGEthPart, getGWeiPart, getWeiPart, longSnParser } from "../../../scripts/common/toolsKit";

import { MembersEquityList } from "../rom/MembersList";
import { Position, getDirectorsFullPosInfo } from "../../../scripts/comp/rod";
import { GetOfficersList } from "../rod/GetOfficersList";

import { ConfigSetting } from "./ConfigSetting";
import { CopyLongStrTF } from "../../common/utils/CopyLongStr";
import { balanceOf } from "../../../scripts/center/rc";
import { booxMap } from "../../../scripts/common";
import { CompInfo, balanceOfWei, getCompInfo, totalDeposits } from "../../../scripts/comp/gk";
import { getControllor, getOwnersEquity, votesOfGroup } from "../../../scripts/comp/rom";
import { PickupDeposit } from "./PickupDeposit";
import { InvHistoryOfMember } from "../rom/InvHistoryOfMember";
import { DepositOfMine } from "./DepositOfMine";
import { getDK } from "../../../scripts/common/accessControl";

export const currencies:string[] = [
  'USD', 'GBP', 'EUR', 'JPY', 'KRW', 'CNY',
  'AUD', 'CAD', 'CHF', 'ARS', 'PHP', 'NZD', 
  'SGD', 'NGN', 'ZAR', 'RUB', 'INR', 'BRL'
]

export function GeneralInfo() {
  const { gk, boox } = useComBooxContext();

  const [ time, setTime ] = useState<number>(0);

  const refresh = () => {
    setTime(Date.now());
  }

  const [ compInfo, setCompInfo ] = useState<CompInfo>();
  const [ dk, setDK ] = useState<string>('');

  useEffect(()=>{
    if (gk) {
      getCompInfo(gk).then(
        res => setCompInfo(res)
      )      
      getDK(gk).then(
        res => setDK(res)
      )
      
    }
  }, [gk])

  const [ controllor, setControllor ] = useState<string>();
  const [ votesOfController, setVotesOfController ] = useState<string>();
  const [ par, setPar ] = useState<string>();
  const [ paid, setPaid ] = useState<string>();
  const [ directorsList, setDirectorsList ] = useState<readonly Position[]>();

  useEffect(()=>{
    if (boox) {
      getControllor(boox[booxMap.ROM]).then(
        res => {
          if (res > 0) {
            setControllor(res.toString());
            votesOfGroup(boox[booxMap.ROM], Number(res)).then(
              votes => setVotesOfController(votes.toString())
            );
          }
        }
      );

      getOwnersEquity(boox[booxMap.ROM]).then(
        res => {
          setPar(res.par.toString());
          setPaid(res.paid.toString());
        }
      );

      getDirectorsFullPosInfo(boox[booxMap.ROD]).then(
        ls => setDirectorsList(ls)
      );
    }
  }, [boox]); 

  const [ balanceOfCBP, setBalanceOfCBP ] = useState<string>('0');
  const [ balanceOfETH, setBalanceOfETH ] = useState<string>('0');
  const [ depositsOfETH, setDepositsOfETH ] = useState<string>('0');

  useEffect(()=>{
    if (gk) {

      balanceOfWei(gk).then(
        res => setBalanceOfETH(res.toString())
      )

      balanceOf(gk).then(
        res => setBalanceOfCBP(res.toString())        
      )
    
      totalDeposits(gk).then(
        res => setDepositsOfETH(res.toString())
      )
    }
  }, [ gk, time ]);

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
                        value={ dateParser(compInfo?.regDate.toString() ?? '0') } 
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

                    <PickupDeposit refresh={refresh} />

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
                  <GetOfficersList list={directorsList} title="Directors List" />
                )}
              </td>
            </tr>

          </tbody>
        </table>
      </Paper>
    </>
  );
} 