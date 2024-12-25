import { Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { baseToDust, showUSD, weiToEth9Dec } from "../FinStatement";
import { baseToDollar } from "../../../common/toolsKit";
import { getRetainedEarnings, IncomeStatementProps } from "./IncomeStatement";
import { getInitContribution } from "./Assets";
import { CbpOutflowSum } from "./Cashflow/CbpOutflow";
import { CbpInflowSum } from "./Cashflow/CbpInflow";
import { EthOutflowSum } from "./Cashflow/EthOutflow";
import { EthInflowSum } from "./Cashflow/EthInflow";
import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { balanceOf, getTotalSupply } from "../../../rc";
import { AddrOfTank, booxMap, HexType } from "../../../common";
import { capAtDate } from "../../rom/rom";


export const getDeferredRevenue = (type:number, cbpInflow:CbpInflowSum[], cbpOutflow:CbpOutflowSum[], cbpToETH:(cbp:bigint)=>bigint) => {
  const inEth = cbpToETH(cbpOutflow[type].totalAmt - cbpInflow[type].totalAmt + cbpInflow[type].mint);
  const inUsd = cbpOutflow[type].sumInUsd - cbpInflow[type].sumInUsd + cbpInflow[type].mintInUsd;

  return ({inEth:inEth, inUsd:inUsd});
}

export const getOwnersEquity = (type:number, startDate:number, endDate:number, centPrice:bigint, cbpInflow:CbpInflowSum[], cbpOutflow:CbpOutflowSum[], ethInflow:EthInflowSum[], ethOutflow:EthOutflowSum[], cbpToETH:(cbp:bigint)=>bigint, baseToWei:(usd:bigint)=>bigint, weiToDust:(eth:bigint)=>bigint ) => {

  const initContribution = getInitContribution(type, startDate, endDate);

  const retainedEarnings = getRetainedEarnings(type, startDate, endDate, centPrice, cbpInflow, cbpOutflow, ethInflow, ethOutflow, cbpToETH, weiToDust);

  const inEth = baseToWei(initContribution) + ethInflow[type].capital + retainedEarnings.inEth;

  const inUsd = baseToDust(initContribution) + weiToDust(ethInflow[type].capital) + retainedEarnings.inUsd;

  return ({inEth:inEth, inUsd:inUsd});
}

export function LiabilyAndEquity({inETH, centPrice, exRate, startDate, endDate, rptBlkNo, display, cbpInflow, cbpOutflow, ethInflow, ethOutflow}: IncomeStatementProps) {

  const cbpToETH = (cbp:bigint) => {
    return cbp * 10000n / exRate;
  }

  const weiToDust = (eth:bigint) => {
    return eth * 10n ** 16n / centPrice;
  }

  const baseToWei = (base:bigint) => {
    return base * centPrice / 100n;
  }

  // ==== Liabilities ====

  const [ deferredRevenue, setDeferredRevenue] = useState(0n);

  const client = usePublicClient();
  const {gk} = useComBooxContext();

  useEffect(()=>{
    const getDeferredRevenue = async ()=>{
      if (!gk) return 0n;

      const cbpSupply = await getTotalSupply();
      const cbpOfGK = await balanceOf(gk, rptBlkNo);
      const cbpOfFT = await balanceOf(AddrOfTank, rptBlkNo);
      const cbpOfComp = cbpOfGK + cbpOfFT;

      const output = cbpSupply - cbpOfComp;

      return output;
    }

    getDeferredRevenue().then(
      res => setDeferredRevenue(res)
    );

  }, [rptBlkNo, gk, client]);
  
  // ==== Capital ====

  const {boox} = useComBooxContext();
  const [parOfCap, setParOfCap] = useState(0n);
  const [paidOfCap, setPaidOfCap] = useState(0n);
  
  useEffect(()=>{

    const getCapital = async ()=>{
      
      if (!boox || boox.length == 0) return;
      const rom = boox[booxMap.ROM];
      const capital = await capAtDate(rom, endDate);

      setParOfCap(capital.par);
      setPaidOfCap(capital.paid);
    };

    getCapital();

  }, [boox, endDate]);

  // ==== Profits & Loss ====

  const initContribution = getInitContribution(3, startDate, endDate);

  const retainedEarnings = getRetainedEarnings(3, startDate, endDate, centPrice, cbpInflow, cbpOutflow, ethInflow, ethOutflow, cbpToETH, weiToDust);

  // ==== Owners Equity ====

  const ownersEquity = getOwnersEquity(3, startDate, endDate, centPrice, cbpInflow, cbpOutflow, ethInflow, ethOutflow, cbpToETH, baseToWei, weiToDust);

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
        <Typography variant="h6" textAlign='center' width='30%'>
          &nbsp;
        </Typography>
        <Button variant="outlined" sx={{width: '70%', m:0.5, justifyContent:'start'}} >
          <b>Total Liabilities: ({ inETH
            ? weiToEth9Dec(cbpToETH(deferredRevenue))
            : showUSD(weiToDust(cbpToETH(deferredRevenue)))}) </b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' >
        <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} >
          <b>Subscribed Capital: ({ inETH
            ? weiToEth9Dec(baseToWei(parOfCap))
            : baseToDollar(parOfCap.toString()) + 'USD' }) </b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
        <Typography variant="h6" textAlign='center' width='10%'>
          -
        </Typography>
        <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} onClick={()=>{}} >
          <b>Unpaid Subscription: ({ inETH
            ? weiToEth9Dec(baseToWei(parOfCap - paidOfCap))
            : baseToDollar((parOfCap - paidOfCap).toString()) + 'USD'}) </b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
        <Typography variant="h6" textAlign='center' width='20%'>
          &nbsp;
        </Typography>
        <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} onClick={()=>{}} >
          <b>Paid In Capital: ({ inETH
            ? weiToEth9Dec(baseToWei(paidOfCap))
            : baseToDollar(paidOfCap.toString()) + 'USD'}) </b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
        <Typography variant="h6" textAlign='center' width='10%'>
          &nbsp;
        </Typography>
        <Typography variant="h6" textAlign='center' width='10%'>
          +
        </Typography>
        <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} onClick={()=>display[1](3)} >
          <b>Additional Paid In Capital: ({ inETH
            ? weiToEth9Dec(ethInflow[3].capital + baseToWei(initContribution - paidOfCap))
            : showUSD(ethInflow[3].capitalInUsd + baseToDust(initContribution - paidOfCap))}) </b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
        <Typography variant="h6" textAlign='center' width='10%'>
          &nbsp;
        </Typography>
        <Typography variant="h6" textAlign='center' width='10%'>
          +
        </Typography>
        <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
          <b>Retained Earnings: ({ inETH
            ? weiToEth9Dec(retainedEarnings.inEth)
            : showUSD(retainedEarnings.inUsd)}) </b>
        </Button>
      </Stack>

      <Stack direction='row' width='100%' >
        <Typography variant="h6" textAlign='center' width='30%'>
          &nbsp;
        </Typography>
        <Button variant="outlined" sx={{width: '70%', m:0.5, justifyContent:'start'}} >
          <b>Total Equity: ({ inETH
            ? weiToEth9Dec(ownersEquity.inEth)
            : showUSD(ownersEquity.inUsd)}) </b>
        </Button>
      </Stack>

      <Divider orientation="horizontal"  sx={{ my:2, color:'blue' }} flexItem  />

      <Stack direction='row' width='100%' >
        <Typography variant="h6" textAlign='center' width='30%'>
          &nbsp;
        </Typography>
        <Button variant="outlined" sx={{width: '70%', m:0.5, justifyContent:'start'}} >
          <b>Total Liabilities & Owners Equity: ({ inETH
            ? weiToEth9Dec(cbpToETH(deferredRevenue) + ownersEquity.inEth)
            : showUSD(weiToDust(cbpToETH(deferredRevenue)) + ownersEquity.inUsd)}) </b>
        </Button>
      </Stack>

    </Paper>
  );   
}