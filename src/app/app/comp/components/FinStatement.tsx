
import { Paper, Stack, Typography, Divider, Button, Switch } from "@mui/material";

import { useComBooxContext } from "../../../_providers/ComBooxContextProvider";
import { useEffect, useState } from "react";
import { rate } from "../../fuel_tank/ft";
import { baseToDollar, bigIntToNum, bigIntToStrNum } from "../../common/toolsKit";
import { CbpIncome, CbpIncomeSumProps, defaultSum,  } from "./FinStatement/CbpIncome";
import { defaultEthIncomeSum, EthIncome, EthIncomeSumProps } from "./FinStatement/EthIncome";
import { CbpOutflow, CbpOutflowSumProps, defaultCbpOutSum } from "./FinStatement/CbpOutflow";
import { defaultEthOutSum, EthOutflow, EthOutflowSumProps } from "./FinStatement/EthOutflow";
import { AddrOfTank, HexType } from "../../common";
import { CashFlowList, SumInfo } from "./FinStatement/CashflowList";
import { defaultDepositsSum, Deposits, DepositsSumProps } from "./FinStatement/Deposits";
import { balanceOfWei, getCentPriceInWei } from "../../rc";
import { usePublicClient } from "wagmi";
import { totalDeposits } from "../gk";
import { defaultFtEthSum, FtEthflow, FtEthflowSumProps } from "./FinStatement/FtEthflow";
import { defaultFtCbpSum, FtCbpflow, FtCbpflowSumProps } from "./FinStatement/FtCbpflow";

export type CashflowProps = {
  seq: number,
  blockNumber: bigint,
  timestamp: bigint,
  transactionHash: HexType,
  typeOfIncome: string,
  amt: bigint,
  usd: bigint,
  ethPrice: bigint,
  addr: HexType,
  acct: bigint,
}

