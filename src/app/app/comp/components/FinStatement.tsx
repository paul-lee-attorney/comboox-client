
import { Paper, Stack, Typography, Divider, Button, Switch } from "@mui/material";

import { useComBooxContext } from "../../../_providers/ComBooxContextProvider";
import { useEffect, useState } from "react";
import { rate } from "../../fuel_tank/ft";
import { baseToDollar, bigIntToNum, bigIntToStrNum, dateParser } from "../../common/toolsKit";
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
import { getCentPriceInWeiAtTimestamp } from "./FinStatement/ethPrice/getPriceAtTimestamp";
import dayjs from "dayjs";

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
  const [ ethRateDate, setEthRateDate ] = useState('0');

  useEffect(()=>{
    let mark = getCentPriceInWeiAtTimestamp(Date.now());
    setCentPrice(mark.centPrice);
    setEthRateDate((mark.timestamp / 1000).toString());
    console.log('mark: ', mark.timestamp, mark.centPrice.toString());
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

  const weiToBP = (eth:bigint) => {
    return eth * 100n / centPrice;
  }

  const weiToDust = (eth:bigint) => {
    return eth * 10n ** 16n / centPrice;
  }

  const cbpToETH = (cbp:bigint) => {
    return cbp * 10000n / exRate;
  }

  const weiToUSD = (eth:bigint) => {
    return baseToDollar(weiToBP(eth).toString()) + ' USD';
  }

  const weiToEth9Dec = (eth:bigint) => {
    return bigIntToNum(eth / 10n**9n, 9) + ' ETH';
  }

  const showUSD = (usd:bigint) => {
    return baseToDollar((usd / 10n ** 14n).toString()) + 'USD';
  }

  // ==== Assets ====

  let netValueOfIPR = initContribution - armotization;
  let netValueOfIPRInUsd = weiToDust(netValueOfIPR);

  let ethOfComp = ethIncome.totalAmt - ethOutflow.totalAmt;
  let ethOfCompInUsd = ethIncome.sumInUsd - ethOutflow.sumInUsd;

  let ethGainLoss = weiToDust(ethIncome.totalAmt - ethOutflow.totalAmt) - (ethIncome.sumInUsd - ethOutflow.sumInUsd);
  let cbpGainLoss = weiToDust(cbpToETH(cbpOutflow.totalAmt - cbpIncome.totalAmt)) - (cbpOutflow.sumInUsd - cbpIncome.sumInUsd);
  let exchangeGainLoss = ethGainLoss - cbpGainLoss;

  let curValueOfEthInUsd = ethOfCompInUsd + ethGainLoss;

  let totalAssets = netValueOfIPR + ethOfComp;
  let totalAssetsInUsd = netValueOfIPRInUsd + curValueOfEthInUsd;

  // ==== Liabilities ====

  let cbpPaidOut = cbpToETH(cbpOutflow.gmmTransfer + cbpOutflow.bmmTransfer);
  let cbpPaidOutInUsd = cbpOutflow.gmmTransferInUsd + cbpOutflow.bmmTransferInUsd;

  let deferredRevenue = cbpPaidOut + cbpToETH(cbpOutflow.fuelSold + cbpOutflow.newUserAward + cbpOutflow.startupCost - cbpIncome.royalty);
  let deferredRevenueInUsd = cbpPaidOutInUsd + (cbpOutflow.fuelSoldInUsd + cbpOutflow.newUserAwardInUsd + cbpOutflow.startupCostInUsd - cbpIncome.royaltyInUsd);

  let totalLiabilitiesInUsd = deferredRevenueInUsd + cbpGainLoss;

  // ==== Profits & Loss ====

  let gmmExp = cbpToETH(cbpOutflow.gmmTransfer) + ethOutflow.gmmTransfer + ethOutflow.gmmExpense;
  let gmmExpInUsd = cbpOutflow.gmmTransferInUsd + ethOutflow.gmmTransferInUsd + ethOutflow.gmmExpenseInUsd;

  let bmmExp = cbpToETH(cbpOutflow.bmmTransfer) + ethOutflow.bmmTransfer + ethOutflow.bmmExpense;
  let bmmExpInUsd = cbpOutflow.bmmTransferInUsd + ethOutflow.bmmTransferInUsd + ethOutflow.bmmExpenseInUsd;

  let sgNa = gmmExp + bmmExp + cbpToETH(cbpOutflow.newUserAward + cbpOutflow.startupCost);
  let sgNaInUsd = gmmExpInUsd + bmmExpInUsd + cbpOutflow.newUserAwardInUsd + cbpOutflow.startupCostInUsd;

  let ebitda = cbpToETH(cbpIncome.royalty) + ethIncome.transfer - sgNa;
  let ebitdaInUsd = cbpIncome.royaltyInUsd + ethIncome.transferInUsd - sgNaInUsd + exchangeGainLoss;

  let profits = ebitda - armotization;
  let profitsInUsd = ebitdaInUsd - weiToDust(armotization);

  // ==== Owners Equity ====

  let undistributedProfits = profits - ethOutflow.distribution;
  let undistributedProfitsInUsd = profitsInUsd - ethOutflow.distributionInUsd;

  let ownersEquity = initContribution + ethIncome.capital + undistributedProfits;
  let ownersEquityInUsd = weiToDust(initContribution) + ethIncome.capitalInUsd + undistributedProfitsInUsd;

  // ==== Crypto Flow ====

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


        <Typography variant='body2' sx={{ m:2, ml: 30, textDecoration:'underline'}} >
          <b>ETH Price:</b> ({ baseToDollar((10n**20n/centPrice).toString()) } USD/ETH)
        </Typography>

        <Typography variant='body2' sx={{ m:2, textDecoration:'underline'}} >
          <b>Date of Rate:</b> { dateParser(ethRateDate) }
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
              <b>IP Rights: ({inETH 
                ? weiToEth9Dec(initContribution) 
                : weiToUSD(initContribution)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='10%'>
              -
            </Typography>
            <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} >
              <b>Amortization: ({ inETH 
                ? weiToEth9Dec(armotization) 
                : weiToUSD(armotization)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='20%'>
              &nbsp;
            </Typography>
            <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
              <b>Net Value Of IPR: ({ inETH 
                ? weiToEth9Dec(initContribution - armotization) 
                : weiToUSD(initContribution - armotization)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} >
              <b>ETH Of Comp: ({ inETH 
                ? weiToEth9Dec(ethOfComp)
                : showUSD(ethOfCompInUsd) }) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='10%'>
              +
            </Typography>
            <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} >
              <b>Appreciation of ETH: ({ inETH 
                ? 0
                : showUSD(ethGainLoss)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='20%'>
              &nbsp;
            </Typography>
            <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
              <b>Current Value of ETH: ({ inETH 
                ? weiToEth9Dec(ethOfComp)
                : showUSD(balanceOfEth - depositsOfETH + balaFtEth)}) </b>
            </Button>
          </Stack>

          <Divider orientation="horizontal"  sx={{ my:2, color:'blue' }} flexItem  />

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='30%'>
              &nbsp;
            </Typography>
            <Button variant="outlined" sx={{width: '70%', m:0.5, justifyContent:'start'}} >
              <b>Total Assets: ({ inETH
                ? weiToEth9Dec(totalAssets)
                : weiToUSD(totalAssets)}) </b>
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
            <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} >
              <b>Deferred Revenue: ({ inETH
                ? weiToEth9Dec(deferredRevenue)
                : showUSD(deferredRevenueInUsd)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='10%'>
              +
            </Typography>
            <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} >
              <b>Appreciation of CBP: ({ inETH
                ? '0'
                : showUSD(cbpGainLoss)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='20%'>
              &nbsp;
            </Typography>
            <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
              <b>Total Liabilities: ({ inETH
                ? weiToEth9Dec(deferredRevenue)
                : showUSD(totalLiabilitiesInUsd)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} >
              <b>Initial Capital: ({ inETH
                ? weiToEth9Dec(initContribution)
                : weiToUSD(initContribution)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='10%'>
              +
            </Typography>
            <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} >
              <b>Additional Paid In Capital: ({ inETH
                ? weiToEth9Dec(ethIncome.capital)
                : showUSD(ethIncome.capitalInUsd)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='10%'>
              +
            </Typography>
            <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} >
              <b>Retained Earnings: ({ inETH
                ? weiToEth9Dec(undistributedProfits)
                : showUSD(undistributedProfitsInUsd)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='20%'>
              &nbsp;
            </Typography>
            <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
              <b>Total Equity: ({ inETH
                ? weiToEth9Dec(ownersEquity)
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
                ? weiToEth9Dec(deferredRevenue + ownersEquity)
                : showUSD(totalLiabilitiesInUsd + ownersEquityInUsd)}) </b>
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
              <b>Royalty Income: ({ inETH
                ? weiToEth9Dec(cbpToETH(cbpIncome.royalty))
                : showUSD(cbpIncome.royaltyInUsd)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='10%'>
              +
            </Typography>
            <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} onClick={()=>showOtherIncomeRecords()} >
              <b>Other Income: ({ inETH
                ? weiToEth9Dec(ethIncome.transfer)
                : showUSD(ethIncome.transferInUsd)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='10%'>
              -
            </Typography>
            <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} onClick={showNewUserAwardRecords}>
              <b>Sales, General & Administrative: ({ inETH
                ? weiToEth9Dec(sgNa)
                : showUSD(sgNaInUsd)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='10%'>
              +
            </Typography>
            <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} >
              <b>Crypto Exchange Gain/Loss: ({ inETH
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
                ? weiToEth9Dec(ebitda)
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
              ? weiToEth9Dec(armotization)
              : weiToUSD(armotization)}) </b>
            </Button>
          </Stack>

          <Divider orientation="horizontal"  sx={{ my:2, color:'blue' }} flexItem  />

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='40%'>
              &nbsp;
            </Typography>
            <Button variant="outlined" sx={{width: '60%', m:0.5, justifyContent:'start'}} >
              <b>Profits: ({ inETH
                ? weiToEth9Dec(profits)
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
                  ? weiToEth9Dec(initContribution)
                  : weiToUSD(initContribution)})</b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' >
              <Typography variant="h6" textAlign='center' width='10%'>
                +
              </Typography>
              <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} onClick={()=>showPaidInCapRecords()} >
                <b>Additional Paid-In Capital: ({ inETH
                  ? weiToEth9Dec(ethIncome.capital)
                  : showUSD(ethIncome.capitalInUsd)}) </b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' >
              <Typography variant="h6" textAlign='center' width='10%'>
                +
              </Typography>
              <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} >
                <b>Profits: ({ inETH 
                  ? weiToEth9Dec(profits)
                  : showUSD(profitsInUsd)}) </b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' >
              <Typography variant="h6" textAlign='center' width='10%'>
                -
              </Typography>
              <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} >
                <b>Distribution: ({ inETH
                  ? weiToEth9Dec(ethOutflow.distribution)
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
                  ? weiToEth9Dec(ownersEquity)
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
                <b>Cryptoflow Statement</b>
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
                  <b>CBP Balance: ({inETH ? weiToEth9Dec(balaOfCbp) : showUSD(balaOfCbpInUsd)}) </b>
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
                  <FtEthflow inETH={inETH} exRate={exRate} centPrice={centPrice} sum={ftEthflow} setSum={setFtEthflow} records={ftEthflowRecords} setRecords={setFtEthflowRecords} setSumInfo={setSumInfo} setList={setList} setOpen={setOpen} />
                </Stack>

                <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
                  <b>ETH Balance: ({ inETH ? weiToEth9Dec(balaOfEth) : showUSD(balaOfEthInUSD) }) </b>
                </Button>

              </Stack>

              <Divider orientation="horizontal"  sx={{ my:2, color:'blue' }} flexItem  />

              <Stack direction='row' width='100%' >
                <Typography variant="h6" textAlign='center' width='10%'>
                  &nbsp;
                </Typography>
                <Deposits inETH={inETH} exRate={exRate} centPrice={centPrice} sum={deposits} setSum={setDeposits} records={depositsRecords} setRecords={setDepositsRecords} setSumInfo={setSumInfo} setList={setList} setOpen={setOpen} />
              </Stack>

        </Paper>

      </Stack>
    
    </Paper>
  );
} 