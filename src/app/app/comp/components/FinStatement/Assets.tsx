import { Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { showUSD, StatementProps, weiToEth9Dec } from "../FinStatement";
import { EthInflowSum } from "./Cashflow/EthInflow";
import { EthOutflowSum } from "./Cashflow/EthOutflow";

export interface AssetsProps extends StatementProps {
  ethInflow: EthInflowSum[],
  ethOutflow: EthOutflowSum[],
}

const setUpDate = Math.floor((new Date('2024-05-18T00:00:00Z')).getTime()/1000);
const fullLifeHrs = 15n * 365n * 86400n;

export const getInitContribution = (endDate: number, centPrice: bigint) => {
  return endDate >= setUpDate
      ? 3n * 10n ** 7n * centPrice
      : 0n;
}

export const getArmontization = (startDate: number, endDate: number, centPrice: bigint) => {

  const initContribution = getInitContribution(endDate, centPrice);

  const daysOfPeriod = startDate >= setUpDate
      ? BigInt(endDate - startDate)
      : endDate >= setUpDate ? BigInt(endDate - setUpDate) : 0n;

  const inEth = initContribution * daysOfPeriod / fullLifeHrs;
  const inUsd = inEth * 10n ** 16n / centPrice;

  return ({inEth:inEth, inUsd:inUsd});
}

export function Assets({inETH, centPrice, startDate, endDate, display, ethInflow, ethOutflow}: AssetsProps) {

  const weiToDust = (eth:bigint) => {
    return eth * 10n ** 16n / centPrice;
  }

  // ---- IPR ----

  const beginValueOfIPR = () => {
    const daysToStart = startDate >= setUpDate 
    ? BigInt(startDate - setUpDate)
    : 0n;

    const inEth = getInitContribution(endDate, centPrice) * (fullLifeHrs - daysToStart) / fullLifeHrs;
    const inUsd = weiToDust(inEth);

    return({inEth:inEth, inUsd:inUsd});
  }

  const netValueOfIPR = () => {
    const inEth = beginValueOfIPR().inEth - getArmontization(startDate, endDate, centPrice).inEth;
    const inUsd = weiToDust(inEth);

    return ({inEth:inEth, inUsd:inUsd});
  }

  // ---- ETH ----

  const ethOfComp = () => {
    const inEth = ethInflow[3].totalAmt - ethOutflow[3].totalAmt;
    const inUsd = ethInflow[3].sumInUsd - ethOutflow[3].sumInUsd;

    return ({inEth:inEth, inUsd:inUsd});
  }

  const ethGainLoss = weiToDust(ethOfComp().inEth) - ethOfComp().inUsd;

  const curValueOfEth = ()=> {
    const inEth = ethOfComp().inEth;
    const inUsd = weiToDust(ethOfComp().inEth);

    return ({inEth:inEth, inUsd:inUsd});
  }

  const totalAssets = ()=>{
    const inEth = netValueOfIPR().inEth + ethOfComp().inEth;
    const inUsd = netValueOfIPR().inUsd + curValueOfEth().inUsd;

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
            ? weiToEth9Dec(beginValueOfIPR().inEth) 
            : showUSD(beginValueOfIPR().inUsd)}) </b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
        <Typography variant="h6" textAlign='center' width='10%'>
          -
        </Typography>
        <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} >
          <b>Amortization: ({ inETH 
            ? weiToEth9Dec(getArmontization(startDate, endDate, centPrice).inEth) 
            : showUSD(getArmontization(startDate, endDate, centPrice).inUsd)}) </b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' >
        <Typography variant="h6" textAlign='center' width='20%'>
          &nbsp;
        </Typography>
        <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
          <b>Net Value Of IPR: ({ inETH 
            ? weiToEth9Dec(netValueOfIPR().inEth) 
            : showUSD(netValueOfIPR().inUsd)}) </b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' >
        <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} onClick={()=>display[0](3)}>
          <b>ETH Of Comp: ({ inETH 
            ? weiToEth9Dec(ethOfComp().inEth)
            : showUSD(ethOfComp().inUsd) }) </b>
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
            ? weiToEth9Dec(ethOfComp().inEth)
            : showUSD(ethOfComp().inUsd)}) </b>
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