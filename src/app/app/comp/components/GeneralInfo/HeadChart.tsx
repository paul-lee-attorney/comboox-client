import { useEffect, useState } from "react";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { CompInfo, getCompInfo } from "../../gk";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { getDK } from "../../common/draftControl";
import { getControllor, getOwnersEquity, votesOfGroup } from "../../rom/rom";
import { AddrZero, booxMap, currencies } from "../../../common";
import { Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import { ConfigSetting } from "../config_setting/ConfigSetting";
import { HistoryOfBoox } from "./HistoryOfBoox";
import { baseToDollar, dateParser, longSnParser } from "../../../common/toolsKit";
import { CopyLongStrTF } from "../../../common/CopyLongStr";


export function HeadChart() {

  const { gk, boox } = useComBooxContext();

  const [ compInfo, setCompInfo ] = useState<CompInfo>();
  const [ dk, setDK ] = useState<string>('');

  const client = usePublicClient();

  const [ time, setTime ] = useState<number>(0);

  useEffect(()=>{
    if (gk) {
      getCompInfo(gk).then(
        res => {
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
    }
  }, [boox]); 

  return(
    <Paper elevation={3} sx={{m:2, p:2, width:'fit-content' }} >
      <Stack direction='row' sx={{ alignItems:'center' }} >

        <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
          <b>General Info</b>
        </Typography>

        {compInfo && (
          <ConfigSetting companyName={ compInfo.name } symbol={  compInfo.symbol } time={ time } setTime={ setTime } />
        )}

        <HistoryOfBoox />

      </Stack>

      <Grid container direction='row' spacing={2} sx={{width:1600}} >

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
              with:218
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
  );
}

