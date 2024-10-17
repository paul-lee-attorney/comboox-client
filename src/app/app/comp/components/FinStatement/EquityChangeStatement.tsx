import { Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { showUSD } from "../FinStatement";
import { baseToDollar } from "../../../common/toolsKit";
import { getProfits, IncomeStatementProps } from "./IncomeStatement";
import { useEffect, useState } from "react";
import { capAtDate } from "../../rom/rom";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { booxMap } from "../../../common";
import { usePublicClient } from "wagmi";
import { getInitContribution } from "./Assets";
import { getOwnersEquity, getRetainedEarnings } from "./LiabilityAndEquity";

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

  const [ openningCap, setOpenningCap ] = useState(0n);
  const [ endingCap, setEndingCap ] = useState(0n);

  const client = usePublicClient();

  useEffect(()=>{

    const getPaidCap = async ()=>{
      if (!boox) return;

      let begCap = await capAtDate(boox[booxMap.ROM], startDate);
      if (begCap.paid >= 0n) setOpenningCap(begCap.paid);
      console.log('startDate: ', startDate, 'begCap: ', begCap);

      let blk = await client.getBlock();
      let curTime = Number(blk.timestamp);

      let endCap = await capAtDate(boox[booxMap.ROM], endDate >= curTime ? curTime : endDate);
      if (endCap.paid >= 0n) setEndingCap(endCap.paid);
      console.log('endDate: ', endDate, 'endCap: ', endCap);
    }

    getPaidCap();
  }, [startDate, endDate, client, boox]);


  // ---- IPR ----

  
  const getCapPremium = (type:number)=> {
    const paidCap = type == 1
        ? openningCap * 10n ** 14n
        : type == 2 ? (endingCap - openningCap) * 10n ** 14n : endingCap * 10n ** 14n;

    const initContribution = getInitContribution(type, startDate, endDate, centPrice);

    return ethInflow[type].capitalInUsd + initContribution - paidCap;
  }

  const profits = (type:number) => getProfits(type, startDate, endDate, centPrice, cbpInflow, cbpOutflow, ethInflow, ethOutflow, cbpToETH, weiToDust);

  const retainedEarnings = (type:number) => getRetainedEarnings(type, startDate, endDate, centPrice, cbpInflow, cbpOutflow, ethInflow, ethOutflow, cbpToETH, weiToDust);


  const ownersEquity = (type:number) => getOwnersEquity(type, startDate, endDate, centPrice, cbpInflow, cbpOutflow, ethInflow, ethOutflow, cbpToETH, weiToDust);

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
                  { showUSD(ownersEquity(1).inUsd)} 
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
                  { showUSD(profits(2).inUsd)} 
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                { showUSD(profits(2).inUsd)} 
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
                  -{ showUSD(ethOutflow[2].distributionInUsd)} 
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                -{ showUSD(ethOutflow[2].distributionInUsd)} 
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
                  { showUSD(getCapPremium(2))}
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
                  { showUSD(getCapPremium(3))}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                   { showUSD(retainedEarnings(3).inUsd)}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                  { showUSD(ownersEquity(3).inUsd)} 
                </Typography>
              </TableCell>

            </TableRow>

          </TableBody>

        </Table>



    </Paper>

  );   
}