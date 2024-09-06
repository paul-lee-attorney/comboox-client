
import { Paper, Stack, Grid, Typography, Divider, Button } from "@mui/material";

import { Expense } from "./FinStatement/Expense";
import { useComBooxContext } from "../../../_providers/ComBooxContextProvider";
import { useEffect, useState } from "react";
import { getOwner, rate } from "../../fuel_tank/ft";
import { bigIntToStrNum } from "../../common/toolsKit";
import { PaidInCap } from "./FinStatement/PaidInCap";
import { Distribution } from "./FinStatement/Distribution";
import { CbpIncome, defaultSum, IncomeSumProps } from "./FinStatement/CbpIncome";

export function FinStatement() {

  const { gk } = useComBooxContext();

  const [ cbpIncome, setCbpIncome ] = useState<IncomeSumProps>(defaultSum);
  const [ ethIncome, setEthIncome ] = useState<IncomeSumProps>(defaultSum);
  const [ gmmExp, setGmmExp ] = useState<IncomeSumProps>(defaultSum);
  const [ bmmExp, setBmmExp ] = useState<IncomeSumProps>(defaultSum);
  const [ rateOfCbp, setRateOfCbp ] = useState(0n);

  useEffect(()=>{
    const getRate = async ()=> {
      let rateOfEx = await rate(undefined);
      setRateOfCbp(rateOfEx);
    }
    getRate();
  });

  let profit = rateOfCbp > 0 
    ? (cbpIncome.royalty * 10000n / rateOfCbp - (gmmExp.totalAmt - gmmExp.mint + bmmExp.totalAmt - gmmExp.mint)) 
    : 0n;

  let deferredIncome = rateOfCbp > 0 
    ? ethIncome.gas - cbpIncome.royalty * 10000n / rateOfCbp 
    : 0n;
  
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

            <CbpIncome exRate={rateOfCbp} sum={cbpIncome} setSum={setCbpIncome} />

            <Stack direction='row' width='100%' >
              <Typography variant="h6" textAlign='center' width='20%'>
                -
              </Typography>
              {rateOfCbp>0 && (
                <Expense title="GMM" exRate={rateOfCbp} sum={gmmExp} setSum={setGmmExp} />
              )}
            </Stack>

            <Stack direction='row' width='100%' >
              <Typography variant="h6" textAlign='center' width='20%'>
                -
              </Typography>
              {rateOfCbp>0 && (
                <Expense title="BMM" exRate={rateOfCbp} sum={bmmExp} setSum={setBmmExp} />
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

              <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} >
                <b>CBP Sales Income: ({bigIntToStrNum(ethIncome.gas, 18) + ' ETH'}) </b>
              </Button>

              <Stack direction='row' width='100%' >
                <Typography variant="h6" textAlign='center' width='20%'>
                  -
                </Typography>

                <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} >
                  <b>Revenue: ( { rateOfCbp > 0n ? bigIntToStrNum(cbpIncome.royalty * 10000n/rateOfCbp , 18) : '0' + ' ETH'}) </b>
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