import { Button, Divider, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { showUSD, weiToEth9Dec } from "../FinStatement";
import { baseToDollar } from "../../../common/toolsKit";
import { IncomeStatementProps } from "./IncomeStatement";
import { useEffect, useState } from "react";
import { capAtDate, getOwnersEquity } from "../../rom/rom";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { booxMap } from "../../../common";
import { usePublicClient } from "wagmi";

export function EquityChangeStatement({inETH, exRate, centPrice, startDate, endDate, display, ethInflow, ethOutflow, cbpInflow, cbpOutflow}: IncomeStatementProps) {

  const { boox } = useComBooxContext();

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

  // ---- Cap ----

  const [ openningCap, setOpenningCap ] = useState(30n * 10n ** 8n);
  const [ endingCap, setEndingCap ] = useState(30n * 10n ** 8n);

  const client = usePublicClient();

  useEffect(()=>{

    const getPaidCap = async ()=>{
      if (!boox) return;

      let begCap = await capAtDate(boox[booxMap.ROM], startDate);
      if (begCap.paid > 0n) setOpenningCap(begCap.paid);
      console.log('startDate: ', startDate, 'begCap: ', begCap);

      let blk = await client.getBlock();
      let curTime = Number(blk.timestamp);

      let endCap = await capAtDate(boox[booxMap.ROM], endDate >= curTime ? curTime : endDate);
      if (endCap.paid > 0n) setEndingCap(endCap.paid);
      console.log('endDate: ', endDate, 'endCap: ', endCap);
    }

    getPaidCap();
  }, [startDate, endDate, client, boox]);


  // ---- IPR ----

  const setUpDate = Math.floor((new Date('2024-05-18T00:00:00Z')).getTime()/1000);
  const fullLifeHrs = 15n * 365n * 86400n;

  let initContribution = endDate >= setUpDate
      ? 3n * 10n ** 7n * centPrice
      : 0n;
  
  let daysOfPeriod = startDate >= setUpDate
      ? BigInt(endDate - startDate)
      : endDate >= setUpDate ? BigInt(endDate - setUpDate) : 0n;

  const getCapPremium = (type:number)=> {
    let paidCap = type == 1
        ? openningCap * 10n ** 14n
        : endingCap * 10n ** 14n;

    return ethInflow[type].capitalInUsd + weiToDust(initContribution) - paidCap;
  }

  const retainedEarnings = (type:number) => {

    let armotization = initContribution * daysOfPeriod / fullLifeHrs;

    // ---- ETH ----
  
    let ethOfComp = ethInflow[type].totalAmt - ethOutflow[type].totalAmt;
    let ethOfCompInUsd = ethInflow[type].sumInUsd - ethOutflow[type].sumInUsd;
  
    let ethGainLoss = weiToDust(ethOfComp) - ethOfCompInUsd;
  
    // ---- CBP ----
  
    let deferredRevenue = cbpToETH(cbpOutflow[type].totalAmt - cbpInflow[type].totalAmt + cbpInflow[type].mint);
    let deferredRevenueInUsd = cbpOutflow[type].sumInUsd - cbpInflow[type].sumInUsd + cbpInflow[type].mintInUsd;
  
    let cbpGainLoss = weiToDust(deferredRevenue) - deferredRevenueInUsd;
  
    let exchangeGainLoss = ethGainLoss - cbpGainLoss;
  
    // ---- SG&A ----
  
    let ethExp = ethOutflow[type].totalAmt - ethOutflow[type].distribution;
    let ethExpInUsd = ethOutflow[type].sumInUsd - ethOutflow[type].distributionInUsd;
  
    let cbpExp = cbpToETH(cbpOutflow[type].totalAmt - cbpOutflow[type].fuelSold);
    let cbpExpInUsd = cbpOutflow[type].sumInUsd - cbpOutflow[type].fuelSoldInUsd;
  
    let sgNa = ethExp + cbpExp;
    let sgNaInUsd = ethExpInUsd + cbpExpInUsd;
  
    // ---- Profits ----
  
    let ebitda = cbpToETH(cbpInflow[type].royalty) + ethInflow[type].transfer - sgNa;
    let ebitdaInUsd = cbpInflow[type].royaltyInUsd + ethInflow[type].transferInUsd - sgNaInUsd + exchangeGainLoss;
  
    let profits = ebitda - armotization;
    let profitsInUsd = ebitdaInUsd - weiToDust(armotization);
  
    return {inEth: profits, inUsd: profitsInUsd};
  }

  const getEquity = (type:number)=> {
    return ethInflow[type].capitalInUsd + weiToDust(initContribution) + retainedEarnings(type).inUsd;
  }


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
            <b>Statement of Changes in Equity</b>
          </Typography>
        </Stack>

        <Table >

          <TableHead>
            <TableRow >
              <TableCell>
                <Typography variant='body1'>
                  <b>Particulars</b>
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='body1'>
                  <b>Share Capital</b>
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='body1'>
                  <b>Share Premium</b>
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='body1'>
                  <b>Retained Earnings</b>
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='body1'>
                  <b>Total Equity</b>
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            
            <TableRow sx={{ backgroundColor:'lightskyblue'}}>

              <TableCell>
                <Typography variant='body1'>
                  <b>Begining Balance</b>  
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                  { baseToDollar(openningCap.toString()) } 
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                  { showUSD(getCapPremium(1))} 
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                  { showUSD(retainedEarnings(1).inUsd)} 
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                  { showUSD(getEquity(1))} 
                </Typography>
              </TableCell>

            </TableRow>

            <TableRow >
              
              <TableCell>
                <Typography variant='body1'>
                  <b>Net Income</b>  
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                  &nbsp; 
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                  &nbsp; 
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                  { showUSD(retainedEarnings(2).inUsd)} 
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                { showUSD(retainedEarnings(2).inUsd)} 
                </Typography>
              </TableCell>

            </TableRow>

            <TableRow sx={{ backgroundColor:'lightskyblue'}}>
              
              <TableCell>
                <Typography variant='body1'>
                  <b>Dividends Paid</b>  
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                  &nbsp; 
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                  &nbsp; 
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                  - { showUSD(ethOutflow[2].distributionInUsd)} 
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                - { showUSD(ethOutflow[2].distributionInUsd)} 
                </Typography>
              </TableCell>

            </TableRow>

            <TableRow >
              
              <TableCell>
                <Typography variant='body1'>
                  <b>Shares Issued</b>  
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                { baseToDollar((endingCap - openningCap).toString())} 
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                  { showUSD(ethInflow[2].capitalInUsd - (endingCap - openningCap) * 10n ** 14n)}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                  &nbsp;
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                  { showUSD(ethInflow[2].capitalInUsd)} 
                </Typography>
              </TableCell>

            </TableRow>

            <TableRow sx={{ backgroundColor:'lightskyblue'}}>
              
              <TableCell>
                <Typography variant='body1'>
                  <b>Ending Balance</b>  
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                  {baseToDollar(endingCap.toString())} 
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                  { showUSD(ethInflow[3].capitalInUsd + weiToDust(initContribution) - endingCap * 10n ** 14n)}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                   { showUSD(retainedEarnings(3).inUsd)}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                  { showUSD(getEquity(3))} 
                </Typography>
              </TableCell>

            </TableRow>

          </TableBody>

        </Table>



    </Paper>

  );   
}