
import { Paper, Stack, Typography, Divider, Button, Switch } from "@mui/material";

import { useComBooxContext } from "../../../_providers/ComBooxContextProvider";
import { useEffect, useState } from "react";
import { rate } from "../../fuel_tank/ft";
import { baseToDollar, bigIntToNum, dateParser } from "../../common/toolsKit";
import { CbpIncome, CbpIncomeSumProps, defaultSum,  } from "./FinStatement/CbpIncome";
import { defaultEthIncomeSum, EthIncome, EthIncomeSumProps } from "./FinStatement/EthIncome";
import { CbpOutflow, CbpOutflowSumProps, defaultCbpOutSum } from "./FinStatement/CbpOutflow";
import { defaultEthOutSum, EthOutflow, EthOutflowSumProps } from "./FinStatement/EthOutflow";
import { AddrOfTank, HexType } from "../../common";
import { CashFlowList, SumInfo } from "./FinStatement/CashflowList";
import { defaultDepositsSum, Deposits, DepositsSumProps } from "./FinStatement/Deposits";
import { balanceOfWei } from "../../rc";
import { usePublicClient } from "wagmi";
import { totalDeposits } from "../gk";
import { defaultFtEthSum, FtEthflow, FtEthflowSumProps } from "./FinStatement/FtEthflow";
import { defaultFtCbpSum, FtCbpflow, FtCbpflowSumProps } from "./FinStatement/FtCbpflow";
import { BtnProps, SGNA } from "./FinStatement/SGNA";
import { getEthPricesForAppendRecords, getPriceAtTimestamp, updateMonthlyEthPrices } from "../../../api/firebase/ethPriceTools";

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

export const showUSD = (usd:bigint) => {
  return baseToDollar((usd / 10n ** 14n).toString()) + ' USD';
}