export function FinStatement() {

  const { gk, compInfo } = useComBooxContext();

  const [ cbpIncome, setCbpIncome ] = useState<CbpIncomeSumProps>(defaultSum);
  const [ cbpIncomeRecords, setCbpIncomeRecords ] = useState<CashflowProps[]>([]);

  const [ cbpOutflow, setCbpOutflow ] = useState<CbpOutflowSumProps>(defaultCbpOutSum);
  const [ cbpOutflowRecords, setCbpOutflowRecords ] = useState<CashflowProps[]>([]);

  const [ ethIncome, setEthIncome ] = useState<EthIncomeSumProps>(defaultEthIncomeSum);
  const [ ethIncomeRecords, setEthIncomeRecords ] = useState<CashflowProps[]>([]);

  const [ ethOutflow, setEthOutflow ] = useState<EthOutflowSumProps>(defaultEthOutSum);
  const [ ethOutflowRecords, setEthOutflowRecords ] = useState<CashflowProps[]>([]);

  const [ deposits, setDeposits ] = useState<DepositsSumProps>(defaultDepositsSum);
  const [ depositsRecords, setDepositsRecords ] = useState<CashflowProps[]>([]);

  const [ ftEthflow, setFtEthflow ] = useState<FtEthflowSumProps>(defaultFtEthSum);
  const [ ftEthflowRecords, setFtEthflowRecords] = useState<CashflowProps[]>([]);

  const [ ftCbpflow, setFtCbpflow ] = useState<FtCbpflowSumProps>(defaultFtCbpSum);
  const [ ftCbpflowRecords, setFtCbpflowRecords] = useState<CashflowProps[]>([]);

  const [ inETH, setInETH ] = useState(false);

  const [ exRate, setExRate ] = useState(10000n);

  useEffect(()=>{
    const getRate = async ()=> {
      let rateOfEx = await rate();
      setExRate(rateOfEx);
    }
    getRate();
  });

  const [ centPrice, setCentPrice ] = useState(1n);

  useEffect(()=>{
    const getCentPrice = async ()=>{
      let price = await getCentPriceInWei(0);
      setCentPrice(price);
    }

    getCentPrice();
  });

  const [ days, setDays ] = useState(0n);
  const client = usePublicClient();

  useEffect(()=>{
    const getDays = async ()=>{
      let setUpDate = new Date('2024-09-18T08:00:00Z');
      let blk = await client.getBlock();
      let days = (blk.timestamp - BigInt(setUpDate.getTime()/1000)) / 86400n; 

      setDays(days);
    }
    getDays();
  });

  const [ list, setList ] = useState<CashflowProps[]>([]);
  const [ open, setOpen ] = useState(false);
  const [ sumInfo, setSumInfo ] = useState<SumInfo[]>([]);

  const [ balanceOfEth, setBalanceOfEth ] = useState(0n);
  const [ depositsOfETH, setDepositsOfETH ] = useState(0n);
  const [ balaFtEth, setBalaFtEth ] = useState(0n);

  useEffect(()=>{
    if (gk) {
      balanceOfWei(gk).then(
        res => setBalanceOfEth(res)
      );

      totalDeposits(gk, undefined).then(
        res => setDepositsOfETH(res)
      );
      
      balanceOfWei(AddrOfTank).then(
        res => setBalaFtEth(res)
      );
    }
  });

  const [ initContribution, setInitContribution ] = useState(0n);

  useEffect(()=>{
    if (!compInfo?.regNum || !centPrice) return;

    if (compInfo.regNum == 8 && centPrice > 0) {
      setInitContribution(3n * 10n ** 7n * centPrice);
    }
    
  }, [compInfo, setInitContribution, centPrice]);


  const [ armotization, setArmotization ] = useState(0n);

  useEffect(()=>{

    if (initContribution > 0n && days > 0n) {

      let armo = initContribution / (15n * 365n) * days;

      setArmotization(armo);
    }
    
  }, [compInfo, initContribution, days, setArmotization]);


  // ==== Calculation ====

  const ethToBP = (eth:bigint) => {
    return eth * 100n / centPrice;
  }

  const cbpToETH = (cbp:bigint) => {
    return cbp * 10000n / exRate;
  }

  const ethToUSD = (eth:bigint) => {
    return baseToDollar(ethToBP(eth).toString()) + ' USD';
  }

  const ethToGwei = (eth:bigint) => {
    return bigIntToNum(eth / 10n**9n, 9) + ' ETH';
  }

  const showUSD = (usd:bigint) => {
    return bigIntToNum(usd / 10n ** 9n, 9) + 'USD';
  }

  let gmmExp = cbpToETH(cbpOutflow.gmmTransfer) + ethOutflow.gmmTransfer + ethOutflow.gmmExpense;
  let gmmExpInUsd = cbpOutflow.gmmTransferInUsd + ethOutflow.gmmTransferInUsd + ethOutflow.gmmExpenseInUsd;

  let bmmExp = cbpToETH(cbpOutflow.bmmTransfer) + ethOutflow.bmmTransfer + ethOutflow.bmmExpense;
  let bmmExpInUsd = cbpOutflow.bmmTransferInUsd + ethOutflow.bmmTransferInUsd + ethOutflow.bmmExpenseInUsd;

  let ethGainLoss = (ethIncome.totalAmt - ethOutflow.totalAmt) * 10n ** 16n / centPrice - (ethIncome.sumInUsd - ethIncome.sumInUsd);
  let cbpGainLoss = cbpToETH(cbpIncome.totalAmt - cbpOutflow.totalAmt) * 10n ** 16n / centPrice - (cbpIncome.sumInUsd - cbpOutflow.sumInUsd);
  let exchangeGainLoss = ethGainLoss + cbpGainLoss;

  let ebitda = cbpToETH(cbpIncome.royalty) + ethIncome.transfer - gmmExp - bmmExp - cbpToETH(cbpOutflow.newUserAward + cbpOutflow.startupCost);

  let ebitdaInUsd = cbpIncome.royaltyInUsd + ethIncome.transferInUsd - gmmExpInUsd - bmmExpInUsd - (cbpOutflow.newUserAwardInUsd + cbpOutflow.startupCostInUsd) + exchangeGainLoss;

  let profits = ebitda - armotization;
  let profitsInUsd = ebitdaInUsd - armotization * 10n ** 16n / centPrice;

  let totalAssets = initContribution - armotization + (balanceOfEth + balaFtEth - depositsOfETH);

  let cbpPaidOut = cbpToETH(cbpOutflow.gmmTransfer + cbpOutflow.bmmTransfer);
  let cbpPaidOutInUsd = cbpOutflow.gmmTransferInUsd + cbpOutflow.bmmTransferInUsd;

  let deferredRevenue = cbpPaidOut + cbpToETH(ftCbpflow.refuelCbp + cbpOutflow.newUserAward + cbpOutflow.startupCost - cbpIncome.royalty);
  let deferredRevenueInUsd = cbpPaidOutInUsd + (ftCbpflow.refuelCbpInUsd + cbpOutflow.newUserAwardInUsd + cbpOutflow.startupCostInUsd - cbpIncome.royaltyInUsd);

  let undistributedProfits = profits - ethOutflow.distribution;
  let undistributedProfitsInUsd = profitsInUsd - ethOutflow.distributionInUsd;

  let ownersEquity = initContribution + ethIncome.capital + undistributedProfits;
  let ownersEquityInUsd = initContribution * 10n ** 16n / centPrice + ethIncome.capitalInUsd + undistributedProfitsInUsd;

  let balaOfEth = ethIncome.totalAmt - ethOutflow.totalAmt - ftEthflow.totalEth;
  let balaOfEthInUSD = ethIncome.sumInUsd - ethOutflow.sumInUsd - ftEthflow.totalEthInUsd;

  let balaOfCbp = cbpIncome.totalAmt - cbpOutflow.totalAmt - ftCbpflow.addCbp;
  let balaOfCbpInUsd = cbpIncome.sumInUsd - cbpOutflow.sumInUsd - ftCbpflow.totalCbpInUsd;

  // ==== Details Display ====

  const showRoyaltyRecords = () => {
    let records = cbpIncomeRecords.filter((v)=>v.typeOfIncome == 'Royalty');
    let arrSumInfo = inETH 
        ? [{title: 'Royalty Income (ETH', data: cbpIncome.royalty * 10000n / exRate}]
        : [{title: 'Royalty Income - (USD', data: cbpIncome.royaltyInUsd}];
    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const showOtherIncomeRecords = () => {
    let records = ethIncomeRecords.filter((v)=>v.typeOfIncome == 'Transfer');
    let arrSumInfo = inETH
        ? [{title: 'Other Income (ETH', data: ethIncome.transfer}]
        : [{title: 'Other Income - (USD', data: ethIncome.transferInUsd}];
    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const showPaidInCapRecords = () => {
    let records = ethIncomeRecords.filter((v)=>v.typeOfIncome == 'PayInCap' ||
        v.typeOfIncome == 'PayOffCIDeal' || v.typeOfIncome =='CloseBidAgainstInitOffer' );
    let arrSumInfo = inETH 
        ? [ {title: 'Paid In Cap (ETH)', data: ethIncome.totalAmt} ]
        : [ {title: 'Paid In Cap - (USD', data: ethIncome.sumInUsd} ];

    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const showGmmExpRecords = () => {
    let records = cbpOutflowRecords.filter((v) => v.typeOfIncome == 'GmmTransfer - CBP');
    records = records.concat(ethOutflowRecords.filter((v) => v.typeOfIncome == 'GmmTransfer - ETH'));
    records = records.concat(ethOutflowRecords.filter((v)=>v.typeOfIncome == 'GmmExpense - ETH'));
    let arrSumInfo = inETH
        ? [ {title: 'GMM Expense (ETH)', data: (ethOutflow.gmmTransfer + ethOutflow.gmmExpense + cbpOutflow.gmmTransfer * 10000n /exRate)},
          {title: 'CBP Transfer (ETH)', data: cbpOutflow.gmmTransfer * 10000n / exRate},
          {title: 'ETH Transfer (ETH)', data: ethOutflow.gmmTransfer},
          {title: 'ETH Action Expense (ETH)', data: ethOutflow.gmmExpense}]
        : [ {title: 'GMM Expense - (USD', data: (ethOutflow.gmmTransferInUsd + ethOutflow.gmmExpenseInUsd + cbpOutflow.gmmTransferInUsd)},
          {title: 'CBP Transfer (USD)', data: cbpOutflow.gmmTransferInUsd},
          {title: 'ETH Transfer (USD)', data: ethOutflow.gmmTransferInUsd},
          {title: 'ETH Action Expense (USD)', data: ethOutflow.gmmExpenseInUsd}];

    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  } 

  const showBmmExpRecords = () => {
    let records = cbpOutflowRecords.filter((v) => v.typeOfIncome == 'BmmTransfer - CBP');
    records = records.concat(ethOutflowRecords.filter((v) => v.typeOfIncome == 'BmmTransfer - ETH'));
    records = records.concat(ethOutflowRecords.filter((v)=>v.typeOfIncome == 'BmmExpense - ETH'));
    let arrSumInfo = inETH
        ? [ {title: 'BMM Expense (ETH', data: (ethOutflow.bmmTransfer + ethOutflow.bmmExpense + cbpOutflow.bmmTransfer * 10000n /exRate)},
          {title: 'CBP Transfer (ETH)', data: cbpOutflow.bmmTransfer * 10000n / exRate},
          {title: 'ETH Transfer (ETH)', data: ethOutflow.bmmTransfer},
          {title: 'ETH Action Expense (ETH)', data: ethOutflow.bmmExpense} ]
        : [ {title: 'BMM Expense - (USD', data: (ethOutflow.bmmTransferInUsd + ethOutflow.bmmExpenseInUsd + cbpOutflow.bmmTransferInUsd)},
          {title: 'CBP Transfer (USD)', data: cbpOutflow.bmmTransferInUsd},
          {title: 'ETH Transfer (USD)', data: ethOutflow.bmmTransferInUsd},
          {title: 'ETH Action Expense (USD)', data: ethOutflow.bmmExpenseInUsd} ];

    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const showNewUserAwardRecords = () => {
    let records = cbpOutflowRecords.filter((v) => v.typeOfIncome == 'NewUserAward');

    let arrSumInfo = inETH 
        ? [{title: 'New User Award (ETH ', data: cbpOutflow.newUserAward * 10000n / exRate }]
        : [{title: 'New User Award (USD ', data: cbpOutflow.newUserAwardInUsd }];

    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const showGasSoldRecords = () => {
    let records = ftCbpflowRecords.filter((v) => v.typeOfIncome == 'RefuelCbp');

    let arrSumInfo = inETH 
        ? [{title: 'Gas Sold (ETH', data: (ftCbpflow.refuelCbp * 10000n / exRate)} ]
        : [{title: 'Gas Sold (CBP', data: (ftCbpflow.refuelCbpInUsd)} ];

    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const showCbpPaidOutRecords = () => {
    let records = cbpOutflowRecords.filter((v) => (v.typeOfIncome == 'GmmTransfer - CBP' || v.typeOfIncome == 'BmmTransfer - CBP'));

    let arrSumInfo = inETH
        ? [ {title: 'CBP Paid Out (ETH', data: (cbpOutflow.gmmTransfer + cbpOutflow.bmmTransfer) * 10000n / exRate},
            {title: 'GMM Transfer (ETH)', data: (cbpOutflow.gmmTransfer * 10000n / exRate)},
            {title: 'BMM Transfer (ETH)', data: (cbpOutflow.bmmTransfer * 10000n / exRate)}]
        : [ {title: 'CBP Paid Out (USD', data: (cbpOutflow.gmmTransferInUsd + cbpOutflow.bmmTransferInUsd)},
            {title: 'GMM Transfer (USD)', data: (cbpOutflow.gmmTransferInUsd)},
            {title: 'BMM Transfer (USD)', data: (cbpOutflow.bmmTransferInUsd)}];

    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  return (
    <Paper elevation={3} 
      sx={{
        m:1, p:1, border:1,
        borderColor:'divider',
        width: '100%' 
      }} 
    >

      <Stack direction='row' sx={{ alignItems:'center' }} >
        <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
          <b>Financial Statement</b> 
        </Typography>

        <Typography variant='h6' color= {inETH ? 'gray' : 'blue'} sx={{ m:2, ml:5}} >
          <b>USD</b>
        </Typography>

        <Switch
          color="primary" 
          onChange={(e) => setInETH( e.target.checked )} 
          checked={ inETH } 
        />

        <Typography variant='h6' color={inETH ? 'blue' : 'gray'} sx={{ m:2}} >
          <b>ETH</b>
        </Typography>
      </Stack>

      <Stack direction='row' >

        <CashFlowList arrSum={sumInfo} records={list} open={open} setOpen={setOpen}/>
    
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
              <b>Intellectual Property Rights: ({inETH 
                ? ethToGwei(initContribution) 
                : ethToUSD(initContribution)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='10%'>
              -
            </Typography>
            <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} >
              <b>Amortization: ({ inETH 
                ? ethToGwei(armotization) 
                : ethToUSD(armotization)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='20%'>
              &nbsp;
            </Typography>
            <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
              <b>Net Value Of IPR: ({ inETH 
                ? ethToGwei(initContribution - armotization) 
                : ethToUSD(initContribution - armotization)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} >
              <b>ETH In GK: ({ inETH 
                ? ethToGwei(balanceOfEth)
                : ethToUSD(balanceOfEth) }) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='10%'>
              -
            </Typography>
            <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} >
              <b>Deposits: ({ inETH 
                ? ethToGwei(depositsOfETH)
                : ethToUSD(depositsOfETH)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='10%'>
              +
            </Typography>
            <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} >
              <b>ETH In FT: ({ inETH 
                ? ethToGwei(balaFtEth)
                : ethToUSD(balaFtEth)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='20%'>
              &nbsp;
            </Typography>
            <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
              <b>ETH of Comp: ({ inETH 
                ? ethToGwei(balanceOfEth - depositsOfETH + balaFtEth)
                : ethToUSD(balanceOfEth - depositsOfETH + balaFtEth)}) </b>
            </Button>
          </Stack>

          <Divider orientation="horizontal"  sx={{ my:2, color:'blue' }} flexItem  />

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='30%'>
              &nbsp;
            </Typography>
            <Button variant="outlined" sx={{width: '70%', m:0.5, justifyContent:'start'}} >
              <b>Total Assets: ({ inETH
                ? ethToGwei(totalAssets)
                : ethToUSD(totalAssets)}) </b>
            </Button>
          </Stack>

        </Paper>

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
            <Typography variant="h6" textAlign='center' width='10%'>
              +
            </Typography>
            <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} onClick={()=>showNewUserAwardRecords()} >
              <b>New User Award: ({ inETH
                ? ethToGwei(cbpToETH(cbpOutflow.newUserAward))
                : showUSD(cbpOutflow.newUserAwardInUsd)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='10%'>
              +
            </Typography>
            <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} onClick={()=>showNewUserAwardRecords()} >
              <b>Startup Cost: ({ inETH
                ? ethToGwei(cbpToETH(cbpOutflow.startupCost))
                : showUSD(cbpOutflow.startupCostInUsd)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='10%'>
              +
            </Typography>
            <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} onClick={()=>showGasSoldRecords()} >
              <b>Gas Sold: ({ inETH
                ? ethToGwei(cbpToETH(ftCbpflow.refuelCbp))
                : showUSD(ftCbpflow.refuelCbpInUsd)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='10%'>
              +
            </Typography>
            <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} onClick={()=>showCbpPaidOutRecords()}>
              <b>CBP Paid-Out: ({ inETH
                ? ethToGwei(cbpPaidOut)
                : showUSD(cbpPaidOutInUsd)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='10%'>
              -
            </Typography>
            <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} onClick={()=>showRoyaltyRecords()} >
              <b>Royalty Income: ({ inETH
                ? ethToGwei(cbpToETH(cbpIncome.royalty))
                : showUSD(cbpIncome.royaltyInUsd)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='20%'>
              &nbsp;
            </Typography>
            <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
              <b>Total Liabilities (Deferred Revenue): ({ inETH
                ? ethToGwei(deferredRevenue)
                : showUSD(deferredRevenueInUsd)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} >
              <b>Initial Capital: ({ inETH
                ? ethToGwei(initContribution)
                : ethToUSD(initContribution)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='10%'>
              +
            </Typography>
            <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} >
              <b>Additional Paid In Capital: ({ inETH
                ? ethToGwei(ethIncome.capital)
                : showUSD(ethIncome.capitalInUsd)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='10%'>
              +
            </Typography>
            <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} >
              <b>Retained Earnings: ({ inETH
                ? ethToGwei(undistributedProfits)
                : showUSD(undistributedProfitsInUsd)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='20%'>
              &nbsp;
            </Typography>
            <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
              <b>Total Equity: ({ inETH
                ? ethToGwei(ownersEquity)
                : showUSD(ownersEquityInUsd)}) </b>
            </Button>
          </Stack>

          <Divider orientation="horizontal"  sx={{ my:2, color:'blue' }} flexItem  />

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='20%'>
              &nbsp;
            </Typography>
            <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
              <b>Total Liabilities & Equity: ({ inETH
                ? ethToGwei(deferredRevenue + ownersEquity)
                : showUSD(deferredRevenueInUsd + ownersEquityInUsd)}) </b>
            </Button>
          </Stack>

        </Paper>

      </Stack>

      <Stack direction='row' >

        <Paper elevation={3} 
          sx={{
            m:1, p:1, border:1, 
            borderColor:'divider',
            width: '50%' 
          }} 
        >

          <Stack direction='row' sx={{ alignItems:'center' }} >
            <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
              <b>Income Statement</b>
            </Typography>
          </Stack>

          <Stack direction='row' width='100%' >
            <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} onClick={()=>showRoyaltyRecords()} >
              <b>Royalty Inc: ({ inETH
                ? ethToGwei(cbpToETH(cbpIncome.royalty))
                : showUSD(cbpIncome.royaltyInUsd)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='10%'>
              +
            </Typography>
            <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} onClick={()=>showOtherIncomeRecords()} >
              <b>Other Inc: ({ inETH
                ? ethToGwei(ethIncome.transfer)
                : showUSD(ethIncome.transferInUsd)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='10%'>
              -
            </Typography>
            <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} onClick={()=>showGmmExpRecords()} >
              <b>Gmm Exp: ({ inETH
                ? ethToGwei(gmmExp)
                : showUSD(gmmExpInUsd) }) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='10%'>
              -
            </Typography>
            <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} onClick={showBmmExpRecords}>
              <b>Bmm Exp: ({ inETH
                ? ethToGwei(bmmExp)
                : showUSD(bmmExpInUsd) }) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='10%'>
              -
            </Typography>
            <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} onClick={showNewUserAwardRecords}>
              <b>New User Reward: ({ inETH
                ? ethToGwei( cbpToETH(cbpOutflow.newUserAward))
                : showUSD(cbpOutflow.newUserAwardInUsd) }) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='10%'>
              -
            </Typography>
            <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} onClick={showNewUserAwardRecords}>
              <b>Startup Cost: ({ inETH
                ? ethToGwei( cbpToETH(cbpOutflow.startupCost))
                : showUSD(cbpOutflow.startupCostInUsd) }) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='10%'>
              +
            </Typography>
            <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} onClick={showNewUserAwardRecords}>
              <b>Exchange Gain/Loss: ({ inETH
                ? 0
                : showUSD(exchangeGainLoss) }) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='20%'>
              &nbsp;
            </Typography>
            <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
              <b>EBITDA: ({ inETH
                ? ethToGwei(ebitda)
                : showUSD(ebitdaInUsd)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='20%'>
              &nbsp;
            </Typography>
            <Typography variant="h6" textAlign='center' width='10%'>
              -
            </Typography>
            <Button variant="outlined" sx={{width: '70%', m:0.5, justifyContent:'start'}} >
              <b>Amortization: ({ inETH
              ? ethToGwei(armotization)
              : ethToUSD(armotization)}) </b>
            </Button>
          </Stack>

          <Divider orientation="horizontal"  sx={{ my:2, color:'blue' }} flexItem  />

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='40%'>
              &nbsp;
            </Typography>
            <Button variant="outlined" sx={{width: '60%', m:0.5, justifyContent:'start'}} >
              <b>Profits: ({ inETH
                ? ethToGwei(profits)
                : showUSD(profitsInUsd) }) </b>
            </Button>
          </Stack>

        </Paper>

        <Paper elevation={3} 
          sx={{
            m:1, p:1, border:1, 
            borderColor:'divider',
            width: '50%' 
          }} 
        >

            <Stack direction='row' sx={{ alignItems:'center' }} >
              <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
                <b>Statement of Changes in Equity</b>
              </Typography>
            </Stack>

            <Stack direction='row' width='100%' >
              <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} >
                <b>Initial Capital: ({ inETH 
                  ? ethToGwei(initContribution)
                  : ethToUSD(initContribution)})</b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' >
              <Typography variant="h6" textAlign='center' width='10%'>
                +
              </Typography>
              <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} onClick={()=>showPaidInCapRecords()} >
                <b>Additional Paid-In Capital: ({ inETH
                  ? ethToGwei(ethIncome.capital)
                  : showUSD(ethIncome.capitalInUsd)}) </b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' >
              <Typography variant="h6" textAlign='center' width='10%'>
                +
              </Typography>
              <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} >
                <b>Profits: ({ inETH 
                  ? ethToGwei(profits)
                  : showUSD(profitsInUsd)}) </b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' >
              <Typography variant="h6" textAlign='center' width='10%'>
                -
              </Typography>
              <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} >
                <b>Distribution: ({ inETH
                  ? ethToGwei(ethOutflow.distribution)
                  : showUSD(ethOutflow.distributionInUsd)}) </b>
              </Button>
            </Stack>

            <Divider orientation="horizontal"  sx={{ my:2, color:'blue' }} flexItem  />

            <Stack direction='row' width='100%' >
              <Typography variant="h6" textAlign='center' width='20%'>
                &nbsp;
              </Typography>
              <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
                <b>Total Equity: ({ inETH
                  ? ethToGwei(ownersEquity)
                  : showUSD(ownersEquityInUsd)}) </b>
              </Button>
            </Stack>

        </Paper>

        <Paper elevation={3} 
          sx={{
            m:1, p:1, border:1, 
            borderColor:'divider',
            width: '50%' 
          }} 
        >

            <Stack direction='row' sx={{ alignItems:'center' }} >
              <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
                <b>Cashflow Statement</b>
              </Typography>
            </Stack>

              <Stack direction='column' sx={{ alignItems:'end' }} >

                <Stack direction='row' width='100%' >
                  <Typography variant="h6" textAlign='center' width='10%'>
                    +
                  </Typography>
                  <CbpIncome inETH={inETH} exRate={exRate} centPrice={centPrice} sum={cbpIncome} setSum={setCbpIncome} records={cbpIncomeRecords} setRecords={setCbpIncomeRecords} setSumInfo={setSumInfo} setList={setList} setOpen={setOpen} />
                </Stack>

                <Stack direction='row' width='100%' >
                  <Typography variant="h6" textAlign='center' width='10%'>
                    -
                  </Typography>
                  <CbpOutflow inETH={inETH} exRate={exRate} centPrice={centPrice} sum={cbpOutflow} setSum={setCbpOutflow} records={cbpOutflowRecords} setRecords={setCbpOutflowRecords} setSumInfo={setSumInfo} setList={setList} setOpen={setOpen} />
                </Stack>

                <Stack direction='row' width='100%' >
                  <Typography variant="h6" textAlign='center' width='10%'>
                    -
                  </Typography>
                  <FtCbpflow inETH={inETH} exRate={exRate} centPrice={centPrice} sum={ftCbpflow} setSum={setFtCbpflow} records={ftCbpflowRecords} setRecords={setFtCbpflowRecords} setSumInfo={setSumInfo} setList={setList} setOpen={setOpen} />
                </Stack>

                <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
                  <b>CBP Balance: ({inETH ? ethToGwei(balaOfCbp) : showUSD(balaOfCbpInUsd)}) </b>
                </Button>

              </Stack>

              <Divider orientation="horizontal"  sx={{ my:2, color:'blue' }} flexItem  />

              <Stack direction='column' sx={{ alignItems:'end' }} >

                <Stack direction='row' width='100%' >
                  <Typography variant="h6" textAlign='center' width='10%'>
                    +
                  </Typography>
                  <EthIncome inETH={inETH} exRate={exRate} centPrice={centPrice} sum={ethIncome} setSum={setEthIncome} records={ethIncomeRecords} setRecords={setEthIncomeRecords} setSumInfo={setSumInfo} setList={setList} setOpen={setOpen} />
                </Stack>

                <Stack direction='row' width='100%' >
                  <Typography variant="h6" textAlign='center' width='10%'>
                    -
                  </Typography>
                  <EthOutflow inETH={inETH} exRate={exRate} centPrice={centPrice} sum={ethOutflow} setSum={setEthOutflow} records={ethOutflowRecords} setRecords={setEthOutflowRecords} setSumInfo={setSumInfo} setList={setList} setOpen={setOpen} />
                </Stack>

                <Stack direction='row' width='100%' >
                  <Typography variant="h6" textAlign='center' width='10%'>
                    -
                  </Typography>
                  <Deposits inETH={inETH} exRate={exRate} centPrice={centPrice} sum={deposits} setSum={setDeposits} records={depositsRecords} setRecords={setDepositsRecords} setSumInfo={setSumInfo} setList={setList} setOpen={setOpen} />
                </Stack>

                <Stack direction='row' width='100%' >
                  <Typography variant="h6" textAlign='center' width='10%'>
                    -
                  </Typography>
                  <FtEthflow inETH={inETH} exRate={exRate} centPrice={centPrice} sum={ftEthflow} setSum={setFtEthflow} records={ftEthflowRecords} setRecords={setFtEthflowRecords} setSumInfo={setSumInfo} setList={setList} setOpen={setOpen} />
                </Stack>

                <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
                  <b>ETH Balance: ({ inETH ? ethToGwei(balaOfEth) : showUSD(balaOfEthInUSD) }) </b>
                </Button>

              </Stack>

        </Paper>

      </Stack>
    
    </Paper>
  );
} 