import { Button, Paper, Stack, Typography } from "@mui/material";
import { showUSD, weiToEth9Dec } from "../FinStatement";
import { baseToDollar } from "../../../common/toolsKit";
import { FtCbpflowSum, ftHis } from "./Cashflow/FtCbpflow";
import { IncomeStatementProps } from "./IncomeStatement";
import { FtEthflowSum } from "./Cashflow/FtEthflow";
import { DepositsSum } from "./Cashflow/Deposits";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { usePublicClient } from "wagmi";
import { useEffect, useState } from "react";
import { AddrOfTank, booxMap } from "../../../common";
import { totalDeposits } from "../../gk";
import { balanceOf } from "../../../rc";
import { UsdEscrowSum } from "./Cashflow/UsdEscrow";
import { balanceOfComp, totalEscrow, totalUsdDeposits } from "../../cashier";
import { getUsdOfComp } from "./Assets";

export interface CryptoInventoryProps extends IncomeStatementProps {
  ftCbpflow: FtCbpflowSum[],
  ftEthflow: FtEthflowSum[],
  deposits: DepositsSum[],
  usdEscrow: UsdEscrowSum[]
}

interface Balance {
  opnAmt: bigint;
  endAmt: bigint;
}

const defBala:Balance = {
  opnAmt: 0n,
  endAmt: 0n,
}


