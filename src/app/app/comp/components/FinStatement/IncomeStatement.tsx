import { Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { showUSD, weiToEth9Dec } from "../FinStatement";
import { baseToDollar } from "../../../common/toolsKit";
import { CbpInflowSum } from "./Cashflow/CbpInflow";
import { CbpOutflowSum } from "./Cashflow/CbpOutflow";
import { AssetsProps } from "./Assets";

export interface IncomeStatementProps extends AssetsProps {
  exRate: bigint,
  cbpInflow: CbpInflowSum[],
  cbpOutflow: CbpOutflowSum[],
}

export function IncomeStatement({inETH, exRate, centPrice, startDate, endDate, display, ethInflow, ethOutflow, cbpInflow, cbpOutflow}: IncomeStatementProps) {

  const cbpToETH = (cbp:bigint) => {
    return cbp * 10000n / exRate;
  }

  const weiToBP = (eth:bigint) => {
    return eth * 100n / centPrice;
  }

  const weiToDust = (eth:bigint) => {
    return eth * 10n ** 16n / centPrice;
  }

  const weiToUSD = (eth:bigint) => {
    return baseToDollar(weiToBP(eth).toString()) + ' USD';
  }

  // ---- IPR ----

  const setUpDate = Math.floor((new Date('2024-05-18T00:00:00Z')).getTime()/1000);
  const fullLifeHrs = 15n * 365n * 86400n;

  let initContribution = endDate >= setUpDate
      ? 3n * 10n ** 7n * centPrice
      : 0n;

  let daysOfPeriod = startDate >= setUpDate
      ? BigInt(endDate - startDate)
      : endDate >= setUpDate ? BigInt(endDate - setUpDate) : 0n;

  let armotization = initContribution * daysOfPeriod / fullLifeHrs;

  // ---- ETH ----

  let ethOfComp = ethInflow[2].totalAmt - ethOutflow[2].totalAmt;
  let ethOfCompInUsd = ethInflow[2].sumInUsd - ethOutflow[2].sumInUsd;

  let ethGainLoss = weiToDust(ethOfComp) - ethOfCompInUsd;

  // ---- CBP ----

  let deferredRevenue = cbpToETH(cbpOutflow[2].totalAmt - cbpInflow[2].totalAmt + cbpInflow[2].mint);
  let deferredRevenueInUsd = cbpOutflow[2].sumInUsd - cbpInflow[2].sumInUsd + cbpInflow[2].mintInUsd;

  let cbpGainLoss = weiToDust(deferredRevenue) - deferredRevenueInUsd;

  let exchangeGainLoss = ethGainLoss - cbpGainLoss;

  // ---- SG&A ----

  let ethExp = ethOutflow[2].totalAmt - ethOutflow[2].distribution;
  let ethExpInUsd = ethOutflow[2].sumInUsd - ethOutflow[2].distributionInUsd;

  let cbpExp = cbpToETH(cbpOutflow[2].totalAmt - cbpOutflow[2].fuelSold);
  let cbpExpInUsd = cbpOutflow[2].sumInUsd - cbpOutflow[2].fuelSoldInUsd;

  let sgNa = ethExp + cbpExp;
  let sgNaInUsd = ethExpInUsd + cbpExpInUsd;

  // ---- Profits ----

  let ebitda = cbpToETH(cbpInflow[2].royalty) + ethInflow[2].transfer - sgNa;
  let ebitdaInUsd = cbpInflow[2].royaltyInUsd + ethInflow[2].transferInUsd - sgNaInUsd + exchangeGainLoss;

  let profits = ebitda - armotization;
  let profitsInUsd = ebitdaInUsd - weiToDust(armotization);


  // onClick={()=>showRoyaltyRecords()} 
  // onClick={()=>showOtherIncomeRecords()}
  // onClick={()=>displaySGNA()}

  return(

    <Paper elevation={3} 
      sx={{
        m:1, p:1, border:1, 
        borderColor:'divider',
        width: '100%' 
      }} 
    >

      <Stack direction='row' sx={{ alignItems:'center' }} >
        <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
          <b>Income Statement</b>
        </Typography>
      </Stack>

      <Stack direction='row' width='100%' >
        <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} onClick={()=>display[0](2)} >
          <b>Royalty Income: ({ inETH
            ? weiToEth9Dec(cbpToETH(cbpInflow[2].royalty))
            : showUSD(cbpInflow[2].royaltyInUsd)}) </b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
        <Typography variant="h6" textAlign='center' width='10%'>
          +
        </Typography>
        <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} onClick={()=>display[1](2)} >
          <b>Other Income: ({ inETH
            ? weiToEth9Dec(ethInflow[2].transfer)
            : showUSD(ethInflow[2].transferInUsd)}) </b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' sx={{alignItems:'center'}}>
        <Typography variant="h6" textAlign='center' width='10%'>
          -
        </Typography>
        <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} onClick={()=>display[2](2)}>
          <b>Sales, General & Administrative: ({ inETH
            ? weiToEth9Dec(sgNa)
            : showUSD(sgNaInUsd)}) </b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
        <Typography variant="h6" textAlign='center' width='10%'>
          +
        </Typography>
        <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} >
          <b>Crypto Exchange Gain/Loss: ({ inETH
            ? 0
            : showUSD(exchangeGainLoss) }) </b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' >
        <Typography variant="h6" textAlign='center' width='20%'>
          &nbsp;
        </Typography>
        <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
          <b>EBITDA: ({ inETH
            ? weiToEth9Dec(ebitda)
            : showUSD(ebitdaInUsd)}) </b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
        <Typography variant="h6" textAlign='center' width='20%'>
          &nbsp;
        </Typography>
        <Typography variant="h6" textAlign='center' width='10%'>
          -
        </Typography>
        <Button variant="outlined" sx={{width: '70%', m:0.5, justifyContent:'start'}} >
          <b>Amortization: ({ inETH
          ? weiToEth9Dec(armotization)
          : weiToUSD(armotization)}) </b>
        </Button>
      </Stack>

      <Divider orientation="horizontal"  sx={{ my:2, color:'blue' }} flexItem  />

      <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
        <Typography variant="h6" textAlign='center' width='40%'>
          &nbsp;
        </Typography>
        <Button variant="outlined" sx={{width: '60%', m:0.5, justifyContent:'start'}} >
          <b>Profits: ({ inETH
            ? weiToEth9Dec(profits)
            : showUSD(profitsInUsd) }) </b>
        </Button>
      </Stack>

    </Paper>
  );   
}