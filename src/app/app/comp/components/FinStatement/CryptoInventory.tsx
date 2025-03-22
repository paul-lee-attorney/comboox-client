import { Button, Paper, Stack, Typography } from "@mui/material";
import { showUSD, weiToEth9Dec } from "../FinStatement";
import { baseToDollar } from "../../../common/toolsKit";
import { FtCbpflowSum } from "./Cashflow/FtCbpflow";
import { IncomeStatementProps } from "./IncomeStatement";
import { FtEthflowSum } from "./Cashflow/FtEthflow";
import { DepositsSum } from "./Cashflow/Deposits";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { usePublicClient } from "wagmi";
import { useEffect, useState } from "react";
import { AddrOfTank } from "../../../common";
import { totalDeposits } from "../../gk";
import { balanceOf } from "../../../rc";

export interface CryptoInventoryProps extends IncomeStatementProps {
  ftCbpflow: FtCbpflowSum[],
  ftEthflow: FtEthflowSum[],
  deposits: DepositsSum[],
}

interface Balance {
  opnAmt: bigint;
  endAmt: bigint;
}

const defBala:Balance = {
  opnAmt: 0n,
  endAmt: 0n,
}


export function CryptoInventory({inETH, exRate, centPrice, opnBlkNo, rptBlkNo, display, ethInflow, ethOutflow, cbpInflow, cbpOutflow, ftCbpflow, ftEthflow, deposits}: CryptoInventoryProps) {

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

  const { gk } = useComBooxContext();
  const client = usePublicClient();

  const [ ethOfGK, setEthOfGK ] = useState({...defBala});

  useEffect(()=>{
    const getEthOfGK = async ()=>{
      if (!gk) return {...defBala};

      const opnBalaOfGK = await client.getBalance({
        address: gk,
        blockNumber: opnBlkNo,
      });

      const endBalaOfGK = await client.getBalance({
        address: gk,
        blockNumber: rptBlkNo,
      });

      const opnDep = await totalDeposits(gk, opnBlkNo);
      const endDep = await totalDeposits(gk, rptBlkNo);

      const output:Balance = {
        opnAmt: opnBalaOfGK - opnDep,
        endAmt: endBalaOfGK - endDep,
      }

      return output;
    }

    getEthOfGK().then(
      res => setEthOfGK(res)
    );

  }, [opnBlkNo, rptBlkNo, gk, client]);

  const [ ethOfFT, setEthOfFT ] = useState({...defBala});

  useEffect(()=>{
    const getEthOfFT = async ()=>{
      if (!gk) return {...defBala};

      const opnBalaOfFT = await client.getBalance({
        address: AddrOfTank,
        blockNumber: opnBlkNo,
      });

      const endBalaOfFT = await client.getBalance({
        address: AddrOfTank,
        blockNumber: rptBlkNo,
      });

      const output:Balance = {
        opnAmt: opnBalaOfFT,
        endAmt: endBalaOfFT,
      }

      return output;
    }

    getEthOfFT().then(
      res => setEthOfFT(res)
    );

  }, [opnBlkNo, rptBlkNo, gk, client]);

  const ethOfComp:Balance = {
    opnAmt: ethOfGK.opnAmt + ethOfFT.opnAmt,
    endAmt: ethOfGK.endAmt + ethOfFT.endAmt,
  } 

  const [ cbpOfGK, setCbpOfGK ] = useState({...defBala});

  useEffect(()=>{
    const getCbpOfGK = async ()=>{
      if (!gk) return {...defBala};

      const opnBalaOfGK = await balanceOf(gk, opnBlkNo);
      const endBalaOfGK = await balanceOf(gk, rptBlkNo);

      const output:Balance = {
        opnAmt: opnBalaOfGK,
        endAmt: endBalaOfGK,
      }

      return output;
    }

    getCbpOfGK().then(
      res => setCbpOfGK(res)
    );

  }, [opnBlkNo, rptBlkNo, gk, client]);

  const [ cbpOfFT, setCbpOfFT ] = useState({...defBala});

  useEffect(()=>{
    const getCbpOfFT = async ()=>{
      if (!gk) return {...defBala};

      const opnBalaOfFT = await balanceOf(AddrOfTank, opnBlkNo);
      const endBalaOfFT = await balanceOf(AddrOfTank, rptBlkNo);

      const output:Balance = {
        opnAmt: opnBalaOfFT,
        endAmt: endBalaOfFT,
      }

      return output;
    }

    getCbpOfFT().then(
      res => setCbpOfFT(res)
    );

  }, [opnBlkNo, rptBlkNo, gk, client]);

  const cbpOfComp:Balance = {
    opnAmt: cbpOfGK.opnAmt + cbpOfFT.opnAmt,
    endAmt: cbpOfGK.endAmt + cbpOfFT.endAmt,
  } 

  const [ dep, setDep ] = useState({...defBala});

  useEffect(()=>{
    const getDepOfComp = async ()=>{
      if (!gk) return {...defBala};

      const opnDep = await totalDeposits(gk, opnBlkNo);
      const endDep = await totalDeposits(gk, rptBlkNo);

      const output:Balance = {
        opnAmt: opnDep,
        endAmt: endDep,
      }

      return output;
    }

    getDepOfComp().then(
      res => setDep(res)
    );

  }, [opnBlkNo, rptBlkNo, gk, client]);

  const getMintToOthers = (type:number) => {
    const mintToOthers = cbpToETH(cbpOutflow[type].newUserAward + cbpOutflow[type].startupCost);
    const mintToOthersInUsd = weiToDust(mintToOthers);

    return {inEth: mintToOthers, inUsd: mintToOthersInUsd};
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
                    ? weiToEth9Dec(cbpOfComp.opnAmt)
                    : showUSD(weiToDust(cbpToETH(cbpOfComp.opnAmt)))})</b>
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
                    : showUSD(weiToDust(cbpToETH(cbpInflow[2].totalAmt)))})</b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' sx={{alignItems:'center'}} >
              <Typography variant="h6" textAlign='center' width='10%'>
                +
              </Typography>

              <Button variant="outlined" sx={{width:'100%', m:0.5, justifyContent:'start'}} onClick={()=>display[1](2)} >
                <b>CBP Mint To Others: ({inETH 
                    ? weiToEth9Dec(getMintToOthers(2).inEth)
                    : showUSD(weiToDust(cbpToETH(getMintToOthers(2).inEth)))}) </b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
              <Typography variant="h6" textAlign='center' width='10%'>
                -
              </Typography>
              <Button variant="outlined" sx={{width:'100%', m:0.5, justifyContent:'start'}} onClick={()=>display[2](2)} >
                <b>CBP Outflow: ({inETH 
                    ? weiToEth9Dec(cbpOutflow[2].totalAmt) 
                    : showUSD(weiToDust(cbpToETH(cbpOutflow[2].totalAmt)))}) </b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
              <Typography variant="h6" textAlign='center' width='20%'>
                &nbsp;
              </Typography>
              <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} >
                <b>CBP Of Comp: ({inETH 
                  ? weiToEth9Dec(cbpOfComp.endAmt) 
                  : showUSD(weiToDust(cbpToETH(cbpOfComp.endAmt)))}) </b>
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
                <b>CBP In Fuel Tank: ({inETH 
                    ? weiToEth9Dec(cbpOfFT.endAmt) 
                    : showUSD(weiToDust(cbpOfFT.endAmt))}) </b>
              </Button>
            </Stack>

            <Button variant="outlined" sx={{width: '70%', m:0.5, justifyContent:'start'}} >
              <b>CBP In GK: ({inETH 
                  ? weiToEth9Dec(cbpOfGK.endAmt) 
                  : showUSD(weiToDust(cbpOfGK.endAmt))}) </b>
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
                    ? weiToEth9Dec(ethOfComp.opnAmt) 
                    : showUSD(weiToDust(ethOfComp.opnAmt))})</b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
              <Typography variant="h6" textAlign='center' width='10%'>
                +
              </Typography>
              <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} onClick={()=>display[4](2)} >
                <b>ETH Inflow: ({inETH 
                    ? weiToEth9Dec(ethInflow[2].totalAmt) 
                    : showUSD(weiToDust(ethInflow[2].totalAmt))}) </b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
              <Typography variant="h6" textAlign='center' width='10%'>
                -
              </Typography>
              <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} onClick={()=>display[5](2)} >
                <b>ETH Outflow: ({inETH 
                    ? weiToEth9Dec(ethOutflow[2].totalAmt) 
                    : showUSD(weiToDust(ethOutflow[2].totalAmt))}) </b>
              </Button>

            </Stack>

            <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
              <Typography variant="h6" textAlign='center' width='20%'>
                &nbsp;
              </Typography>
              <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} >
                <b>ETH Of Comp: ({inETH 
                  ? weiToEth9Dec(ethOfComp.endAmt) 
                  : showUSD(weiToDust(ethOfComp.endAmt))}) </b>
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
                <b>ETH In Fuel Tank: ({inETH 
                    ? weiToEth9Dec(ethOfFT.endAmt) 
                    : showUSD(weiToDust(ethOfFT.endAmt))}) </b>
              </Button>
            </Stack>

            <Button variant="outlined" sx={{width: '70%', m:0.5, justifyContent:'start'}} >
              <b>ETH in GK: ({ inETH 
                  ? weiToEth9Dec(ethOfGK.endAmt) 
                  : showUSD(weiToDust(ethOfGK.endAmt)) }) </b>
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
                <b>Beginning Value of Deposits: ({inETH 
                    ? weiToEth9Dec(dep.opnAmt) 
                    : showUSD(weiToDust(dep.opnAmt)) }) </b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' >
              <Typography variant="h6" textAlign='center' width='10%'>
                +
              </Typography>
              <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} onClick={()=>display[7](2)} >
                <b>Deposits Inflow: ({inETH 
                    ? weiToEth9Dec(getIncreasedDeposits(2).inEth) 
                    : showUSD(weiToDust(getIncreasedDeposits(2).inEth)) }) </b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' >
              <Typography variant="h6" textAlign='center' width='10%'>
                -
              </Typography>
              <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} onClick={()=>display[9](2)} >
                <b>Deposits Outflow: ({inETH 
                    ? weiToEth9Dec(deposits[2].pickup) 
                    : showUSD(weiToDust(deposits[2].pickup)) }) </b>
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
                <b>Deposits in Custody: ({inETH 
                    ? weiToEth9Dec(deposits[2].custody) 
                    : showUSD(weiToDust(deposits[2].custody)) }) </b>
              </Button>
            </Stack>


            <Button variant="outlined" sx={{width: '70%', m:0.5, justifyContent:'start'}} >
              <b>Deposits Balance: ({inETH 
                  ? weiToEth9Dec(dep.endAmt) 
                  : showUSD(weiToDust(dep.endAmt)) }) </b>
            </Button>

          </Stack>

        </Paper>

      </Stack>

    </Paper>

  );   
}