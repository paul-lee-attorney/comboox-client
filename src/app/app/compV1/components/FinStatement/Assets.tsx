import { Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { baseToDust, showUSD, StatementProps, weiToEth9Dec } from "../FinStatement";
import { EthInflowSum } from "./Cashflow/EthInflow";
import { EthOutflowSum } from "./Cashflow/EthOutflow";
import { usePublicClient } from "wagmi";
import { useEffect, useState } from "react";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { booxMap } from "../../../common";
import { UsdInflowSum } from "./Cashflow/UsdInflow";
import { UsdOutflowSum } from "./Cashflow/UsdOutflow";
import { balanceOfComp } from "../../cashier";

export interface AssetsProps extends StatementProps {
  ethInflow: EthInflowSum[],
  ethOutflow: EthOutflowSum[],
  usdInflow: UsdInflowSum[],
  usdOutflow: UsdOutflowSum[],
}

export const setUpDate = Math.floor((new Date('2026-12-31T23:59:59Z')).getTime()/1000);
export const iprValueA = 25n * 10n ** 8n;
export const iprValueB = 5n * 10n ** 8n;

const fullLifeHrs = 15n * 365n * 86400n;

export const getInitContribution = (type:number, startDate:number, endDate: number) => {

  return type > 1 
      ? endDate >= setUpDate ? iprValueA + iprValueB : 0n
      : startDate >= setUpDate ? iprValueA + iprValueB : 0n;
}

export const getArmotization = (type:number, startDate: number, endDate: number) => {

  const initContribution = getInitContribution(type, startDate, endDate);

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

export function Assets({inETH, centPrice, startDate, endDate, rptBlkNo, display, ethInflow, ethOutflow}: AssetsProps) {

  const weiToDust = (eth:bigint) => {
    return eth * 10n ** 16n / centPrice;
  }

  const baseToWei = (usd:bigint) => {
    return usd * centPrice / 100n;
  }

  const microToWei = (usd:bigint) => {
    return usd * centPrice / 10000n;
  }

  const microToDust = (usd:bigint) => {
    return usd * 10n ** 12n;
  }

  // ---- IPR ----

  const initContribution = getInitContribution(3, startDate, endDate);

  const daysToStart = startDate >= setUpDate 
  ? BigInt(startDate - setUpDate)
  : 0n;

  const beginValueOfIPR = initContribution * (fullLifeHrs - daysToStart) / fullLifeHrs;

  const armotization = getArmotization(2, startDate, endDate);

  const netValueOfIPR = beginValueOfIPR - armotization;

  // const [ethOfComp, setEthOfComp] = useState(0n);

  const client = usePublicClient();
  const { gk, boox } = useComBooxContext();

  // useEffect(()=>{
  //   const getEthOfComp = async ()=>{
  //     if (!gk) return 0n;

  //     const balaOfGK = await client.getBalance({
  //       address: gk,
  //       blockNumber: rptBlkNo,
  //     });

  //     // const balaOfFT = await client.getBalance({
  //     //   address: AddrOfTank,
  //     //   blockNumber: rptBlkNo,
  //     // });

  //     const balaOfDeposits = await totalDeposits(gk, rptBlkNo);

  //     const output = balaOfGK - balaOfDeposits;

  //     return output;
  //   }

  //   getEthOfComp().then(
  //     res => setEthOfComp(res)
  //   );

  // }, [rptBlkNo, gk, client]);

  let ethOfComp = getEthOfComp(3, ethInflow, ethOutflow);

  const [usdOfComp, setUsdOfComp] = useState(0n);

  useEffect(()=>{
    const getUsdOfComp = async ()=>{
      if (!boox) return 0n;

      const res = await balanceOfComp(boox[booxMap.ROI],rptBlkNo);
      setUsdOfComp(res);      
    }

    getUsdOfComp();

  }, [rptBlkNo, boox]);

  const totalAssets = ()=>{
    const inEth = baseToWei(netValueOfIPR) + ethOfComp.inEth + microToWei(usdOfComp);
    const inUsd = baseToDust(netValueOfIPR) + weiToDust(ethOfComp.inEth) + microToDust(usdOfComp);

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
            ? weiToEth9Dec(baseToWei(beginValueOfIPR)) 
            : showUSD(baseToDust(beginValueOfIPR)) })</b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
        <Typography variant="h6" textAlign='center' width='10%'>
          -
        </Typography>
        <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} >
          <b>Amortization: ({ inETH 
            ? weiToEth9Dec(baseToWei(armotization)) 
            : showUSD(baseToDust(armotization))}) </b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' >
        <Typography variant="h6" textAlign='center' width='20%'>
          &nbsp;
        </Typography>
        <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
          <b>Net Value Of IPR: ({ inETH 
            ? weiToEth9Dec(baseToWei(netValueOfIPR)) 
            : showUSD(baseToDust(netValueOfIPR))}) </b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' >
        <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} onClick={()=>display[0](3)}>
          <b>ETH Of Comp: ({ inETH 
            ? weiToEth9Dec(ethOfComp.inEth)
            : showUSD(weiToDust(ethOfComp.inEth)) }) </b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' >
        <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} onClick={()=>display[1](3)}>
          <b>USDC Of Comp: ({ inETH 
            ? weiToEth9Dec(microToWei(usdOfComp))
            : showUSD(microToDust(usdOfComp)) }) </b>
        </Button>
      </Stack>

      <Divider orientation="horizontal"  sx={{ my:2, color:'blue' }} flexItem  />

      <Stack direction='row' width='100%' >
        <Typography variant="h6" textAlign='center' width='20%'>
          &nbsp;
        </Typography>
        <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
          <b>Total Assets: ({ inETH
            ? weiToEth9Dec(totalAssets().inEth)
            : showUSD(totalAssets().inUsd)}) </b>
        </Button>
      </Stack>

    </Paper>

  );   
}