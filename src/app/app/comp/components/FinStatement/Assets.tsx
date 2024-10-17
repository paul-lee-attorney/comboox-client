import { Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { defReportItem, ReportItem, showUSD, StatementProps, weiToEth9Dec } from "../FinStatement";
import { EthInflowSum } from "./Cashflow/EthInflow";
import { EthOutflowSum } from "./Cashflow/EthOutflow";
import { useEffect, useState } from "react";

export interface AssetsProps extends StatementProps {
  ethInflow: EthInflowSum[],
  ethOutflow: EthOutflowSum[],
}

const setUpDate = Math.floor((new Date('2024-05-18T00:00:00Z')).getTime()/1000);
const fullLifeHrs = 15n * 365n * 86400n;

export const getInitContribution = (type:number, startDate:number, endDate: number, centPrice: bigint) => {
  return type > 1 
      ? endDate >= setUpDate  ? 3n * 10n ** 7n * centPrice : 0n
      : startDate >= setUpDate ? 3n * 10n ** 7n * centPrice : 0n;
}

export const getArmotization = (type:number, startDate: number, endDate: number, centPrice: bigint) => {

  const initContribution = getInitContribution(type, startDate, endDate, centPrice);

  let daysOfPeriod = 0n;

  switch (type) {
    case 1:
      daysOfPeriod = startDate >= setUpDate 
        ? BigInt(startDate - setUpDate) : 0n;
      break;
    case 2:
      daysOfPeriod = startDate >= setUpDate 
        ? BigInt(endDate - startDate)
        : endDate >= setUpDate ? BigInt(endDate - setUpDate) : 0n;
      break;
    case 3:
      daysOfPeriod = endDate >= setUpDate
        ? BigInt(endDate - setUpDate) : 0n;
      break;
  }
  
  return initContribution * daysOfPeriod / fullLifeHrs;
}

export const getEthOfComp = (type:number, ethInflow:EthInflowSum[], ethOutflow:EthOutflowSum[]) => {
  const inEth = ethInflow[type].totalAmt - ethOutflow[type].totalAmt;
  const inUsd = ethInflow[type].sumInUsd - ethOutflow[type].sumInUsd;

  return ({inEth:inEth, inUsd:inUsd});
}

export function Assets({inETH, centPrice, startDate, endDate, display, ethInflow, ethOutflow}: AssetsProps) {

  const weiToDust = (eth:bigint) => {
    return eth * 10n ** 16n / centPrice;
  }

  // ---- IPR ----

  const initContribution = getInitContribution(3, startDate, endDate, centPrice);

  const daysToStart = startDate >= setUpDate 
  ? BigInt(startDate - setUpDate)
  : 0n;

  const beginValueOfIPR = initContribution * (fullLifeHrs - daysToStart) / fullLifeHrs;

  const armotization = getArmotization(3, startDate, endDate, centPrice);

  const netValueOfIPR = beginValueOfIPR - armotization;

  const ethOfComp = getEthOfComp(3, ethInflow, ethOutflow);

  const ethGainLoss = weiToDust(ethOfComp.inEth) - ethOfComp.inUsd;

  const totalAssets = ()=>{
    const inEth = netValueOfIPR + ethOfComp.inEth;
    const inUsd = weiToDust(netValueOfIPR + ethOfComp.inEth);

    return({inEth:inEth, inUsd:inUsd});
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
          <b>Balance Sheet (Assets)</b>
        </Typography>
      </Stack>

      <Stack direction='row' width='100%' >
        <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} >
          <b>Beginning Value of IPR: ({inETH 
            ? weiToEth9Dec(beginValueOfIPR) 
            : showUSD(weiToDust(beginValueOfIPR)) })</b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
        <Typography variant="h6" textAlign='center' width='10%'>
          -
        </Typography>
        <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} >
          <b>Amortization: ({ inETH 
            ? weiToEth9Dec(armotization) 
            : showUSD(weiToDust(armotization))}) </b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' >
        <Typography variant="h6" textAlign='center' width='20%'>
          &nbsp;
        </Typography>
        <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
          <b>Net Value Of IPR: ({ inETH 
            ? weiToEth9Dec(netValueOfIPR) 
            : showUSD(weiToDust(netValueOfIPR))}) </b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' >
        <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} onClick={()=>display[0](3)}>
          <b>ETH Of Comp: ({ inETH 
            ? weiToEth9Dec(ethOfComp.inEth)
            : showUSD(ethOfComp.inUsd) }) </b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
        <Typography variant="h6" textAlign='center' width='10%'>
          +
        </Typography>
        <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} >
          <b>Appreciation of ETH: ({ inETH 
            ? 0
            : showUSD(ethGainLoss)}) </b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' >
        <Typography variant="h6" textAlign='center' width='20%'>
          &nbsp;
        </Typography>
        <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
          <b>Current Value of ETH: ({ inETH 
            ? weiToEth9Dec(ethOfComp.inEth)
            : showUSD(weiToDust(ethOfComp.inEth))}) </b>
        </Button>
      </Stack>

      <Divider orientation="horizontal"  sx={{ my:2, color:'blue' }} flexItem  />

      <Stack direction='row' width='100%' >
        <Typography variant="h6" textAlign='center' width='30%'>
          &nbsp;
        </Typography>
        <Button variant="outlined" sx={{width: '70%', m:0.5, justifyContent:'start'}} >
          <b>Total Assets: ({ inETH
            ? weiToEth9Dec(totalAssets().inEth)
            : showUSD(totalAssets().inUsd)}) </b>
        </Button>
      </Stack>

    </Paper>

  );   
}