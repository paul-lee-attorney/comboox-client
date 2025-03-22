import { Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { showUSD, weiToEth9Dec } from "../FinStatement";
import { baseToDollar } from "../../../common/toolsKit";
import { CbpInflowSum } from "./Cashflow/CbpInflow";
import { CbpOutflowSum } from "./Cashflow/CbpOutflow";
import { AssetsProps, getArmotization, getEthOfComp } from "./Assets";
import { getDeferredRevenue } from "./LiabilityAndEquity";
import { EthOutflowSum } from "./Cashflow/EthOutflow";
import { EthInflowSum } from "./Cashflow/EthInflow";


export const getSGNA = (type:number, ethOutflow:EthOutflowSum[], cbpOutflow:CbpOutflowSum[], cbpToETH:(cbp:bigint)=>bigint) => {
  const ethExp = ethOutflow[type].totalAmt - ethOutflow[type].distribution;
  const ethExpInUsd = ethOutflow[type].sumInUsd - ethOutflow[type].distributionInUsd;

  const cbpExp = cbpToETH(cbpOutflow[type].totalAmt - cbpOutflow[type].fuelSold);
  const cbpExpInUsd = cbpOutflow[type].sumInUsd - cbpOutflow[type].fuelSoldInUsd;

  const inEth = ethExp + cbpExp;
  const inUsd = ethExpInUsd + cbpExpInUsd;

  return ({inEth:inEth, inUsd:inUsd});
}

export const getOpExchangeGainLoss = (type:number, ethInflow:EthInflowSum[], ethOutflow:EthOutflowSum[], cbpInflow:CbpInflowSum[], cbpOutflow:CbpOutflowSum[], weiToDust:(eht:bigint)=>bigint, cbpToETH:(cbp:bigint)=>bigint)=> {

  const ethOfComp = getEthOfComp(type, ethInflow, ethOutflow);
  const ethGainLoss = weiToDust(ethOfComp.inEth - ethInflow[type].capital) - (ethOfComp.inUsd - ethInflow[type].capitalInUsd);

  const deferredRevenue = getDeferredRevenue(type, cbpInflow, cbpOutflow, cbpToETH);
  const cbpGainLoss = weiToDust(deferredRevenue.inEth) - deferredRevenue.inUsd;

  return ethGainLoss - cbpGainLoss;
}

export const getEBITDA = (type:number, cbpInflow:CbpInflowSum[], cbpOutflow:CbpOutflowSum[], ethInflow:EthInflowSum[], ethOutflow:EthOutflowSum[], cbpToETH:(cbp:bigint)=>bigint, weiToDust:(eth:bigint)=>bigint)=>{

  const sgNa = getSGNA(type, ethOutflow, cbpOutflow, cbpToETH);
  const exchangeGainLoss = getOpExchangeGainLoss(type, ethInflow, ethOutflow, cbpInflow, cbpOutflow, weiToDust, cbpToETH);

  const inEth = cbpToETH(cbpInflow[type].royalty) + ethInflow[type].transfer - sgNa.inEth;
  const inUsd = cbpInflow[type].royaltyInUsd + ethInflow[type].transferInUsd - sgNa.inUsd + exchangeGainLoss;

  return ({inEth:inEth, inUsd:inUsd});
}

export const getProfits = (type:number, startDate:number, endDate:number, centPrice:bigint, cbpInflow:CbpInflowSum[], cbpOutflow:CbpOutflowSum[], ethInflow:EthInflowSum[], ethOutflow:EthOutflowSum[], cbpToETH:(cbp:bigint)=>bigint, weiToDust:(eth:bigint)=>bigint)=>{

  const armotization = getArmotization(type, startDate, endDate);

  const ebitda = getEBITDA(type,cbpInflow, cbpOutflow, ethInflow, ethOutflow, cbpToETH, weiToDust);

  const inEth = ebitda.inEth - armotization;
  const inUsd = ebitda.inUsd - weiToDust(armotization);

  return({inEth:inEth, inUsd:inUsd});
}

export const getRetainedEarnings = (type:number, startDate:number, endDate:number, centPrice:bigint, cbpInflow:CbpInflowSum[], cbpOutflow:CbpOutflowSum[], ethInflow:EthInflowSum[], ethOutflow:EthOutflowSum[], cbpToETH:(cbp:bigint)=>bigint, weiToDust:(eth:bigint)=>bigint) => {

  const profits = getProfits(type, startDate, endDate, centPrice, cbpInflow, cbpOutflow, ethInflow, ethOutflow, cbpToETH, weiToDust);

  const inEth = profits.inEth - ethOutflow[type].distribution;
  const inUsd = profits.inUsd - weiToDust(ethOutflow[type].distribution);

  return ({inEth:inEth, inUsd:inUsd});
}

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

  const armotization = getArmotization(2, startDate, endDate);

  const sgNa = getSGNA(2, ethOutflow, cbpOutflow, cbpToETH);
  const exchangeGainLoss = getOpExchangeGainLoss(2, ethInflow, ethOutflow, cbpInflow, cbpOutflow, weiToDust, cbpToETH);

  const ebitda = getEBITDA(2, cbpInflow, cbpOutflow, ethInflow, ethOutflow, cbpToETH, weiToDust);

  const profits = getProfits(2, startDate, endDate, centPrice, cbpInflow, cbpOutflow, ethInflow, ethOutflow, cbpToETH, weiToDust);

  const retainedEarnings = getRetainedEarnings(2, startDate, endDate, centPrice, cbpInflow, cbpOutflow, ethInflow, ethOutflow, cbpToETH, weiToDust);

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
            ? weiToEth9Dec(sgNa.inEth)
            : showUSD(sgNa.inUsd)}) </b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
        <Typography variant="h6" textAlign='center' width='10%'>
          +
        </Typography>
        <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} onClick={()=>display[3](2)} >
          <b>Operational Crypto Exchange Gain/Loss: ({ inETH
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
            ? weiToEth9Dec(ebitda.inEth)
            : showUSD(ebitda.inUsd)}) </b>
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
          <b>Net Income: ({ inETH
            ? weiToEth9Dec(profits.inEth)
            : showUSD(profits.inUsd) }) </b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
        <Typography variant="h6" textAlign='center' width='40%'>
          &nbsp;
        </Typography>
        <Typography variant="h6" textAlign='center' width='10%'>
          -
        </Typography>
        <Button variant="outlined" sx={{width: '50%', m:0.5, justifyContent:'start'}} >
          <b>Distribution: ({ inETH
            ? weiToEth9Dec(ethOutflow[2].distribution)
            : showUSD(weiToDust(ethOutflow[2].distribution)) }) </b>
        </Button>
      </Stack>

      <Divider orientation="horizontal"  sx={{ my:2, color:'blue' }} flexItem  />

      <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
        <Typography variant="h6" textAlign='center' width='60%'>
          &nbsp;
        </Typography>
        <Button variant="outlined" sx={{width: '40%', m:0.5, justifyContent:'start'}} >
          <b>Retained Earnings: ({ inETH
            ? weiToEth9Dec(retainedEarnings.inEth)
            : showUSD(retainedEarnings.inUsd) }) </b>
        </Button>
      </Stack>

    </Paper>
  );   
}