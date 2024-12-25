import { Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { showUSD, weiToEth9Dec } from "../FinStatement";
import { getRetainedEarnings, IncomeStatementProps } from "./IncomeStatement";
import { useEffect, useState } from "react";
import { capAtDate } from "../../rom/rom";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { booxMap } from "../../../common";
import { usePublicClient } from "wagmi";
import {  getInitContribution, setUpDate } from "./Assets";
import { getOwnersEquity } from "./LiabilityAndEquity";

export function EquityChangeStatement({inETH, exRate, centPrice, startDate, endDate, display, ethInflow, ethOutflow, cbpInflow, cbpOutflow}: IncomeStatementProps) {

  const { boox } = useComBooxContext();

  const cbpToETH = (cbp:bigint) => {
    return cbp * 10000n / exRate;
  }

  const weiToDust = (eth:bigint) => {
    return eth * 10n ** 16n / centPrice;
  }

  const baseToWei = (bp:bigint) => {
    return bp * centPrice / 100n;
  }

  const baseToDust = (usd:bigint) => {
    return usd * 10n ** 14n;
  }

  // ---- Cap ----

  const [ opnClassA, setOpnClassA ] = useState(0n);
  const [ opnClassB, setOpnClassB ] = useState(0n);
  const [ endClassA, setEndClassA ] = useState(0n);
  const [ endClassB, setEndClassB ] = useState(0n);

  const client = usePublicClient();

  useEffect(()=>{

    const getPaidCap = async () =>{
      if (!boox) return;

      const blk = await client.getBlock();
      const curTime = Number(blk.timestamp);

      if (startDate > endDate || endDate > curTime) return;

      const initClassA = 25n*10n**8n;

      const opnCap = await capAtDate(boox[booxMap.ROM], startDate);
      const endCap = await capAtDate(boox[booxMap.ROM], endDate);

      if (endDate < setUpDate) {
        setOpnClassB(opnCap.paid);
        setEndClassB(endCap.paid);
      } else if (startDate < setUpDate && endDate >= setUpDate) {
        setOpnClassB(opnCap.paid);
        setEndClassA(initClassA);
        setEndClassB(endCap.paid - initClassA);
      } if (startDate >= setUpDate) {
        setOpnClassA(initClassA);
        setOpnClassB(opnCap.paid - initClassA);
        setEndClassA(initClassA);
        setEndClassB(endCap.paid - initClassA);
      }
      
    }

    getPaidCap();
  }, [startDate, endDate, client, boox]);

  // ---- Cap Premium ----
  

  const getCapPremium = (type:number)=> {
    const paidCap = type == 1
        ? baseToDust(opnClassA + opnClassB)
        : type == 2 
            ? baseToDust(endClassA + endClassB - opnClassA - opnClassB) 
            : baseToDust(endClassA + endClassB);

    const initContribution = getInitContribution(type, startDate, endDate);

    const inEth = ethInflow[type].capital + baseToWei(initContribution - paidCap);
    const inUsd = ethInflow[type].capitalInUsd + baseToDust(initContribution - paidCap);

    return {inEth: inEth, inUsd: inUsd};
  }

  const retainedEarnings = (type:number) => getRetainedEarnings(type, startDate, endDate, centPrice, cbpInflow, cbpOutflow, ethInflow, ethOutflow, cbpToETH, weiToDust);


  const ownersEquity = (type:number) => getOwnersEquity(type, startDate, endDate, centPrice, cbpInflow, cbpOutflow, ethInflow, ethOutflow, cbpToETH, baseToWei, weiToDust);

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
                  <b>Class A (Paid In Capital)</b>
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='body1'>
                  <b>Class B (Paid In Capital)</b>
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='body1'>
                  <b>Additional Paid In Capital</b>
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
                  { inETH
                    ? weiToEth9Dec(baseToWei(opnClassA))
                    : showUSD(baseToDust(opnClassA)) }
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                { inETH
                    ? weiToEth9Dec(baseToWei(opnClassB))
                    : showUSD(baseToDust(opnClassB)) }
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                  { inETH
                    ? weiToEth9Dec(getCapPremium(1).inEth)
                    : showUSD(getCapPremium(1).inUsd) }
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                  { inETH
                    ? weiToEth9Dec(retainedEarnings(1).inEth)
                    : showUSD(retainedEarnings(1).inUsd) }
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                  { inETH
                    ? weiToEth9Dec(ownersEquity(1).inEth)
                    : showUSD(ownersEquity(1).inUsd) }
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
                  -
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                  -
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                  -
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                  { inETH
                    ? weiToEth9Dec(retainedEarnings(2).inEth)
                    : showUSD(retainedEarnings(2).inUsd) }
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                  { inETH
                    ? weiToEth9Dec(retainedEarnings(2).inEth)
                    : showUSD(retainedEarnings(2).inUsd) }
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
                  -
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                  -
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                  -
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                  -{  inETH
                      ? weiToEth9Dec(ethOutflow[2].distribution)
                      : showUSD(ethOutflow[2].distributionInUsd) } 
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                  -{  inETH
                      ? weiToEth9Dec(ethOutflow[2].distribution)
                      : showUSD(ethOutflow[2].distributionInUsd) } 
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
                { inETH
                  ? weiToEth9Dec(baseToWei(endClassA - opnClassA))
                  : showUSD(baseToDust(endClassA - opnClassA)) } 
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                { inETH
                  ? weiToEth9Dec(baseToWei(endClassB - opnClassB))
                  : showUSD(baseToDust(endClassB - opnClassB)) } 
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                { inETH
                  ? weiToEth9Dec(getCapPremium(2).inEth)
                  : showUSD(getCapPremium(2).inUsd) } 
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                  -
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                  { inETH
                    ? weiToEth9Dec(ownersEquity(2).inEth)
                    : showUSD(ownersEquity(2).inUsd)} 
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
                  { inETH
                    ? weiToEth9Dec(baseToWei(endClassA))
                    : showUSD(baseToDust(endClassA)) }
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                  { inETH
                    ? weiToEth9Dec(baseToWei(endClassB))
                    : showUSD(baseToDust(endClassB)) }
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                  { inETH
                    ? weiToEth9Dec(getCapPremium(3).inEth)
                    : showUSD(getCapPremium(3).inUsd)}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                  { inETH
                    ? weiToEth9Dec(retainedEarnings(3).inEth)
                    : showUSD(retainedEarnings(3).inUsd)}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant='body1'>
                { inETH
                    ? weiToEth9Dec(ownersEquity(3).inEth)
                    : showUSD(ownersEquity(3).inUsd) }
                </Typography>
              </TableCell>

            </TableRow>

          </TableBody>

        </Table>

    </Paper>

  );   
}