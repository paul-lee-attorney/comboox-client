import { Box, Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { showUSD, weiToEth9Dec } from "../FinStatement";
import { baseToDollar, bigIntToStrNum } from "../../../common/toolsKit";
import { FtCbpflowSum } from "./Cashflow/FtCbpflow";
import { IncomeStatementProps } from "./IncomeStatement";
import { FtEthflowSum } from "./Cashflow/FtEthflow";
import { DepositsSum } from "./Cashflow/Deposits";

export interface CryptoInventoryProps extends IncomeStatementProps {
  ftCbpflow: FtCbpflowSum[],
  ftEthflow: FtEthflowSum[],
  deposits: DepositsSum[],
}


export function CryptoInventory({inETH, exRate, centPrice, startDate, endDate, display, ethInflow, ethOutflow, cbpInflow, cbpOutflow, ftCbpflow, ftEthflow, deposits}: CryptoInventoryProps) {

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

  const getMintToOthers = (type:number) => {
    let mintToOthers = cbpToETH(cbpOutflow[type].newUserAward + cbpOutflow[type].startupCost);
    let mintToOthersInUsd = cbpOutflow[type].newUserAwardInUsd + cbpOutflow[type].startupCostInUsd;

    return {inEth: mintToOthers, inUsd: mintToOthersInUsd};
  }

  const getCbpOfComp = (type:number) => {

    let cbpBalance = cbpToETH(cbpInflow[type].totalAmt - cbpOutflow[type].totalAmt) + getMintToOthers(type).inEth;
    let cbpBalanceInUsd = cbpInflow[type].sumInUsd - cbpOutflow[type].sumInUsd + getMintToOthers(type).inUsd;

    return {inEth: cbpBalance, inUsd: cbpBalanceInUsd};
  }


  const getCbpOfGK = (type:number) => {

    let inEth = getCbpOfComp(type).inEth - cbpToETH(ftCbpflow[type > 1 ? 3 : 1].totalCbp);
    let inUsd = getCbpOfComp(type).inUsd - ftCbpflow[type > 1 ? 3 : 1].totalCbpInUsd;

    return {inEth: inEth, inUsd: inUsd};
  }

  const getEthOfComp = (type:number) => {
    let ethBalance = ethInflow[type].totalAmt - ethOutflow[type].totalAmt;
    let ethBalanceInUsd = ethInflow[type].sumInUsd - ethOutflow[type].sumInUsd;

    return {inEth: ethBalance, inUsd: ethBalanceInUsd};
  }

  const getEthOfGK = (type:number) => {
    let ethBalance = getEthOfComp(type).inEth - ftEthflow[type > 1 ? 3 : 1].totalEth;
    let ethBalanceInUsd = getEthOfComp(type).inUsd - ftEthflow[type > 1 ? 3 : 1].totalEthInUsd;

    return {inEth: ethBalance, inUsd: ethBalanceInUsd};
  }

  const getIncreasedDeposits = (type:number) => {
    let inEth = deposits[type].consideration + deposits[type].balance + deposits[type].distribution;
    let inUsd = deposits[type].considerationInUsd + deposits[type].balanceInUsd + deposits[type].distributionInUsd;
    
    return {inEth: inEth, inUsd: inUsd}
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
          <b>Crypto Inventory Statement</b>
        </Typography>
      </Stack>

      <Stack direction='row' >

        <Paper elevation={3}
          sx={{
            m:1, p:1, border:1, 
            borderColor:'divider',
            width: '100%' 
          }} 
        >

        <Stack direction='row' sx={{ alignItems:'center' }} >
          <Typography variant='h6' sx={{ m:2, textDecoration:'underline'  }}  >
            CBP
          </Typography>
        </Stack>


          <Stack direction='column' sx={{ alignItems:'end' }} >
            <Stack direction='row' width='100%' >
              <Button 
                variant="outlined"
                fullWidth
                sx={{m:0.5, minWidth:288, justifyContent:'start'}}
              >
                <b>Beginning Value of CBP: ({ inETH
                    ? weiToEth9Dec(getCbpOfComp(1).inEth) 
                    : showUSD(getCbpOfComp(1).inUsd)})</b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' sx={{alignItems:'center'}} >
              <Typography variant="h6" textAlign='center' width='10%'>
                +
              </Typography>
              <Button 
                variant="outlined"
                fullWidth
                sx={{m:0.5, minWidth:288, justifyContent:'start'}}
                onClick={()=>display[0](2)}
              >
                <b>CBP Inflow: ({ inETH
                    ? weiToEth9Dec(cbpInflow[2].totalAmt) 
                    : showUSD(cbpInflow[2].sumInUsd)})</b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' sx={{alignItems:'center'}} >
              <Typography variant="h6" textAlign='center' width='10%'>
                +
              </Typography>

              <Button variant="outlined" sx={{width:'100%', m:0.5, justifyContent:'start'}} onClick={()=>display[1](2)} >
                <b>CBP Mint To Others: ({inETH ? weiToEth9Dec(getMintToOthers(2).inEth) : showUSD(getMintToOthers(2).inUsd)}) </b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
              <Typography variant="h6" textAlign='center' width='10%'>
                -
              </Typography>
              <Button variant="outlined" sx={{width:'100%', m:0.5, justifyContent:'start'}} onClick={()=>display[2](2)} >
                <b>CBP Outflow: ({inETH ? weiToEth9Dec(cbpToETH(cbpOutflow[2].totalAmt)) : showUSD(cbpOutflow[2].sumInUsd)}) </b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
              <Typography variant="h6" textAlign='center' width='20%'>
                &nbsp;
              </Typography>
              <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} >
                <b>CBP Of Comp: ({inETH ? weiToEth9Dec(getCbpOfComp(3).inEth) : showUSD(getCbpOfComp(3).inUsd)}) </b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
              <Typography variant="h6" textAlign='center' width='20%'>
                &nbsp;
              </Typography>
              <Typography variant="h6" textAlign='center' width='10%'>
                -
              </Typography>
              <Button variant="outlined" sx={{width:'100%', m:0.5, justifyContent:'start'}} onClick={()=>display[3](2)} >
                <b>CBP In Fuel Tank: ({inETH ? weiToEth9Dec(cbpToETH(ftCbpflow[3].totalCbp)) : showUSD(ftCbpflow[3].totalCbpInUsd)}) </b>
              </Button>
            </Stack>

            <Button variant="outlined" sx={{width: '70%', m:0.5, justifyContent:'start'}} >
              <b>CBP In GK: ({inETH ? weiToEth9Dec(getCbpOfGK(3).inEth) : showUSD(getCbpOfGK(3).inUsd)}) </b>
            </Button>

          </Stack>

        </Paper>

        <Paper elevation={3}
          sx={{
            m:1, p:1, border:1, 
            borderColor:'divider',
            width: '100%' 
          }} 
        >

          <Stack direction='row' sx={{ alignItems:'center' }} >
            <Typography variant='h6' sx={{ m:2, textDecoration:'underline'  }}  >
              ETH
            </Typography>
          </Stack>


          <Stack direction='column' sx={{ alignItems:'end' }} >

            <Stack direction='row' width='100%' >
              <Button 
                variant="outlined"
                fullWidth
                sx={{m:0.5, minWidth:288, justifyContent:'start'}}
              >
                <b>Beginning Value of ETH: ({ inETH
                    ? weiToEth9Dec(getEthOfComp(1).inEth) 
                    : showUSD(getEthOfComp(1).inUsd)})</b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
              <Typography variant="h6" textAlign='center' width='10%'>
                +
              </Typography>
              <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} onClick={()=>display[4](2)} >
                <b>ETH Inflow: ({inETH ? weiToEth9Dec(ethInflow[2].totalAmt) : showUSD(ethInflow[2].sumInUsd)}) </b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
              <Typography variant="h6" textAlign='center' width='10%'>
                -
              </Typography>
              <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} onClick={()=>display[5](2)} >
                <b>ETH Outflow: ({inETH ? weiToEth9Dec(ethOutflow[2].totalAmt) : showUSD(ethOutflow[2].sumInUsd)}) </b>
              </Button>

            </Stack>

            <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
              <Typography variant="h6" textAlign='center' width='20%'>
                &nbsp;
              </Typography>
              <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} >
                <b>ETH Of Comp: ({inETH ? weiToEth9Dec(getEthOfComp(3).inEth) : showUSD(getEthOfComp(3).inUsd)}) </b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
              <Typography variant="h6" textAlign='center' width='20%'>
                &nbsp;
              </Typography>
              <Typography variant="h6" textAlign='center' width='10%'>
                -
              </Typography>
              <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} onClick={()=>display[6](3)} >
                <b>ETH In Fuel Tank: ({inETH ? weiToEth9Dec(ftEthflow[3].totalEth) : showUSD(ftEthflow[3].totalEthInUsd)}) </b>
              </Button>
            </Stack>

            <Button variant="outlined" sx={{width: '70%', m:0.5, justifyContent:'start'}} >
              <b>ETH in GK: ({ inETH ? weiToEth9Dec(getEthOfGK(3).inEth) : showUSD(getEthOfGK(3).inUsd) }) </b>
            </Button>

          </Stack>

        </Paper>

        <Paper elevation={3}
          sx={{
            m:1, p:1, border:1, 
            borderColor:'divider',
            width: '100%' 
          }} 
        >

          <Stack direction='row' sx={{ alignItems:'center' }} >
            <Typography variant='h6' sx={{ m:2, textDecoration:'underline'  }}  >
              Deposits
            </Typography>
          </Stack>

          <Stack direction='column' sx={{ alignItems:'end' }} >

            <Stack direction='row' width='100%' >
              <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} >
                <b>Beginning Value of Deposits: ({inETH ? weiToEth9Dec(deposits[1].totalAmt) : showUSD(deposits[1].sumInUsd) }) </b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' >
              <Typography variant="h6" textAlign='center' width='10%'>
                +
              </Typography>
              <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} onClick={()=>display[7](2)} >
                <b>Deposits Inflow: ({inETH ? weiToEth9Dec(getIncreasedDeposits(2).inEth) : showUSD(getIncreasedDeposits(2).inUsd) }) </b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' >
              <Typography variant="h6" textAlign='center' width='10%'>
                -
              </Typography>
              <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} onClick={()=>display[9](2)} >
                <b>Deposits Outflow: ({inETH ? weiToEth9Dec(deposits[2].pickup) : showUSD(deposits[2].pickupInUsd) }) </b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' >
              <Typography variant="h6" textAlign='center' width='10%'>
                &nbsp;
              </Typography>
              <Typography variant="h6" textAlign='center' width='10%'>
                +
              </Typography>
              <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} onClick={()=>display[8](2)} >
                <b>Deposits in Custody: ({inETH ? weiToEth9Dec(deposits[2].custody) : showUSD(deposits[2].custodyInUsd) }) </b>
              </Button>
            </Stack>


            <Button variant="outlined" sx={{width: '70%', m:0.5, justifyContent:'start'}} >
              <b>Deposits Balance: ({inETH ? weiToEth9Dec(deposits[3].totalAmt) : showUSD(deposits[2].sumInUsd) }) </b>
            </Button>

          </Stack>

        </Paper>

      </Stack>

    </Paper>


  );   
}