export function CryptoInventory({inETH, exRate, centPrice, opnBlkNo, rptBlkNo, display, ethInflow, ethOutflow, cbpInflow, cbpOutflow, usdInflow, usdOutflow, ftCbpflow, ftEthflow, deposits, usdEscrow}: CryptoInventoryProps) {

  // const cbpToETH = (cbp:bigint) => {
  //   return cbp * 10000n / exRate;
  // }

  const weiToBP = (eth:bigint) => {
    return eth * 100n / centPrice;
  }

  const weiToDust = (eth:bigint) => {
    return eth * 10n ** 16n / centPrice;
  }

  const weiToUSD = (eth:bigint) => {
    return baseToDollar(weiToBP(eth).toString()) + ' USD';
  }

  const microToWei = (usd:bigint) => {
    return usd * centPrice / 10000n;
  }

  const leeToWei = (cbp:bigint) => {
    return cbp * exRate * centPrice / 10n ** 22n;
  }

  const microToDust = (usd:bigint) => {
    return usd * 10n ** 12n;
  }

  const leeToDust = (cbp:bigint) => {
    return cbp * exRate / 10n ** 6n;
  }


  const { gk, boox } = useComBooxContext();
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

  // const [ ethOfFT, setEthOfFT ] = useState({...defBala});

  // useEffect(()=>{
  //   const getEthOfFT = async ()=>{
  //     if (!gk) return {...defBala};

  //     const opnBalaOfFT = await client.getBalance({
  //       address: AddrOfTank,
  //       blockNumber: opnBlkNo,
  //     });

  //     const endBalaOfFT = await client.getBalance({
  //       address: AddrOfTank,
  //       blockNumber: rptBlkNo,
  //     });

  //     const output:Balance = {
  //       opnAmt: opnBalaOfFT,
  //       endAmt: endBalaOfFT,
  //     }

  //     return output;
  //   }

  //   getEthOfFT().then(
  //     res => setEthOfFT(res)
  //   );

  // }, [opnBlkNo, rptBlkNo, gk, client]);

  // const ethOfComp:Balance = {
  //   opnAmt: ethOfGK.opnAmt + ethOfFT.opnAmt,
  //   endAmt: ethOfGK.endAmt + ethOfFT.endAmt,
  // } 

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

  }, [opnBlkNo, rptBlkNo, gk]);

  const [ cbpOfFT, setCbpOfFT ] = useState({...defBala});

  useEffect(()=>{
    const getCbpOfFT = async ()=>{
      if (!gk) return {...defBala};

      // const opnBalaOfFtHis0 = await balanceOf(ftHis[0], opnBlkNo);
      // const opnBalaOfFtHis1 = await balanceOf(ftHis[1], opnBlkNo);
      // const opnBalaOfFtHis2 = await balanceOf(ftHis[2], opnBlkNo);

      const opnBalaOfFT = await balanceOf(AddrOfTank, opnBlkNo);

      // const endBalaOfFtHis0 = await balanceOf(ftHis[0], rptBlkNo);
      // const endBalaOfFtHis1 = await balanceOf(ftHis[1], rptBlkNo);
      // const endBalaOfFtHis2 = await balanceOf(ftHis[2], rptBlkNo);

      const endBalaOfFT = await balanceOf(AddrOfTank, opnBlkNo);

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

  }, [opnBlkNo, rptBlkNo, gk]);

  const getMintToOthers = (type:number) => {
    const mintToOthers = leeToWei(cbpOutflow[type].newUserAward + cbpOutflow[type].startupCost);
    const mintToOthersInUsd = leeToDust(cbpOutflow[type].newUserAward + cbpOutflow[type].startupCost);

    return {inEth: mintToOthers, inUsd: mintToOthersInUsd};
  }

  const getIncreasedDeposits = (type:number) => {
    let inEth = deposits[type].consideration + deposits[type].balance + deposits[type].distribution;
    let inUsd = weiToDust(inEth);
    
    return {inEth: inEth, inUsd: inUsd}
  }

  const usdOfComp = (type:number) => {
    const inUsd = usdInflow[type].totalAmt - usdOutflow[type].totalAmt;
    return inUsd;    
  }

  // const [ usdOfComp, setUsdOfComp ] = useState({...defBala});

  // useEffect(()=>{
  //   const getUsdOfComp = async ()=>{
  //     if (!boox) return {...defBala};

  //     const cashier = boox[booxMap.ROI];

  //     const opnBalaOfUsd = await balanceOfComp(cashier, opnBlkNo);
  //     const endBalaOfUsd = await balanceOfComp(cashier, rptBlkNo);

  //     const output:Balance = {
  //       opnAmt: opnBalaOfUsd,
  //       endAmt: endBalaOfUsd,
  //     }

  //     return output;
  //   }

  //   getUsdOfComp().then(
  //     res => setUsdOfComp(res)
  //   );

  // }, [opnBlkNo, rptBlkNo, boox]);

  const [ esc, setEsc ] = useState({...defBala});
  const [ depOfUsd, setDepOfUsd ] = useState({...defBala});

  useEffect(()=>{
    const getEscOfUsd = async ()=>{
      if (!boox) return {...defBala};

      const cashier = boox[booxMap.ROI];

      const opnEsc = await totalEscrow(cashier, opnBlkNo);
      const endEsc = await totalEscrow(cashier, rptBlkNo);

      const output:Balance = {
        opnAmt: opnEsc,
        endAmt: endEsc,
      }

      setEsc(output);
    }

    const getDepOfUsd = async ()=>{
      if (!boox) return {...defBala};

      const cashier = boox[booxMap.ROI];

      const opnDep = await totalUsdDeposits(cashier, opnBlkNo);
      const endDep = await totalUsdDeposits(cashier, rptBlkNo);

      const output:Balance = {
        opnAmt: opnDep,
        endAmt: endDep,
      }

      setDepOfUsd(output);
    }

    getEscOfUsd();
    getDepOfUsd();

  }, [opnBlkNo, rptBlkNo, boox]);

  const usdEscInflow = usdEscrow[2].escrow + usdEscrow[2].forward;
  const usdEscOutflow = usdEscrow[2].consideration + usdEscrow[2].balance + usdEscrow[2].forward;

  const usdDepInflow = usdEscrow[2].distribution;
  const usdDepOutflow = usdEscrow[2].pickup;

  return(

    <Paper elevation={3} sx={{m:1, p:1, border:1, borderColor:'divider', width:'100%' }}>

      <Stack direction='row' sx={{ alignItems:'center' }} >
        <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
          <b>Crypto Inventory Statement</b>
        </Typography>
      </Stack>

      <Stack direction='row' >

        <Paper elevation={3} sx={{m:1, p:1, border:1, borderColor:'divider', width:'100%' }}>

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
                    : showUSD(leeToDust(cbpOfComp.opnAmt))})</b>
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
                    : showUSD(leeToDust(cbpInflow[2].totalAmt))})</b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' sx={{alignItems:'center'}} >
              <Typography variant="h6" textAlign='center' width='10%'>
                +
              </Typography>

              <Button variant="outlined" sx={{width:'100%', m:0.5, justifyContent:'start'}} onClick={()=>display[1](2)} >
                <b>CBP Mint To Others: ({inETH 
                    ? weiToEth9Dec(getMintToOthers(2).inEth)
                    : showUSD(leeToDust(getMintToOthers(2).inEth))}) </b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
              <Typography variant="h6" textAlign='center' width='10%'>
                -
              </Typography>
              <Button variant="outlined" sx={{width:'100%', m:0.5, justifyContent:'start'}} onClick={()=>display[2](2)} >
                <b>CBP Outflow: ({inETH 
                    ? weiToEth9Dec(cbpOutflow[2].totalAmt) 
                    : showUSD(leeToDust(cbpOutflow[2].totalAmt))}) </b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
              <Typography variant="h6" textAlign='center' width='20%'>
                &nbsp;
              </Typography>
              <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} >
                <b>CBP Of Comp: ({inETH 
                  ? weiToEth9Dec(cbpOfComp.endAmt) 
                  : showUSD(leeToDust(cbpOfComp.endAmt))}) </b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
              <Typography variant="h6" textAlign='center' width='20%'>
                &nbsp;
              </Typography>
              <Typography variant="h6" textAlign='center' width='10%'>
                -
              </Typography>
              <Button variant="outlined" sx={{width:'100%', m:0.5, justifyContent:'start'}} onClick={()=>display[3](3)} >
                <b>CBP In Fuel Tank: ({inETH 
                    ? weiToEth9Dec(cbpOfFT.endAmt) 
                    : showUSD(leeToDust(cbpOfFT.endAmt))}) </b>
              </Button>
            </Stack>

            <Button variant="outlined" sx={{width: '70%', m:0.5, justifyContent:'start'}} >
              <b>CBP In GK: ({inETH 
                  ? weiToEth9Dec(cbpOfGK.endAmt) 
                  : showUSD(leeToDust(cbpOfGK.endAmt))}) </b>
            </Button>

          </Stack>

        </Paper>

        <Paper elevation={3} sx={{m:1, p:1, border:1, borderColor:'divider', width:'100%' }}>

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
                    ? weiToEth9Dec(ethOfGK.opnAmt) 
                    : showUSD(weiToDust(ethOfGK.opnAmt))})</b>
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
                  ? weiToEth9Dec(ethOfGK.endAmt) 
                  : showUSD(weiToDust(ethOfGK.endAmt))}) </b>
              </Button>
            </Stack>

            {/* <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
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
            </Button> */}

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
              ETH Deposits
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

      <Stack direction='row' >

        <Paper elevation={3} sx={{m:1, p:1, border:1, borderColor:'divider', width:'100%' }}>
  
          <Stack direction='row' sx={{ alignItems:'center' }} >
            <Typography variant='h6' sx={{ m:2, textDecoration:'underline'  }}  >
              USDC
            </Typography>
          </Stack>

          <Stack direction='column' sx={{ alignItems:'end' }} >
            <Stack direction='row' width='100%' >
              <Button 
                variant="outlined"
                fullWidth
                sx={{m:0.5, minWidth:288, justifyContent:'start'}}
              >
                <b>Beginning Value of USDC: ({ inETH
                    ? weiToEth9Dec(microToWei(usdOfComp(1)))
                    : showUSD(microToDust(usdOfComp(1)))})</b>
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
                onClick={()=>display[10](2)}
              >
                <b>USDC Inflow: ({ inETH
                    ? weiToEth9Dec(microToWei(usdInflow[2].totalAmt)) 
                    : showUSD(microToDust(usdInflow[2].totalAmt))})</b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
              <Typography variant="h6" textAlign='center' width='10%'>
                -
              </Typography>
              <Button variant="outlined" sx={{width:'100%', m:0.5, justifyContent:'start'}} onClick={()=>display[11](2)} >
                <b>USDC Outflow: ({inETH 
                    ? weiToEth9Dec(microToWei(usdOutflow[2].totalAmt)) 
                    : showUSD(microToDust(usdOutflow[2].totalAmt))}) </b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
              <Typography variant="h6" textAlign='center' width='20%'>
                &nbsp;
              </Typography>
              <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} >
                <b>USDC Of Comp: ({inETH 
                  ? weiToEth9Dec(microToWei(usdOfComp(3))) 
                  : showUSD(microToDust(usdOfComp(3)))}) </b>
              </Button>
            </Stack>
          </Stack>

        </Paper>

        <Paper elevation={3} sx={{m:1, p:1, border:1, borderColor:'divider', width:'100%' }}>

          <Stack direction='row' sx={{ alignItems:'center' }} >
            <Typography variant='h6' sx={{ m:2, textDecoration:'underline'  }}  >
              USDC Escrow
            </Typography>
          </Stack>

          <Stack direction='column' sx={{ alignItems:'end' }} >

            <Stack direction='row' width='100%' >
              <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} >
                <b>Beginning Value of Escrow: ({inETH 
                    ? weiToEth9Dec(microToWei(esc.opnAmt)) 
                    : showUSD(microToDust(esc.opnAmt)) }) </b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' >
              <Typography variant="h6" textAlign='center' width='10%'>
                +
              </Typography>
              <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} onClick={()=>display[12](2)} >
                <b>Escrow Inflow: ({inETH 
                    ? weiToEth9Dec(microToWei(usdEscInflow)) 
                    : showUSD(microToDust(usdEscInflow)) }) </b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' >
              <Typography variant="h6" textAlign='center' width='10%'>
                -
              </Typography>
              <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} onClick={()=>display[13](2)}  >
                <b>Escrow Outflow: ({inETH 
                    ? weiToEth9Dec(microToWei(usdEscOutflow)) 
                    : showUSD(microToDust(usdEscOutflow)) }) </b>
              </Button>
            </Stack>


            <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
              <b>Escrow Balance: ({inETH 
                  ? weiToEth9Dec(microToWei(esc.endAmt)) 
                  : showUSD(microToDust(esc.endAmt)) }) </b>
            </Button>

          </Stack>

        </Paper>

        <Paper elevation={3} sx={{m:1, p:1, border:1, borderColor:'divider', width:'100%' }}>
          
          <Stack direction='row' sx={{ alignItems:'center' }} >
            <Typography variant='h6' sx={{ m:2, textDecoration:'underline'  }}  >
              USDC Deposit
            </Typography>
          </Stack>

          <Stack direction='column' sx={{ alignItems:'end' }} >

            <Stack direction='row' width='100%' >
              <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} >
                <b>Beginning Value of Deposit: ({inETH 
                    ? weiToEth9Dec(microToWei(depOfUsd.opnAmt)) 
                    : showUSD(microToDust(depOfUsd.opnAmt)) }) </b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' >
              <Typography variant="h6" textAlign='center' width='10%'>
                +
              </Typography>
              <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} onClick={()=>display[14](2)} >
                <b>Deposit Inflow: ({inETH 
                    ? weiToEth9Dec(microToWei(usdDepInflow)) 
                    : showUSD(microToDust(usdDepInflow)) }) </b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' >
              <Typography variant="h6" textAlign='center' width='10%'>
                -
              </Typography>
              <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} onClick={()=>display[15](2)} >
                <b>Deposit Outflow: ({inETH 
                    ? weiToEth9Dec(microToWei(usdDepOutflow)) 
                    : showUSD(microToDust(usdDepOutflow)) }) </b>
              </Button>
            </Stack>

            <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
              <b>Deposit Balance: ({inETH 
                  ? weiToEth9Dec(microToWei(depOfUsd.endAmt)) 
                  : showUSD(microToDust(depOfUsd.endAmt)) }) </b>
            </Button>

          </Stack>

        </Paper>

      </Stack>

    </Paper>

  );   
}