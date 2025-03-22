import { useEffect, useState } from "react";

import { Paper, TextField, Stack, Grid, Typography, Divider } from "@mui/material";

import { useComBooxContext } from "../../../_providers/ComBooxContextProvider";

import { AddrZero, booxMap, currencies } from "../../common";
import { baseToDollar, dateParser, getEthPart, getGEthPart, 
  getGWeiPart, getWeiPart, longDataParser, longSnParser 
} from "../../common/toolsKit";
import { CopyLongStrTF } from "../../common/CopyLongStr";

import { CompInfo, getCompInfo, totalDeposits } from "../gk";
import { getDK } from "../common/draftControl";

import { balanceOf, balanceOfWei } from "../../rc";

import { Position, getDirectorsFullPosInfo } from "../rod/rod";
import { GetOfficersList } from "../rod/components/GetOfficersList";
import { MembersEquityList } from "../rom/components/MembersList";
import { getControllor, getOwnersEquity, votesOfGroup } from "../rom/rom";
import { InvHistoryOfMember } from "../rom/components/InvHistoryOfMember";

import { ConfigSetting } from "./config_setting/ConfigSetting";
import { PickupDeposit } from "./GeneralInfo/CashBox/PickupDeposit";
import { DepositOfMine } from "./GeneralInfo/CashBox/DepositOfMine";
import { FinStatement } from "./FinStatement";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { HistoryOfBoox } from "./GeneralInfo/HistoryOfBoox";
import { balanceOfComp, totalCustody } from "../cashier";

