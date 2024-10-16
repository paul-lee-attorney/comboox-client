import { Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { showUSD, weiToEth9Dec } from "../FinStatement";
import { baseToDollar } from "../../../common/toolsKit";
import { IncomeStatementProps } from "./IncomeStatement";
import { getArmontization, getInitContribution } from "./Assets";


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

  const deferredRevenue = () => {
    const inEth = cbpToETH(cbpOutflow[3].totalAmt - cbpInflow[3].totalAmt + cbpInflow[3].mint);
    const inUsd = cbpOutflow[3].sumInUsd - cbpInflow[3].sumInUsd + cbpInflow[3].mintInUsd;

    return ({inEth:inEth, inUsd:inUsd});
  }

  const cbpGainLoss = weiToDust(deferredRevenue().inEth) - deferredRevenue().inUsd;
  
  // ==== Profits & Loss ====

  const initContribution = getInitContribution(endDate, centPrice);
  const armotization = () => {
    return getArmontization(startDate, endDate, centPrice);
  } 

  const retainedEarnings = () => {
    const ethExp = ethOutflow[3].totalAmt - ethOutflow[3].distribution;
    const ethExpInUsd = ethOutflow[3].sumInUsd - ethOutflow[3].distributionInUsd;
    const cbpExp = cbpToETH(cbpOutflow[3].totalAmt - cbpOutflow[3].fuelSold);
    const cbpExpInUsd = cbpOutflow[3].sumInUsd - cbpOutflow[3].fuelSoldInUsd;
  
    const ethGainLoss = weiToDust(ethInflow[3].totalAmt - ethOutflow[3].totalAmt) - (ethInflow[3].sumInUsd - ethOutflow[3].sumInUsd);
  
    const exchangeGainLoss = ethGainLoss - cbpGainLoss;
  
    const ebitda = cbpToETH(cbpInflow[3].royalty) + ethInflow[3].transfer - (ethExp + cbpExp);
    const ebitdaInUsd = cbpInflow[3].royaltyInUsd + ethInflow[3].transferInUsd - (ethExpInUsd + cbpExpInUsd) + exchangeGainLoss;
  
    const profits = ebitda - armotization().inEth;
    const profitsInUsd = ebitdaInUsd - armotization().inUsd;
    
    const inEth =  profits - ethOutflow[3].distribution;
    const inUsd =  profitsInUsd - ethOutflow[3].distributionInUsd;
  
    return({inEth:inEth, inUsd:inUsd});
  }

  // ==== Owners Equity ====

  const ownersEquity = () => {
    const inEth = initContribution + ethInflow[3].capital + retainedEarnings().inEth;
    const inUsd = weiToDust(initContribution) + ethInflow[3].capitalInUsd + retainedEarnings().inUsd;

    return ({inEth:inEth, inUsd:inUsd});
  }

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
            ? weiToEth9Dec(deferredRevenue().inEth)
            : showUSD(deferredRevenue().inUsd)}) </b>
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
            ? weiToEth9Dec(deferredRevenue().inEth)
            : showUSD(weiToDust(deferredRevenue().inEth))}) </b>
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
            ? weiToEth9Dec(ethInflow[2].capital)
            : showUSD(ethInflow[2].capitalInUsd)}) </b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
        <Typography variant="h6" textAlign='center' width='10%'>
          +
        </Typography>
        <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} >
          <b>Retained Earnings: ({ inETH
            ? weiToEth9Dec(retainedEarnings().inEth)
            : showUSD(retainedEarnings().inUsd)}) </b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' >
        <Typography variant="h6" textAlign='center' width='20%'>
          &nbsp;
        </Typography>
        <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
          <b>Total Equity: ({ inETH
            ? weiToEth9Dec(ownersEquity().inEth)
            : showUSD(ownersEquity().inUsd)}) </b>
        </Button>
      </Stack>

      <Divider orientation="horizontal"  sx={{ my:2, color:'blue' }} flexItem  />

      <Stack direction='row' width='100%' >
        <Typography variant="h6" textAlign='center' width='20%'>
          &nbsp;
        </Typography>
        <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
          <b>Total Liabilities & Owners Equity: ({ inETH
            ? weiToEth9Dec(deferredRevenue().inEth + ownersEquity().inEth)
            : showUSD(weiToDust(deferredRevenue().inEth) + ownersEquity().inUsd)}) </b>
        </Button>
      </Stack>

    </Paper>
  );   
}