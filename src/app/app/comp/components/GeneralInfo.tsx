import { useEffect, useState } from "react";

import { Paper, Toolbar, TextField, Stack, Grid, Typography } from "@mui/material";

import { useComBooxContext } from "../../../_providers/ComBooxContextProvider";

import { AddrZero, booxMap, currencies } from "../../common";
import { baseToDollar, dateParser, getEthPart, getGEthPart, 
  getGWeiPart, getWeiPart, longSnParser 
} from "../../common/toolsKit";
import { CopyLongStrTF } from "../../common/CopyLongStr";

import { CompInfo, getCompInfo, totalDeposits } from "../gk";
import { getDK } from "../common/accessControl";

import { balanceOf, balanceOfWei } from "../../rc";

import { Position, getDirectorsFullPosInfo } from "../rod/rod";
import { GetOfficersList } from "../rod/components/GetOfficersList";
import { MembersEquityList } from "../rom/components/MembersList";
import { getControllor, getOwnersEquity, votesOfGroup } from "../rom/rom";
import { InvHistoryOfMember } from "../rom/components/InvHistoryOfMember";

import { ConfigSetting } from "./config_setting/ConfigSetting";
import { PickupDeposit } from "./PickupDeposit";
import { DepositOfMine } from "./DepositOfMine";

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
  }, [gk, time])

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

        <Paper elevation={3} sx={{m:1, p:1 }} >
          <Stack direction='row' sx={{ alignItems:'center' }} >

            <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
              <b>General Info</b>
            </Typography>

            {compInfo && (
              <ConfigSetting companyName={ compInfo.name } symbol={  compInfo.symbol } time={ time } setTime={ setTime } />
            )}

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
                value={ longSnParser(controllor ?? AddrZero) } 
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

        <Paper elevation={3} sx={{m:1, p:1, }} >

          <Stack direction='row' sx={{ alignItems:'center' }} >
    
            <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
              <b>Cash Box</b>
            </Typography>

            <PickupDeposit refresh={refresh} />

            <DepositOfMine />

          </Stack>

          <Grid container direction='row' spacing={2} >

            <Grid item xs={3} md={3} lg={3} >
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
            </Grid>
            <Grid item xs={3} md={3} lg={3} >
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
            </Grid>
            <Grid item xs={3} md={3} lg={3} >
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
            </Grid>
            <Grid item xs={3} md={3} lg={3} >
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
            </Grid>

            <Grid item xs={3} md={3} lg={3} >
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
            </Grid>
            <Grid item xs={3} md={3} lg={3} >
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
            </Grid>
            <Grid item xs={3} md={3} lg={3} >
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
            </Grid>
            <Grid item xs={3} md={3} lg={3} >
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
            </Grid>

            <Grid item xs={3} md={3} lg={3} >
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
            </Grid>
            <Grid item xs={3} md={3} lg={3} >
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
            </Grid>
            <Grid item xs={3} md={3} lg={3} >
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
            </Grid>
            <Grid item xs={3} md={3} lg={3} >
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

      </Paper>
    </>
  );
} 