
import { Paper, Stack, Grid, Typography, Divider, Button } from "@mui/material";

import { Revenue } from "./FinStatement/Revenue";
import { Expense } from "./FinStatement/Expense";
import { useComBooxContext } from "../../../_providers/ComBooxContextProvider";
import { keepersMap } from "../../common";
import { useEffect, useState } from "react";
import { getOwner, rate } from "../../fuel_tank/ft";
import { bigIntToStrNum } from "../../common/toolsKit";
import { PaidInCap } from "./FinStatement/PaidInCap";
import { Distribution } from "./FinStatement/Distribution";
import { FuelIncome } from "./FinStatement/FuelIncome";
import { FuelCost } from "./FinStatement/FuelCost";
import { balanceOf } from "../../rc";

export function FinStatement() {

  const { gk, keepers } = useComBooxContext();

  const [ revenue, setRevenue ] = useState(0n);
  const [ gmmExp, setGmmExp ] = useState(0n);
  const [ bmmExp, setBmmExp ] = useState(0n);
  const [ rateOfCbp, setRateOfCbp ] = useState(0n);

  useEffect(()=>{
    const getRate = async ()=> {
      let rateOfEx = await rate(undefined);
      setRateOfCbp(rateOfEx);
    }
    getRate();
  });

  let profit = rateOfCbp > 0 
    ? (revenue * 10000n / rateOfCbp - (gmmExp + bmmExp)) 
    : 0n;

  const [ fuelIncome, setFuelIncome ] = useState(0n);
  const [ fuelCost, setFuelCost ] = useState(0n);
  const [ cbpBalance, setCbpBalance ] = useState(0n);

  useEffect(()=>{
    const getBalance = async ()=>{
      if (gk && rateOfCbp > 0) {
        let balance = await balanceOf(gk, undefined);
        setCbpBalance( balance * 10000n / rateOfCbp);
      }
    }
    getBalance();
  },[gk, setCbpBalance, rateOfCbp]);

  let deferredIncome = fuelIncome - fuelCost - cbpBalance;
  
  const [ paidInCap, setPaidInCap ] = useState(0n);
  const [ distribution, setDistribution ] = useState(0n);
  
  let equity = paidInCap + profit + deferredIncome - distribution;

  const [ isOwner, setIsOwner ] = useState(false);

  useEffect(()=>{
    getOwner().then(
      owner => {
        if (owner == gk && gk) {
          setIsOwner(true);
        }
      }
    )
  })

  return (
    <Stack direction='row' >
      <Paper elevation={3} 
        sx={{
          alignContent:'center', 
          justifyContent:'center', 
          m:1, p:1, border:1, 
          borderColor:'divider',
          width: isOwner ? '33%' : '50%' 
        }} 
      >

          <Stack direction='row' sx={{ alignItems:'center' }} >
            <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
              <b>Income Statement</b>
            </Typography>
          </Stack>

          <Stack direction='column' sx={{ alignItems:'end' }} >

            <Revenue sum={revenue} setSum={setRevenue} />

            <Stack direction='row' width='100%' >
              <Typography variant="h6" textAlign='center' width='20%'>
                -
              </Typography>
              {keepers && (
                <Expense title="GMM" addr={keepers[keepersMap.GMMKeeper]} sum={gmmExp} setSum={setGmmExp} />
              )}
            </Stack>

            <Stack direction='row' width='100%' >
              <Typography variant="h6" textAlign='center' width='20%'>
                -
              </Typography>
              {keepers && (
                <Expense title="BMM" addr={keepers[keepersMap.BMMKeeper]} sum={bmmExp} setSum={setBmmExp} />
              )}
            </Stack>

            <Divider orientation="horizontal"  sx={{ my:2, color:'blue' }} flexItem  />

            <Button variant="outlined" sx={{width: '70%', m:0.5, justifyContent:'start'}} >
              <b>EBITDA: ({bigIntToStrNum(profit, 18) + ' ETH'}) </b>
            </Button>

          </Stack>

      </Paper>

      {isOwner && (
        <Paper elevation={3} 
          sx={{
            alignContent:'center', 
            justifyContent:'center', 
            m:1, p:1, border:1, 
            borderColor:'divider',
            width:'33%' 
          }} 
        >

            <Stack direction='row' sx={{ alignItems:'center' }} >
              <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
                <b>CBP Exchange Statement</b>
              </Typography>
            </Stack>

            <Stack direction='column' sx={{ alignItems:'end' }} >

              <FuelIncome sum={fuelIncome} setSum={setFuelIncome} />

              <Stack direction='row' width='100%' >
                <Typography variant="h6" textAlign='center' width='20%'>
                  -
                </Typography>
                  <FuelCost sum={fuelCost} setSum={setFuelCost} />
              </Stack>

              <Stack direction='row' width='100%' >
                <Typography variant="h6" textAlign='center' width='20%'>
                  -
                </Typography>

                <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} >
                <b>CBP Value: ({bigIntToStrNum(cbpBalance, 18) + ' ETH'}) </b>
              </Button>
                  
              </Stack>


              <Divider orientation="horizontal"  sx={{ my:2 }} flexItem  />

              <Button variant="outlined" sx={{width: '70%', m:0.5, justifyContent:'start'}} >
                <b>Deferred Income: ({bigIntToStrNum(deferredIncome, 18) + ' ETH'}) </b>
              </Button>

            </Stack>

        </Paper>
      )}

      <Paper elevation={3} 
        sx={{
          alignContent:'center', 
          justifyContent:'center', 
          m:1, p:1, border:1, 
          borderColor:'divider',
          width: isOwner ? '33%' : '50%'
        }} 
      >

        <Stack direction='row' sx={{ alignItems:'center' }} >

          <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
            <b>Equity Change Statement</b>
          </Typography>

        </Stack>

        <Stack direction='column' sx={{ alignItems:'end' }}> 
        
          <PaidInCap sum={paidInCap} setSum={setPaidInCap} />

          {isOwner && (
            <Stack direction='row' width='100%' >
              <Typography variant="h6" textAlign='center' width='20%'>
                +
              </Typography>
              <Button variant="outlined" fullWidth sx={{m:0.5, justifyContent:'start'}} >
                <b>Deferred Income: ({bigIntToStrNum(deferredIncome, 18) + ' ETH'}) </b>
              </Button>
            </Stack>
          )}

          <Stack direction='row' width='100%' >
              <Typography variant="h6" textAlign='center' width='20%'>
                +
              </Typography>
              <Button variant="outlined" fullWidth sx={{ m:0.5, justifyContent:'start'}} >
                <b>EBITDA: ({bigIntToStrNum(profit, 18) + ' ETH'}) </b>
              </Button>
          </Stack>

          <Stack direction='row' width='100%' >
              <Typography variant="h6" textAlign='center' width='20%'>
                -
              </Typography>
              <Distribution sum={distribution} setSum={setDistribution} />
          </Stack>

          <Divider orientation="horizontal"  sx={{ my:2 }} flexItem  />

          <Button variant="outlined" sx={{width: '70%', m:0.5, justifyContent:'start'}} >
              <b>Owners&lsquo; Equity: ({bigIntToStrNum(equity, 18) + ' ETH'}) </b>
          </Button>

        </Stack>

      </Paper>

    </Stack>
  );
} 