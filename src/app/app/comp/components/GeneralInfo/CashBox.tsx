import { useEffect, useState } from "react";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { balanceOf, balanceOfWei } from "../../../rc";
import { totalDeposits } from "../../gk";
import { balanceOfComp, totalCustody } from "../../cashier";
import { booxMap } from "../../../common";
import { Divider, Grid, Paper, Stack, TextField, Typography } from "@mui/material";

import { getEthPart, getGWeiPart, getWeiPart, longDataParser } from "../../../common/toolsKit";
import { PickupDeposit } from "./CashBox/PickupDeposit";
import { DepositOfMine } from "./CashBox/DepositOfMine";

export function CashBox() {

  const { gk, boox } = useComBooxContext();

  const [ time, setTime ] = useState<number>(0);

  const refresh = () => {
    setTime(Date.now());
  }

  const [ balanceOfCBP, setBalanceOfCBP ] = useState<string>('0');
  const [ balanceOfETH, setBalanceOfETH ] = useState(0n);
  const [ balanceOfUSD, setBalanceOfUSD ] = useState('0');

  const [ depositsOfETH, setDepositsOfETH ] = useState(0n);
  const [ custodyUSD, setCustodyUSD ] = useState(0n);
  const [ lockedUSD, setLockedUSD ] = useState(0n);

  let depositOfUSD = (custodyUSD + lockedUSD).toString();

  useEffect(()=>{
    if (gk) {

      balanceOfWei(gk).then(
        res => setBalanceOfETH(res)
      );

      balanceOf(gk, undefined).then(
        res => setBalanceOfCBP(res.toString())        
      );
      
      totalDeposits(gk, undefined).then(
        res => setDepositsOfETH(res)
      );
    }

    if (boox) {

      balanceOfComp(boox[booxMap.Cashier]).then(
        res => setBalanceOfUSD(res.toString())
      );

      totalCustody(boox[booxMap.Cashier]).then(
        res => setCustodyUSD(res)
      );

    }
  }, [ gk, time, boox ]);

  let cap = (balanceOfETH - depositsOfETH).toString();

  return(

    <Paper elevation={3} sx={{m:2, p:1, border:1, borderColor:'divider', width:'fit-content' }} >

      <Stack direction='row' sx={{ alignItems:'center' }} >

        <Typography variant='h5' sx={{ m:2, textDecoration:'underline' }}  >
          <b>Cash Box</b>
        </Typography>

        <PickupDeposit refresh={refresh} />

        <DepositOfMine />

      </Stack>

      <Grid container direction='row' spacing={0} sx={{width:1600}} >

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
            focused
            sx={{
              m:1,
            }}
            value={ getEthPart(cap) }
          />
        </Grid>
        <Grid item xs={1.3} md={1.3} lg={1.3} >
          <TextField 
            size="small"
            variant='outlined'
            label='(GWei)'
            inputProps={{
              readOnly: true,
              style: { textAlign: "right" },
            }}
            color = "success"
            focused
            sx={{
              m:1,
            }}
            value={ getGWeiPart(cap) }
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
            focused
            sx={{
              m:1,
            }}
            value={ getWeiPart(cap) }
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
          />
        </Grid>

      </Grid>
      
      <Divider orientation="horizontal" flexItem sx={{ m:1 }} />

      <Grid container direction='row' spacing={0} sx={{width:1600}} >

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
              depositOfUSD.length > 15 ? depositOfUSD.substring(0, depositOfUSD.length - 15) : '0'
            )}
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
              depositOfUSD.length > 6 
                ? depositOfUSD.length > 15
                  ? depositOfUSD.substring(depositOfUSD.length - 15, depositOfUSD.length - 6)
                  : depositOfUSD.substring(0, depositOfUSD.length - 6) 
                : '0'
            )}
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
              depositOfUSD.length > 6
                ? depositOfUSD.substring(depositOfUSD.length - 6)
                : depositOfUSD
            )}
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
            focused
            sx={{
              m:1,
            }}
            value={ getEthPart(depositsOfETH.toString()) }
          />
        </Grid>
        <Grid item xs={1.3} md={1.3} lg={1.3} >
          <TextField 
            size="small"
            variant='outlined'
            label='Escrow (GWei)'
            inputProps={{
              readOnly: true,
              style: { textAlign: "right" },
            }}
            color = "success"
            focused
            sx={{
              m:1,
            }}
            value={ getGWeiPart(depositsOfETH.toString()) }
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
            focused
            sx={{
              m:1,
            }}
            value={ getWeiPart(depositsOfETH.toString()) }
          />              
        </Grid>

      </Grid>

    </Paper>

  );
}