export const weiToEth9Dec = (eth:bigint) => {
  return bigIntToNum(eth / 10n**9n, 9) + ' ETH';
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

    const getCentPrice = async () => {
      await updateMonthlyEthPrices();

      let today = new Date();
      let prices = await getEthPricesForAppendRecords(today.getTime());
      if (!prices) return;

      let mark = getPriceAtTimestamp(today.getTime(), prices);
  
      setCentPrice(mark.centPrice);
      setEthRateDate((mark.timestamp / 1000).toString());
      console.log('mark: ', mark.timestamp, mark.centPrice.toString());
    }

    getCentPrice();

  }, [setCentPrice, setEthRateDate]);

  const [ days, setDays ] = useState(0n);
  const client = usePublicClient();

  useEffect(()=>{
    const getDays = async ()=>{
      let setUpDate = new Date('2024-05-18T08:00:00Z');
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

  const [ items, setItems ] = useState<BtnProps[]>([]);
  const [ showSGNA, setShowSGNA ] = useState(false);

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
  
  // ==== Assets ====

  let netValueOfIPR = initContribution - armotization;
  let netValueOfIPRInUsd = weiToDust(netValueOfIPR);

  let ethOfComp = ethIncome.totalAmt - ethOutflow.totalAmt;
  let ethOfCompInUsd = ethIncome.sumInUsd - ethOutflow.sumInUsd;

  let ethGainLoss = weiToDust(ethOfComp) - ethOfCompInUsd;
  let cbpGainLoss = weiToDust(cbpToETH(cbpOutflow.totalAmt - cbpIncome.totalAmt)) - (cbpOutflow.sumInUsd - cbpIncome.sumInUsd);
  let exchangeGainLoss = ethGainLoss - cbpGainLoss;

  let curValueOfEthInUsd = ethOfCompInUsd + ethGainLoss;

  let totalAssets = netValueOfIPR + ethOfComp;
  let totalAssetsInUsd = netValueOfIPRInUsd + curValueOfEthInUsd;

  // ==== Liabilities ====

  let cbpMintOut = cbpToETH(cbpOutflow.newUserAward + cbpOutflow.startupCost);
  let cbpMintOutInUsd = cbpOutflow.newUserAwardInUsd + cbpOutflow.startupCostInUsd;

  let cbpPaidOut = cbpToETH(cbpOutflow.gmmTransfer + cbpOutflow.bmmTransfer);
  let cbpPaidOutInUsd = cbpOutflow.gmmTransferInUsd + cbpOutflow.bmmTransferInUsd;

  let deferredRevenue = cbpPaidOut + cbpMintOut + cbpToETH(cbpOutflow.fuelSold - cbpIncome.royalty);
  let deferredRevenueInUsd = cbpPaidOutInUsd + cbpMintOutInUsd + cbpOutflow.fuelSoldInUsd - cbpIncome.royaltyInUsd;

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

  let balaOfCbp = cbpIncome.totalAmt + cbpMintOut - cbpOutflow.totalAmt - ftCbpflow.totalCbp;
  let balaOfCbpInUsd = cbpIncome.sumInUsd + cbpMintOutInUsd - cbpOutflow.sumInUsd - ftCbpflow.totalCbpInUsd;

  // ==== Breakdown Display ====

  // ==== Assets ====

  const showGasIncomeRecords = () => {
    let records = ethIncomeRecords.filter((v)=>v.typeOfIncome == 'GasIncome');
    let curSumInUsd = weiToDust(ethIncome.gas);

    let arrSumInfo = inETH 
        ? [ {title: 'Gas Income - (ETH ', data: ethIncome.gas}]
        : [ {title: 'Gas Income - (USD ', data: ethIncome.gasInUsd},
            {title: 'Exchange Gain/Loss', data: curSumInUsd - ethIncome.gasInUsd},
          ];

    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const showPaidInCapRecords = () => {
    let records = ethIncomeRecords.filter((v)=>v.typeOfIncome == 'PayInCap' ||
        v.typeOfIncome == 'PayOffCIDeal' || v.typeOfIncome =='CloseBidAgainstInitOffer' );
    let curSumInUsd = weiToDust(ethIncome.capital);
    
    let arrSumInfo = inETH 
        ? [ {title: 'Paid In Cap - (ETH ', data: ethIncome.capital} ]
        : [ {title: 'Paid In Cap - (USD ', data: ethIncome.capitalInUsd},
            {title: 'Exchange Gain/Loss', data: curSumInUsd - ethIncome.capitalInUsd},
          ];

    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const showEthTransferIncomeRecords = () => {
    let records = ethIncomeRecords.filter((v)=>v.typeOfIncome == 'TransferIncome');
    let curSumInUsd = weiToDust(ethIncome.transfer);

    let arrSumInfo = inETH 
        ? [ {title: 'ETH Transfer - (ETH ', data: ethIncome.transfer} ]
        : [ {title: 'ETH Transfer - (USD ', data: ethIncome.transferInUsd},
            {title: 'Exchange Gain/Loss', data: curSumInUsd - ethIncome.transferInUsd},
          ];

    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const showEthGmmPaymentRecords = () => {
    let records = ethOutflowRecords.filter((v)=>v.typeOfIncome == 'GmmTransfer' ||
        v.typeOfIncome == 'GmmExpense');

    let curSumInUsd = weiToDust(ethOutflow.gmmTransfer + ethOutflow.gmmExpense);

    let arrSumInfo = inETH 
        ? [ {title: 'Gmm Payment - (ETH ', data: ethOutflow.gmmTransfer + ethOutflow.gmmExpense},
            {title: 'Gmm Transfer', data: ethOutflow.gmmTransfer},
            {title: 'Gmm Expense', data: ethOutflow.gmmExpense},
          ]
        : [ {title: 'Gmm Payment - (USD ', data: ethOutflow.gmmTransferInUsd + ethOutflow.gmmExpenseInUsd},
            {title: 'Exchange Gain/Loss', data: (ethOutflow.gmmTransferInUsd + ethOutflow.gmmExpenseInUsd) - curSumInUsd},
            {title: 'Gmm Transfer', data: ethOutflow.gmmTransferInUsd},
            {title: 'Gmm Expense', data: ethOutflow.gmmExpenseInUsd},
          ];

    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const showEthBmmPaymentRecords = () => {
    let records = ethOutflowRecords.filter((v)=>v.typeOfIncome == 'BmmTransfer' ||
        v.typeOfIncome == 'BmmExpense');

    let curSumInUsd = weiToDust(ethOutflow.bmmTransfer + ethOutflow.bmmExpense);

    let arrSumInfo = inETH 
        ? [ {title: 'Bmm Payment - (ETH ', data: ethOutflow.bmmTransfer + ethOutflow.bmmExpense},
            {title: 'Bmm Transfer', data: ethOutflow.bmmTransfer},
            {title: 'Bmm Expense', data: ethOutflow.bmmExpense},
          ]
        : [ {title: 'Bmm Payment - (USD ', data: ethOutflow.bmmTransferInUsd + ethOutflow.bmmExpenseInUsd},
            {title: 'Exchange Gain/Loss', data: (ethOutflow.bmmTransferInUsd + ethOutflow.bmmExpenseInUsd) - curSumInUsd},
            {title: 'Bmm Transfer', data: ethOutflow.bmmTransferInUsd},
            {title: 'Bmm Expense', data: ethOutflow.bmmExpenseInUsd},
          ];

    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const showDistributionRecords = () => {
    let records = ethOutflowRecords.filter((v)=>v.typeOfIncome == 'DistributeProfits');

    let curSumInUsd = weiToDust(ethOutflow.distribution);

    let arrSumInfo = inETH 
        ? [ {title: 'Distribution - (ETH ', data: ethOutflow.distribution} ]
        : [ {title: 'Distribution - (USD ', data: ethOutflow.distributionInUsd},
            {title: 'Exchange Gain/Loss', data: ethOutflow.distributionInUsd - curSumInUsd},
          ];

    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const showFtEthRecords = () => {
    let records = ftEthflowRecords;

    let curSumInUsd = weiToDust(ftEthflow.totalEth);

    let arrSumInfo = inETH
      ? [ {title: 'Eth Balance in FT - (ETH ', data: ftEthflow.totalEth},
          {title: 'Gas Income', data: ftEthflow.refuelEth},
          {title: 'Income Pickup', data: ftEthflow.withdrawEth},
        ]
      : [ {title: 'Eth Balance in FT - (USD ', data: ftEthflow.totalEthInUsd},
          {title: 'Exchange Gain/Loss', data: curSumInUsd - ftEthflow.totalEthInUsd},
          {title: 'Gas Income', data: ftEthflow.refuelEthInUsd},
          {title: 'Income Pickup', data: ftEthflow.withdrawEthInUsd},
        ];

    if (records.length > 0) {
      setSumInfo(arrSumInfo);
      setList(records);
      setOpen(true);
    }
  }

  const displayEthOfComp = () => {
    let items:BtnProps[] = [
      {simbol: ' ', title: 'ETH of Comp', amt: ethOfComp, amtInUsd: ethOfCompInUsd, show: ()=>{}},
      {simbol: '+', title: 'Gas Income', amt: ethIncome.gas, amtInUsd: ethIncome.gasInUsd, show: showGasIncomeRecords},
      {simbol: '+', title: 'Paid In Cap', amt: ethIncome.capital, amtInUsd: ethIncome.capitalInUsd, show: showPaidInCapRecords},
      {simbol: '+', title: 'Transfer Income', amt: ethIncome.transfer, amtInUsd: ethIncome.transferInUsd, show: showEthTransferIncomeRecords},
      {simbol: '-', title: 'Gmm Payment', amt: ethOutflow.gmmTransfer + ethOutflow.gmmExpense, amtInUsd: ethOutflow.gmmExpenseInUsd + ethOutflow.gmmTransferInUsd, show: showEthGmmPaymentRecords},
      {simbol: '-', title: 'Bmm Payment', amt: ethOutflow.bmmTransfer + ethOutflow.bmmExpense, amtInUsd: ethOutflow.bmmExpenseInUsd + ethOutflow.bmmTransferInUsd, show: showEthBmmPaymentRecords},
      {simbol: '-', title: 'Distribution', amt: ethOutflow.distribution, amtInUsd: ethOutflow.distributionInUsd, show: showDistributionRecords},
    ];

    if (items.length > 0) {
      setItems(items);
      setShowSGNA(true);
    }
  }

  // ==== Liabilities ====

  const showFuelSoldRecords = () => {
    let records = cbpOutflowRecords.filter((v)=>v.typeOfIncome == 'FuelSold');

    let curSumInUsd = weiToDust(cbpToETH(cbpOutflow.fuelSold));

    let arrSumInfo = inETH 
        ? [ {title: 'Fuel Sold - (ETH ', data: cbpToETH(cbpOutflow.fuelSold)} ]
        : [ {title: 'Fuel Sold - (USD ', data: cbpOutflow.fuelSoldInUsd},
            {title: 'Exchange Gain/Loss', data: cbpOutflow.fuelSoldInUsd - curSumInUsd},
          ];
    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const showGmmCbpPaymentRecords = () => {
    let records = cbpOutflowRecords.filter((v)=>v.typeOfIncome == 'GmmTransfer');

    let curSumInUsd = weiToDust(cbpToETH(cbpOutflow.gmmTransfer));

    let arrSumInfo = inETH 
        ? [ {title: 'Gmm CBP Payment - (ETH ', data: cbpToETH(cbpOutflow.gmmTransfer)} ]
        : [ {title: 'Gmm CBP Payment - (USD ', data: cbpOutflow.gmmTransferInUsd},
            {title: 'Exchange Gain/Loss', data: cbpOutflow.gmmTransferInUsd - curSumInUsd},
          ];
    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const showBmmCbpPaymentRecords = () => {
    let records = cbpOutflowRecords.filter((v)=>v.typeOfIncome == 'BmmTransfer');

    let curSumInUsd = weiToDust(cbpToETH(cbpOutflow.bmmTransfer));

    let arrSumInfo = inETH 
        ? [ {title: 'Bmm CBP Payment - (ETH ', data: cbpToETH(cbpOutflow.bmmTransfer)} ]
        : [ {title: 'Bmm CBP Payment - (USD ', data: cbpOutflow.bmmTransferInUsd},
            {title: 'Exchange Gain/Loss', data: cbpOutflow.bmmTransferInUsd - curSumInUsd},
          ];
    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const displayDeferredRevenue = () => {
    let items:BtnProps[] = [
      {simbol: ' ', title: 'Deferred Revenue', amt: deferredRevenue, amtInUsd: deferredRevenueInUsd, show: ()=>{}},
      {simbol: '+', title: 'Fuel Sold', amt: cbpToETH(cbpOutflow.fuelSold), amtInUsd: cbpOutflow.fuelSoldInUsd, show: showFuelSoldRecords},
      {simbol: '+', title: 'Gmm CBP Payment', amt: cbpToETH(cbpOutflow.gmmTransfer), amtInUsd: cbpOutflow.gmmTransferInUsd, show: showGmmCbpPaymentRecords},
      {simbol: '+', title: 'Bmm CBP Payment', amt: cbpToETH(cbpOutflow.bmmTransfer), amtInUsd: cbpOutflow.bmmTransferInUsd, show: showBmmCbpPaymentRecords},
      {simbol: '+', title: 'New User Awards', amt: cbpToETH(cbpOutflow.newUserAward), amtInUsd: cbpOutflow.newUserAwardInUsd, show: showNewUserAwardRecords},
      {simbol: '+', title: 'Startup Cost', amt: cbpToETH(cbpOutflow.startupCost), amtInUsd: cbpOutflow.startupCostInUsd, show: showStartupCostRecords},
      {simbol: '-', title: 'Royalty Income', amt: cbpToETH(cbpIncome.royalty), amtInUsd: cbpIncome.royaltyInUsd, show: showRoyaltyRecords},
    ];

    if (items.length > 0) {
      setItems(items);
      setShowSGNA(true);
    }
  }

  // ==== Income ====

  const showRoyaltyRecords = () => {
    let records = cbpIncomeRecords.filter((v)=>v.typeOfIncome == 'Royalty');

    let curSumInUsd = weiToDust(cbpToETH(cbpIncome.royalty));

    let arrSumInfo = inETH 
        ? [ {title: 'Royalty Income - (ETH ', data: cbpIncome.royalty * 10000n / exRate} ]
        : [ {title: 'Royalty Income - (USD ', data: cbpIncome.royaltyInUsd},
            {title: 'Exchange Gain/Loss', data: curSumInUsd - cbpIncome.royaltyInUsd},
          ];
    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const showOtherIncomeRecords = () => {
    let records = ethIncomeRecords.filter((v)=>v.typeOfIncome == 'TransferIncome');

    let curSumInUsd = weiToDust(ethIncome.transfer);

    let arrSumInfo = inETH
        ? [ {title: 'Other Income (ETH ', data: ethIncome.transfer} ]
        : [ {title: 'Other Income - (USD ', data: ethIncome.transferInUsd},
            {title: 'Exchange Gain/Loss', data: curSumInUsd - ethIncome.transferInUsd},
          ];
    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const showGmmExpRecords = () => {
    let records = cbpOutflowRecords.filter((v) => v.typeOfIncome == 'GmmTransfer');
    records = records.concat(ethOutflowRecords.filter((v) => v.typeOfIncome == 'GmmTransfer'));
    records = records.concat(ethOutflowRecords.filter((v)=>v.typeOfIncome == 'GmmExpense'));

    let curSumInUsd = weiToDust(cbpToETH(cbpOutflow.gmmTransfer) + ethOutflow.gmmTransfer + ethOutflow.gmmExpense);

    let arrSumInfo = inETH
        ? [ {title: 'GMM Expense - (ETH ', data: (ethOutflow.gmmTransfer + ethOutflow.gmmExpense + cbpOutflow.gmmTransfer * 10000n /exRate)},
          {title: 'CBP Transfer', data: cbpOutflow.gmmTransfer * 10000n / exRate},
          {title: 'ETH Transfer', data: ethOutflow.gmmTransfer},
          {title: 'ETH Action Expense', data: ethOutflow.gmmExpense}]
        : [ {title: 'GMM Expense - (USD ', data: (ethOutflow.gmmTransferInUsd + ethOutflow.gmmExpenseInUsd + cbpOutflow.gmmTransferInUsd)},
          {title: 'Exchange Gain/Loss', data: cbpOutflow.gmmTransferInUsd + ethOutflow.gmmTransferInUsd + ethOutflow.gmmExpenseInUsd - curSumInUsd },          
          {title: 'CBP Transfer', data: cbpOutflow.gmmTransferInUsd},
          {title: 'ETH Transfer', data: ethOutflow.gmmTransferInUsd},
          {title: 'ETH Action Expense', data: ethOutflow.gmmExpenseInUsd}];

    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  } 

  const showBmmExpRecords = () => {
    let records = cbpOutflowRecords.filter((v) => v.typeOfIncome == 'BmmTransfer');
    records = records.concat(ethOutflowRecords.filter((v) => v.typeOfIncome == 'BmmTransfer'));
    records = records.concat(ethOutflowRecords.filter((v)=>v.typeOfIncome == 'BmmExpense'));

    let curSumInUsd = weiToDust(cbpToETH(cbpOutflow.bmmTransfer) + ethOutflow.bmmTransfer + ethOutflow.bmmExpense);

    let arrSumInfo = inETH
        ? [ {title: 'BMM Expense (ETH ', data: (ethOutflow.bmmTransfer + ethOutflow.bmmExpense + cbpOutflow.bmmTransfer * 10000n /exRate)},
          {title: 'CBP Transfer', data: cbpOutflow.bmmTransfer * 10000n / exRate},
          {title: 'ETH Transfer', data: ethOutflow.bmmTransfer},
          {title: 'ETH Action Expense', data: ethOutflow.bmmExpense} ]
        : [ {title: 'BMM Expense - (USD ', data: (ethOutflow.bmmTransferInUsd + ethOutflow.bmmExpenseInUsd + cbpOutflow.bmmTransferInUsd)},
          {title: 'Exchange Gain/Loss', data: cbpOutflow.bmmTransferInUsd + ethOutflow.bmmTransferInUsd + ethOutflow.bmmExpenseInUsd - curSumInUsd },          
          {title: 'CBP Transfer', data: cbpOutflow.bmmTransferInUsd},
          {title: 'ETH Transfer', data: ethOutflow.bmmTransferInUsd},
          {title: 'ETH Action Expense', data: ethOutflow.bmmExpenseInUsd} ];

    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const showNewUserAwardRecords = () => {
    let records = cbpOutflowRecords.filter((v) => v.typeOfIncome == 'NewUserAward');

    let curSumInUsd = weiToDust(cbpToETH(cbpOutflow.newUserAward));

    let arrSumInfo = inETH 
        ? [ {title: 'New User Award (ETH ', data: cbpOutflow.newUserAward * 10000n / exRate }]
        : [ {title: 'New User Award (USD ', data: cbpOutflow.newUserAwardInUsd}, 
            {title: 'Exchange Gain/Loss', data: cbpOutflow.newUserAwardInUsd - curSumInUsd},
          ];

    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const showStartupCostRecords = () => {
    let records = cbpOutflowRecords.filter((v) => v.typeOfIncome == 'StartupCost');

    let curSumInUsd = weiToDust(cbpToETH(cbpOutflow.startupCost));

    let arrSumInfo = inETH 
        ? [ {title: 'Startup Cost (ETH ', data: cbpOutflow.startupCost * 10000n / exRate }]
        : [ {title: 'Startup Cost (USD ', data: cbpOutflow.startupCostInUsd },
            {title: 'Exchange Gain/Loss', data: cbpOutflow.startupCostInUsd - curSumInUsd },
          ];

    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const displaySGNA = () => {
    let items:BtnProps[] = [
      {simbol: ' ', title: 'Sales, General & Administrative', amt: sgNa, amtInUsd: sgNaInUsd, show: ()=>{}},
      {simbol: '+', title: 'New User Awards', amt:cbpToETH(cbpOutflow.newUserAward) , amtInUsd: cbpOutflow.newUserAwardInUsd, show: showNewUserAwardRecords},
      {simbol: '+', title: 'Startup Cost', amt:cbpToETH(cbpOutflow.startupCost) , amtInUsd: cbpOutflow.startupCostInUsd, show: showStartupCostRecords},
      {simbol: '+', title: 'GMM Approved Expense', amt:gmmExp , amtInUsd: gmmExpInUsd, show: showGmmExpRecords},
      {simbol: '+', title: 'BMM Approved Expense', amt:bmmExp , amtInUsd: bmmExpInUsd, show: showBmmExpRecords},
    ];

    if (items.length > 0) {
      setItems(items);
      setShowSGNA(true);
    }
  }

  const displayCbpMintToOthers = () => {
    let items:BtnProps[] = [
      {simbol: ' ', title: 'CBP Mint To Others', amt: cbpMintOut, amtInUsd: cbpMintOutInUsd, show: ()=>{}},
      {simbol: '+', title: 'New User Awards', amt:cbpToETH(cbpOutflow.newUserAward) , amtInUsd: cbpOutflow.newUserAwardInUsd, show: showNewUserAwardRecords},
      {simbol: '+', title: 'Startup Cost', amt:cbpToETH(cbpOutflow.startupCost) , amtInUsd: cbpOutflow.startupCostInUsd, show: showStartupCostRecords},
    ];

    if (items.length > 0) {
      setItems(items);
      setShowSGNA(true);
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


        <Typography variant='body2' sx={{ m:2, ml: 88, textDecoration:'underline'}} >
          <b>ETH Price:</b> ({ baseToDollar((10n**20n/centPrice).toString()) } USD/ETH)
        </Typography>

        <Typography variant='body2' sx={{ m:2, textDecoration:'underline'}} >
          <b>Date of Rate:</b> { dateParser(ethRateDate) }
        </Typography>


      </Stack>

      <Stack direction='row' >

        <CashFlowList inETH={inETH} arrSum={sumInfo} records={list} open={open} setOpen={setOpen}/>

        <SGNA inETH={inETH} items={items} open={showSGNA} setOpen={setShowSGNA} />
    
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

          <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
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
            <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} onClick={()=>displayEthOfComp()} >
              <b>ETH Of Comp: ({ inETH 
                ? weiToEth9Dec(ethOfComp)
                : showUSD(ethOfCompInUsd) }) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
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
                : showUSD(totalAssetsInUsd)}) </b>
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
            <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} onClick={()=>displayDeferredRevenue()} >
              <b>Deferred Revenue: ({ inETH
                ? weiToEth9Dec(deferredRevenue)
                : showUSD(deferredRevenueInUsd)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
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

          <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
            <Typography variant="h6" textAlign='center' width='10%'>
              +
            </Typography>
            <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} onClick={()=>showPaidInCapRecords()} >
              <b>Additional Paid In Capital: ({ inETH
                ? weiToEth9Dec(ethIncome.capital)
                : showUSD(ethIncome.capitalInUsd)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
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

          <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
            <Typography variant="h6" textAlign='center' width='10%'>
              +
            </Typography>
            <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} onClick={()=>showOtherIncomeRecords()} >
              <b>Other Income: ({ inETH
                ? weiToEth9Dec(ethIncome.transfer)
                : showUSD(ethIncome.transferInUsd)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
            <Typography variant="h6" textAlign='center' width='10%'>
              -
            </Typography>
            <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} onClick={()=>displaySGNA()}>
              <b>Sales, General & Administrative: ({ inETH
                ? weiToEth9Dec(sgNa)
                : showUSD(sgNaInUsd)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
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

          <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
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

          <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
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

            <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
              <Typography variant="h6" textAlign='center' width='10%'>
                +
              </Typography>
              <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} onClick={()=>showPaidInCapRecords()} >
                <b>Additional Paid-In Capital: ({ inETH
                  ? weiToEth9Dec(ethIncome.capital)
                  : showUSD(ethIncome.capitalInUsd)}) </b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
              <Typography variant="h6" textAlign='center' width='10%'>
                +
              </Typography>
              <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} >
                <b>Profits: ({ inETH 
                  ? weiToEth9Dec(profits)
                  : showUSD(profitsInUsd)}) </b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
              <Typography variant="h6" textAlign='center' width='10%'>
                -
              </Typography>
              <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} onClick={()=>showDistributionRecords()} >
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

                <Stack direction='row' width='100%' sx={{alignItems:'center'}} >
                  <Typography variant="h6" textAlign='center' width='10%'>
                    +
                  </Typography>
                  <CbpIncome inETH={inETH} exRate={exRate} centPrice={centPrice} sum={cbpIncome} setSum={setCbpIncome} records={cbpIncomeRecords} setRecords={setCbpIncomeRecords} setSumInfo={setSumInfo} setList={setList} setOpen={setOpen} />
                </Stack>

                <Stack direction='row' width='100%' sx={{alignItems:'center'}} >
                  <Typography variant="h6" textAlign='center' width='10%'>
                    +
                  </Typography>

                  <Button variant="outlined" sx={{width:'100%', m:0.5, justifyContent:'start'}} onClick={()=>displayCbpMintToOthers()} >
                    <b>CBP Mint To Others: ({inETH ? weiToEth9Dec(cbpMintOut) : showUSD(cbpMintOutInUsd)}) </b>
                  </Button>
                </Stack>

                <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
                  <Typography variant="h6" textAlign='center' width='10%'>
                    -
                  </Typography>
                  <CbpOutflow inETH={inETH} exRate={exRate} centPrice={centPrice} sum={cbpOutflow} setSum={setCbpOutflow} records={cbpOutflowRecords} setRecords={setCbpOutflowRecords} setSumInfo={setSumInfo} setList={setList} setOpen={setOpen} />
                </Stack>

                <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
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

                <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
                  <Typography variant="h6" textAlign='center' width='10%'>
                    +
                  </Typography>
                  <EthIncome inETH={inETH} exRate={exRate} centPrice={centPrice} sum={ethIncome} setSum={setEthIncome} records={ethIncomeRecords} setRecords={setEthIncomeRecords} setSumInfo={setSumInfo} setList={setList} setOpen={setOpen} />
                </Stack>

                <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
                  <Typography variant="h6" textAlign='center' width='10%'>
                    -
                  </Typography>
                  <EthOutflow inETH={inETH} exRate={exRate} centPrice={centPrice} sum={ethOutflow} setSum={setEthOutflow} records={ethOutflowRecords} setRecords={setEthOutflowRecords} setSumInfo={setSumInfo} setList={setList} setOpen={setOpen} />
                </Stack>

                <Stack direction='row' width='100%' sx={{alignItems:'center'}}  >
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