export function GeneralInfo() {
  const { gk, boox } = useComBooxContext();

  const [ time, setTime ] = useState<number>(0);

  const refresh = () => {
    setTime(Date.now());
  }

  const [ compInfo, setCompInfo ] = useState<CompInfo>();
  const [ dk, setDK ] = useState<string>('');

  const client = usePublicClient();

  useEffect(()=>{
    if (gk) {
      getCompInfo(gk).then(
        res => {
          // console.log('compInfo: ', res);
          if (res.state > 0) {
            client.getLogs({
              address: gk,
              event: parseAbiItem('event DeprecateGK(address indexed receiver, uint indexed balanceOfCBP, uint indexed balanceOfETH)'),
              fromBlock: 1n
            }).then(
              logs => {
                res.name = 'moved to new Address: ' + (logs[0].args.receiver?.toString() ?? '');
                setCompInfo(res);
              }
            )
          } else setCompInfo(res);
        }
      )      
      getDK(gk).then(
        res => setDK(res)
      )
      
    }
  }, [gk, time, client]);

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
  const [ balanceOfETH, setBalanceOfETH ] = useState(0n);
  const [ depositsOfETH, setDepositsOfETH ] = useState(0n);


  const [ balanceOfUSD, setBalanceOfUSD ] = useState('0');
  const [ custodyUSD, setCustodyUSD ] = useState('0');

  useEffect(()=>{
    if (gk) {

      balanceOfWei(gk).then(
        res => setBalanceOfETH(res)
      )

      balanceOf(gk, undefined).then(
        res => setBalanceOfCBP(res.toString())        
      )
    
      totalDeposits(gk, undefined).then(
        res => setDepositsOfETH(res)
      )
    }

    if (boox) {

      balanceOfComp(boox[booxMap.Cashier]).then(
        res => setBalanceOfUSD(res.toString())
      );

      totalCustody(boox[booxMap.Cashier]).then(
        res => setCustodyUSD(res.toString())
      );

    }

  }, [ gk, boox, time ]);

  let cap = (balanceOfETH - depositsOfETH).toString();

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

        <Paper elevation={3} sx={{m:1, p:1 }} >
          <Stack direction='row' sx={{ alignItems:'center' }} >

            <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
              <b>General Info</b>
            </Typography>

            {compInfo && (
              <ConfigSetting companyName={ compInfo.name } symbol={  compInfo.symbol } time={ time } setTime={ setTime } />
            )}

            <HistoryOfBoox />

          </Stack>

          <Grid container direction='row' spacing={2} >

            <Grid item xs={6} md={6} lg={6} >
              <TextField 
                value={ compInfo?.name ?? ' '} 
                variant='outlined'
                size='small' 
                label="NameOfCompany" 
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                }}
                fullWidth
              />
            </Grid>            
            <Grid item xs={3} md={3} lg={3} >
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
            </Grid>
            <Grid item xs={3} md={3} lg={3} >
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
            </Grid>

            <Grid item xs={3} md={3} lg={3} >
              <TextField 
                value={ longSnParser(compInfo?.regNum.toString() ?? '0') } 
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
            </Grid>
            <Grid item xs={3} md={3} lg={3} >
              <TextField 
                value={compInfo?.symbol ?? ' '} 
                variant='outlined'
                size='small' 
                label="SymbolOfCompany" 
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={3} md={3} lg={3} >
              <CopyLongStrTF title="AddressOfCompany" src={gk ?? AddrZero} />
            </Grid>
            <Grid item xs={3} md={3} lg={3} >
              <CopyLongStrTF title="Secretary" src={dk ?? AddrZero} />
            </Grid>

            <Grid item xs={3} md={3} lg={3} >
              <TextField 
                value={ longSnParser(controllor ?? '0') } 
                variant='outlined'
                size='small' 
                label="ActualControllor" 
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={3} md={3} lg={3} >
              <TextField 
                value={ baseToDollar(votesOfController ?? '0') } 
                variant='outlined'
                size='small' 
                label="VotesOfController" 
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                }} 
                fullWidth
              />              
            </Grid>
            <Grid item xs={3} md={3} lg={3} >
              <TextField 
                value={ baseToDollar(par ?? '0')} 
                variant='outlined'
                size='small' 
                label="RegisteredCapital" 
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                }}
                fullWidth
              />              
            </Grid>
            <Grid item xs={3} md={3} lg={3} >
              <TextField 
                value={ baseToDollar(paid ?? '0') } 
                variant='outlined'
                size='small' 
                label="PaidInCapital" 
                inputProps={{readOnly: true}}
                sx={{
                  m: 1,
                }}
                fullWidth
              />              
            </Grid>

          </Grid>

        </Paper>

        <Grid container direction='row' spacing={2} >

          <Grid item xs={12} md={12} lg={12} >
            <MembersEquityList setAcct={setAcct} setOpen={setOpen} />
            {acct > 0 && open && (
              <InvHistoryOfMember acct={ acct } open={ open } setOpen={ setOpen } />
            )}
          </Grid>

          <Grid item xs={12} md={12} lg={12} >
            {directorsList && directorsList.length > 0 && (
              <GetOfficersList list={directorsList} title="Directors List" />
            )}
          </Grid>

        </Grid>

        <Paper elevation={3} sx={{m:1, p:1, }} >

          <Stack direction='row' sx={{ alignItems:'center' }} >
    
            <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
              <b>Cash Box</b>
            </Typography>

            <PickupDeposit refresh={refresh} />

            <DepositOfMine />

          </Stack>

          <Grid container direction='row' spacing={1} sx={{width:'100%'}} >

            <Grid item xs={1.3} md={1.3} lg={1.3} >
              <TextField
                size="small"
                variant='outlined'
                label='(GUSD)'
                inputProps={{
                  readOnly: true,
                  style: {textAlign: 'right'},
                }}
                color = "primary"
                focused
                sx={{
                  m:1,
                }}
                value = {longDataParser(
                  balanceOfUSD.length > 15 ? balanceOfUSD.substring(0, balanceOfUSD.length - 15) : '0'
                )}
                fullWidth
              />
            </Grid>
            <Grid item xs={1.3} md={1.3} lg={1.3} >
              <TextField 
                size="small"
                variant='outlined'
                label='(USD)'
                inputProps={{
                  readOnly: true,
                  style: {textAlign: 'right'},
                }}
                color = "primary"
                focused
                sx={{
                  m:1,
                }}
                value={ longDataParser(
                  balanceOfUSD.length > 6 
                    ? balanceOfUSD.length > 15
                      ? balanceOfUSD.substring(balanceOfUSD.length - 15, balanceOfUSD.length - 6)
                      : balanceOfUSD.substring(0, balanceOfUSD.length - 6) 
                    : '0'
                )}
                fullWidth
              />
            </Grid>
            <Grid item xs={1.3} md={1.3} lg={1.3} >
              <TextField 
                size="small"
                variant='outlined'
                label='(Micro-USD)'
                inputProps={{
                  readOnly: true,
                  style: {textAlign: 'left'},
                }}
                color = "primary"
                focused
                sx={{
                  m:1,
                }}
                value={ longDataParser(
                  balanceOfUSD.length > 6
                    ? balanceOfUSD.substring(balanceOfUSD.length - 6)
                    : balanceOfUSD
                )}
                fullWidth
              />
            </Grid>

            <Grid item xs={1.3} md={1.3} lg={1.3} >
              <TextField 
                size="small"
                variant='outlined'
                label='(ETH)'
                inputProps={{
                  readOnly: true,
                  style: { textAlign: "right" },
                }}
                color = "success"
                sx={{
                  m:1,
                }}
                value={ getEthPart(cap) }
                fullWidth
              />
            </Grid>
            <Grid item xs={1.3} md={1.3} lg={1.3} >
              <TextField 
                size="small"
                variant='outlined'
                label='(GWei)'
                inputProps={{
                  readOnly: true,
                  style: { textAlign: "left" },
                }}
                color = "success"
                sx={{
                  m:1,
                }}
                value={ getGWeiPart(cap) }
                fullWidth
              />
            </Grid>
            <Grid item xs={1.3} md={1.3} lg={1.3} >
              <TextField 
                size="small"
                variant='outlined'
                label='(Wei)'
                inputProps={{
                  readOnly: true,
                  style: { textAlign: "left" },
                }}
                color = "success"
                sx={{
                  m:1,
                }}
                value={ getWeiPart(cap) }
                fullWidth
              />
            </Grid>

            <Grid item xs={1.3} md={1.3} lg={1.3} >
              <TextField 
                size="small"
                variant='outlined'
                label='(CBP)'
                inputProps={{
                  readOnly: true,
                  style: {textAlign: 'right'},
                }}
                color = "primary"
                focused
                sx={{
                  m:1,
                }}
                value={ getEthPart(balanceOfCBP) }
                fullWidth
              />
            </Grid>
            <Grid item xs={1.3} md={1.3} lg={1.3} >
              <TextField 
                size="small"
                variant='outlined'
                label='(GLee)'
                inputProps={{
                  readOnly: true,
                  style: {textAlign: 'right'},
                }}
                color = "primary"
                focused
                sx={{
                  m:1,
                }}
                value={ getGWeiPart(balanceOfCBP) }
                fullWidth
              />
            </Grid>
            <Grid item xs={1.3} md={1.3} lg={1.3} >
              <TextField 
                size="small"
                variant='outlined'
                label='(Lee)'
                inputProps={{
                  readOnly: true,
                  style: {textAlign: 'left'},
                }}
                color = "primary"
                focused
                sx={{
                  m:1,
                }}
                value={ getWeiPart(balanceOfCBP)}
                fullWidth
              />
            </Grid>

          </Grid>
      
          <Divider orientation="horizontal" flexItem sx={{ m:1 }} />

          <Grid container direction='row' spacing={1} sx={{width:'100%'}} >

            <Grid item xs={1.3} md={1.3} lg={1.3} >
              <TextField 
                size="small"
                variant='outlined'
                label='Escrow (GUSD)'
                inputProps={{
                  readOnly: true,
                  style: {textAlign: 'right'},
                }}
                color = "primary"
                focused
                sx={{
                  m:1,
                }}
                value = {longDataParser(
                  custodyUSD.length > 15 ? custodyUSD.substring(0, custodyUSD.length - 15) : '0'
                )}
                fullWidth
              />
            </Grid>
            <Grid item xs={1.3} md={1.3} lg={1.3} >
              <TextField 
                size="small"
                variant='outlined'
                label='Escrow (USD)'
                inputProps={{
                  readOnly: true,
                  style: {textAlign: 'right'},
                }}
                color = "primary"
                focused
                sx={{
                  m:1,
                }}
                value={ longDataParser(
                  custodyUSD.length > 6 
                    ? custodyUSD.length > 15
                      ? custodyUSD.substring(custodyUSD.length - 15, custodyUSD.length - 6)
                      : custodyUSD.substring(0, custodyUSD.length - 6) 
                    : '0'
                )}
                fullWidth
              />
            </Grid>
            <Grid item xs={1.3} md={1.3} lg={1.3} >
              <TextField 
                size="small"
                variant='outlined'
                label='Escrow (Micro-USD)'
                inputProps={{
                  readOnly: true,
                  style: {textAlign: 'left'},
                }}
                color = "primary"
                focused
                sx={{
                  m:1,
                }}
                value={ longDataParser(
                  custodyUSD.length > 6
                    ? custodyUSD.substring(custodyUSD.length - 6)
                    : custodyUSD
                )}
                fullWidth
              />
            </Grid>

            <Grid item xs={1.3} md={1.3} lg={1.3} >
              <TextField 
                size="small"
                variant='outlined'
                label='Escrow (ETH)'
                inputProps={{
                  readOnly: true,
                  style: { textAlign: "right" },
                }}
                color = "success"
                sx={{
                  m:1,
                }}
                value={ getEthPart(depositsOfETH.toString()) }
                fullWidth
              />
            </Grid>
            <Grid item xs={1.3} md={1.3} lg={1.3} >
              <TextField 
                size="small"
                variant='outlined'
                label='Escrow (GWei)'
                inputProps={{
                  readOnly: true,
                  style: { textAlign: "left" },
                }}
                color = "success"
                sx={{
                  m:1,
                }}
                value={ getGWeiPart(depositsOfETH.toString()) }
                fullWidth
              />
            </Grid>
            <Grid item xs={1.3} md={1.3} lg={1.3} >
              <TextField 
                size="small"
                variant='outlined'
                label='Escrow (Wei)'
                inputProps={{
                  readOnly: true,
                  style: { textAlign: "left" },
                }}
                color = "success"
                sx={{
                  m:1,
                }}
                value={ getWeiPart(depositsOfETH.toString()) }
                fullWidth
              />     
            </Grid>

          </Grid>

        </Paper>

        {compInfo?.regNum == 8 && (
          <FinStatement />
        )}

      </Paper>
    </>
  );
} 