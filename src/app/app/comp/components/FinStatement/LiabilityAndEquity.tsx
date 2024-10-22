import { Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { showUSD, weiToEth9Dec } from "../FinStatement";
import { baseToDollar } from "../../../common/toolsKit";
import { getProfits, IncomeStatementProps } from "./IncomeStatement";
import { getInitContribution } from "./Assets";
import { CbpOutflowSum } from "./Cashflow/CbpOutflow";
import { CbpInflowSum } from "./Cashflow/CbpInflow";
import { EthOutflowSum } from "./Cashflow/EthOutflow";
import { EthInflowSum } from "./Cashflow/EthInflow";
import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { balanceOf, getTotalSupply } from "../../../rc";


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

  const inUsd = weiToDust(initContribution) + weiToDust(ethInflow[type].capital) + retainedEarnings.inUsd;

  return ({inEth:inEth, inUsd:inUsd});
}

export function LiabilyAndEquity({inETH, centPrice, exRate, startDate, endDate, rptBlkNo, display, cbpInflow, cbpOutflow, ethInflow, ethOutflow}: IncomeStatementProps) {

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

  const [ deferredRevenue, setDeferredRevenue] = useState(0n);

  const client = usePublicClient();
  const {gk} = useComBooxContext();

  useEffect(()=>{
    const getDeferredRevenue = async ()=>{
      if (!gk) return 0n;

      const cbpSupply = await getTotalSupply();
      const cbpOfComp = await balanceOf(gk, rptBlkNo);

      const output = cbpSupply - cbpOfComp;

      return output;
    }

    getDeferredRevenue().then(
      res => setDeferredRevenue(res)
    );

  }, [rptBlkNo, gk, client]);
  
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
            ? weiToEth9Dec(cbpToETH(deferredRevenue))
            : showUSD(weiToDust(cbpToETH(deferredRevenue)))}) </b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' >
        <Typography variant="h6" textAlign='center' width='20%'>
          &nbsp;
        </Typography>
        <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
          <b>Total Liabilities: ({ inETH
            ? weiToEth9Dec(cbpToETH(deferredRevenue))
            : showUSD(weiToDust(cbpToETH(deferredRevenue)))}) </b>
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
            : showUSD(weiToDust(ethInflow[3].capital))}) </b>
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
            ? weiToEth9Dec(cbpToETH(deferredRevenue) + ownersEquity.inEth)
            : showUSD(weiToDust(cbpToETH(deferredRevenue)) + ownersEquity.inUsd)}) </b>
        </Button>
      </Stack>

    </Paper>
  );   
}