import { Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { showUSD, weiToEth9Dec } from "../FinStatement";
import { baseToDollar } from "../../../common/toolsKit";
import { getProfits, IncomeStatementProps } from "./IncomeStatement";
import { getInitContribution } from "./Assets";
import { CbpOutflowSum } from "./Cashflow/CbpOutflow";
import { CbpInflowSum } from "./Cashflow/CbpInflow";
import { EthOutflowSum } from "./Cashflow/EthOutflow";
import { EthInflowSum } from "./Cashflow/EthInflow";


export const getDeferredRevenue = (type:number, cbpInflow:CbpInflowSum[], cbpOutflow:CbpOutflowSum[], cbpToETH:(cbp:bigint)=>bigint) => {
  const inEth = cbpToETH(cbpOutflow[type].totalAmt - cbpInflow[type].totalAmt + cbpInflow[type].mint);
  const inUsd = cbpOutflow[type].sumInUsd - cbpInflow[type].sumInUsd + cbpInflow[type].mintInUsd;

  return ({inEth:inEth, inUsd:inUsd});
}

export const getRetainedEarnings = (type:number, startDate:number, endDate:number, centPrice:bigint, cbpInflow:CbpInflowSum[], cbpOutflow:CbpOutflowSum[], ethInflow:EthInflowSum[], ethOutflow:EthOutflowSum[], cbpToETH:(cbp:bigint)=>bigint, weiToDust:(eth:bigint)=>bigint) => {

  const profits = getProfits(type, startDate, endDate, centPrice, cbpInflow, cbpOutflow, ethInflow, ethOutflow, cbpToETH, weiToDust);

  const inEth = profits.inEth - ethOutflow[type].distribution;
  const inUsd = profits.inUsd - ethOutflow[type].distributionInUsd;

  return ({inEth:inEth, inUsd:inUsd});
}

export const getOwnersEquity = (type:number, startDate:number, endDate:number, centPrice:bigint, cbpInflow:CbpInflowSum[], cbpOutflow:CbpOutflowSum[], ethInflow:EthInflowSum[], ethOutflow:EthOutflowSum[], cbpToETH:(cbp:bigint)=>bigint, weiToDust:(eth:bigint)=>bigint ) => {

  const initContribution = getInitContribution(type, startDate, endDate, centPrice);

  const retainedEarnings = getRetainedEarnings(type, startDate, endDate, centPrice, cbpInflow, cbpOutflow, ethInflow, ethOutflow, cbpToETH, weiToDust);

  const inEth = initContribution + ethInflow[type].capital + retainedEarnings.inEth;

  const inUsd = weiToDust(initContribution) + ethInflow[type].capitalInUsd + retainedEarnings.inUsd;

  return ({inEth:inEth, inUsd:inUsd});
}

export function LiabilyAndEquity({inETH, centPrice, exRate, startDate, endDate, display, cbpInflow, cbpOutflow, ethInflow, ethOutflow}: IncomeStatementProps) {

  const weiToBP = (eth:bigint) => {
    return eth * 100n / centPrice;
  }

  const cbpToETH = (cbp:bigint) => {
    return cbp * 10000n / exRate;
  }

  const weiToDust = (eth:bigint) => {
    return eth * 10n ** 16n / centPrice;
  }

  const weiToUSD = (eth:bigint) => {
    return baseToDollar(weiToBP(eth).toString()) + ' USD';
  }

  // ==== Liabilities ====

  const deferredRevenue = getDeferredRevenue(3, cbpInflow, cbpOutflow, cbpToETH);

  const cbpGainLoss = weiToDust(deferredRevenue.inEth) - deferredRevenue.inUsd;
  
  // ==== Profits & Loss ====

  const initContribution = getInitContribution(3, startDate, endDate, centPrice);

  const retainedEarnings = getRetainedEarnings(3, startDate, endDate, centPrice, cbpInflow, cbpOutflow, ethInflow, ethOutflow, cbpToETH, weiToDust);

  // ==== Owners Equity ====

  const ownersEquity = getOwnersEquity(3, startDate, endDate, centPrice, cbpInflow, cbpOutflow, ethInflow, ethOutflow, cbpToETH, weiToDust);

  return(
    <Paper elevation={3} 
      sx={{
        m:1, p:1, border:1, 
        borderColor:'divider',
        width: '50%' 
      }} 
    >

      <Stack direction='row' sx={{ alignItems:'center' }} >
        <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
          <b>Balance Sheet (Liabilities & Owners Equity)</b>
        </Typography>
      </Stack>

      <Stack direction='row' width='100%' >
        <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} onClick={()=>display[0](3)}  >
          <b>Deferred Revenue: ({ inETH
            ? weiToEth9Dec(deferredRevenue.inEth)
            : showUSD(deferredRevenue.inUsd)}) </b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
        <Typography variant="h6" textAlign='center' width='10%'>
          +
        </Typography>
        <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} >
          <b>Appreciation of CBP: ({ inETH
            ? '0'
            : showUSD(cbpGainLoss)}) </b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' >
        <Typography variant="h6" textAlign='center' width='20%'>
          &nbsp;
        </Typography>
        <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
          <b>Total Liabilities: ({ inETH
            ? weiToEth9Dec(deferredRevenue.inEth)
            : showUSD(weiToDust(deferredRevenue.inEth))}) </b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' >
        <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} >
          <b>Initial Capital: ({ inETH
            ? weiToEth9Dec(initContribution)
            : showUSD(weiToDust(initContribution))}) </b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
        <Typography variant="h6" textAlign='center' width='10%'>
          +
        </Typography>
        <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} onClick={()=>display[1](3)} >
          <b>Additional Paid In Capital: ({ inETH
            ? weiToEth9Dec(ethInflow[3].capital)
            : showUSD(ethInflow[3].capitalInUsd)}) </b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
        <Typography variant="h6" textAlign='center' width='10%'>
          +
        </Typography>
        <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} >
          <b>Retained Earnings: ({ inETH
            ? weiToEth9Dec(retainedEarnings.inEth)
            : showUSD(retainedEarnings.inUsd)}) </b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' >
        <Typography variant="h6" textAlign='center' width='20%'>
          &nbsp;
        </Typography>
        <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
          <b>Total Equity: ({ inETH
            ? weiToEth9Dec(ownersEquity.inEth)
            : showUSD(ownersEquity.inUsd)}) </b>
        </Button>
      </Stack>

      <Divider orientation="horizontal"  sx={{ my:2, color:'blue' }} flexItem  />

      <Stack direction='row' width='100%' >
        <Typography variant="h6" textAlign='center' width='20%'>
          &nbsp;
        </Typography>
        <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
          <b>Total Liabilities & Owners Equity: ({ inETH
            ? weiToEth9Dec(deferredRevenue.inEth + ownersEquity.inEth)
            : showUSD(weiToDust(deferredRevenue.inEth) + ownersEquity.inUsd)}) </b>
        </Button>
      </Stack>

    </Paper>
  );   
}