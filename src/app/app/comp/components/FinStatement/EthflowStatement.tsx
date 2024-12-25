import { Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { showUSD, weiToEth9Dec } from "../FinStatement";
import { FtCbpflowSum } from "./Cashflow/FtCbpflow";
import { IncomeStatementProps } from "./IncomeStatement";
import { FtEthflowSum } from "./Cashflow/FtEthflow";
import { DepositsSum } from "./Cashflow/Deposits";

export interface CryptoflowStatementProps extends IncomeStatementProps {
  ftCbpflow: FtCbpflowSum[],
  ftEthflow: FtEthflowSum[],
  deposits: DepositsSum[],
}


export function EthflowStatement({inETH, exRate, centPrice, startDate, endDate, display, ethInflow, ethOutflow, cbpInflow, cbpOutflow, ftCbpflow, ftEthflow, deposits}: CryptoflowStatementProps) {
  
  // ==== Oerating Activity ====

  const getEthPayment = () => {
    const inEth = ethOutflow[2].bmmTransfer + ethOutflow[2].gmmTransfer + ethOutflow[2].bmmExpense + ethOutflow[2].gmmExpense;
    const inUsd = ethOutflow[2].gmmTransferInUsd + ethOutflow[2].gmmTransferInUsd + ethOutflow[2].gmmExpenseInUsd + ethOutflow[2].gmmExpenseInUsd;

    return({inEth: inEth, inUsd: inUsd});
  }
  const getEthInflowFromOperating = () => {
    const inEth = ethInflow[2].gas + ethInflow[2].transfer - getEthPayment().inEth;
    const inUsd = ethInflow[2].gasInUsd + ethInflow[2].transferInUsd - getEthPayment().inUsd;

    return ({inEth: inEth, inUsd: inUsd});
  }

  // ---- Financing ----

  const getNetEthOfFinancing = () => {
    const inEth = ethInflow[2].capital - ethOutflow[2].distribution;
    const inUsd = ethInflow[2].capitalInUsd - ethOutflow[2].distributionInUsd;

    return ({inEth: inEth, inUsd:inUsd});
  }

  // ==== Sum ====

  const getNetIncreaseOfEth = () => {
    const inEth = getEthInflowFromOperating().inEth + getNetEthOfFinancing().inEth;
    const inUsd = getEthInflowFromOperating().inUsd + getNetEthOfFinancing().inUsd;

    return ({inEth: inEth, inUsd: inUsd});
  }

  return(

    <Paper elevation={3} 
      sx={{
        m:1, p:1, border:1, 
        borderColor:'divider',
        width: '100%',
      }} 
    >

      <Stack direction='row' sx={{ alignItems:'center' }} >
        <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
          <b>ETH Flow Statement</b>
        </Typography>
      </Stack>

      <Stack direction='column' sx={{ alignItems:'end' }} >

        <Stack direction='row' width='100%' sx={{alignItems:'center'}} >
          <Typography variant="h6" textAlign='center' width='10%'>
            +
          </Typography>
          <Button variant="outlined" sx={{width:'100%', m:0.5, justifyContent:'start'}}>
            <b>Increased Deferred Revenue: ({inETH 
                ? weiToEth9Dec(ethInflow[2].gas) 
                : showUSD(ethInflow[2].gasInUsd)}) </b>
          </Button>
        </Stack>

        <Stack direction='row' width='100%' sx={{alignItems:'center'}} >
          <Typography variant="h6" textAlign='center' width='10%'>
            +
          </Typography>
          <Button variant="outlined" sx={{width:'100%', m:0.5, justifyContent:'start'}}>
            <b>Other Income: ({inETH 
                ? weiToEth9Dec(ethInflow[2].transfer) 
                : showUSD(ethInflow[2].transferInUsd)}) </b>
          </Button>
        </Stack>

        <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
          <Typography variant="h6" textAlign='center' width='10%'>
            -
          </Typography>
          <Button variant="outlined" sx={{width:'100%', m:0.5, justifyContent:'start'}} >
            <b>Sales, General And Administrative: ({inETH 
                ? weiToEth9Dec(getEthPayment().inEth) 
                : showUSD(getEthPayment().inUsd)}) </b>
          </Button>
        </Stack>

        <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
          <Typography variant="h6" textAlign='center' width='20%'>
            &nbsp;
          </Typography>
          <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} >
            <b>Net Inflow from Operating Activities: ({inETH 
                ? weiToEth9Dec(getEthInflowFromOperating().inEth) 
                : showUSD(getEthInflowFromOperating().inUsd)}) </b>
          </Button>
        </Stack>

      </Stack>

      <Divider orientation="horizontal"  sx={{ my:2, color:'blue' }} flexItem  />

      <Stack direction='column' sx={{ alignItems:'end' }} >

        <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
          <Typography variant="h6" textAlign='center' width='10%'>
            -
          </Typography>
          <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} >
            <b>Purchase Of IPR: ({inETH 
                ? weiToEth9Dec(0n) 
                : showUSD(0n)}) </b>
          </Button>
        </Stack>

        <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
          <Typography variant="h6" textAlign='center' width='20%'>
            &nbsp;
          </Typography>
          <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} >
            <b>Net Outflow for Investing Activities: ({inETH 
                ? weiToEth9Dec(0n) 
                : showUSD(0n)}) </b>
          </Button>
        </Stack>

      </Stack>

      <Divider orientation="horizontal"  sx={{ my:2, color:'blue' }} flexItem  />

      <Stack direction='column' sx={{ alignItems:'end' }} >

        <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
          <Typography variant="h6" textAlign='center' width='10%'>
            +
          </Typography>
          <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} >
            <b>Proceeds from Share Issuance: ({inETH 
                ? weiToEth9Dec(ethInflow[2].capital) 
                : showUSD(ethInflow[2].capitalInUsd)}) </b>
          </Button>
        </Stack>

        <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
          <Typography variant="h6" textAlign='center' width='10%'>
            -
          </Typography>
          <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} >
            <b>Distribution: ({inETH 
                ? weiToEth9Dec(ethOutflow[2].distribution) 
                : showUSD(ethOutflow[2].distributionInUsd)}) </b>
          </Button>
        </Stack>

        <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
          <Typography variant="h6" textAlign='center' width='20%'>
            &nbsp;
          </Typography>
          <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} >
            <b>Net Inflow from Financing Activities: ({inETH 
                ? weiToEth9Dec(getNetEthOfFinancing().inEth) 
                : showUSD(getNetEthOfFinancing().inUsd)}) </b>
          </Button>
        </Stack>

      </Stack>

      <Divider orientation="horizontal"  sx={{ my:2, color:'blue' }} flexItem  />

      <Stack direction='column' sx={{ alignItems:'end' }} >

        <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
          <Typography variant="h6" textAlign='center' width='20%'>
            &nbsp;
          </Typography>
          <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} >
            <b>Net Inflow of ETH: ({inETH 
                ? weiToEth9Dec(getNetIncreaseOfEth().inEth) 
                : showUSD(getNetIncreaseOfEth().inUsd)}) </b>
          </Button>
        </Stack>

      </Stack>    
    </Paper>
  );   
}