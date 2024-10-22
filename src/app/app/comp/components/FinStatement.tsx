
import { Paper, Stack, Typography, Divider, Button, Switch } from "@mui/material";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { rate } from "../../fuel_tank/ft";
import { baseToDollar, bigIntToNum, dateParser, stampToUtc, utcToStamp } from "../../common/toolsKit";
import { CbpInflow, CbpInflowSum, defCbpInflowSumArr, updateCbpInflowSum, } from "./FinStatement/Cashflow/CbpInflow";
import { defEthInflowSumArr, EthInflow, EthInflowSum, updateEthInflowSum } from "./FinStatement/Cashflow/EthInflow";
import { CbpOutflow, CbpOutflowSum, defCbpOutflowSumArr, updateCbpOutflowSum } from "./FinStatement/Cashflow/CbpOutflow";
import { defEthOutflowSumArr, EthOutflow, EthOutflowSum, updateEthOutflowSum } from "./FinStatement/Cashflow/EthOutflow";
import { HexType } from "../../common";
import { CashFlowList, SumInfo } from "./FinStatement/CashflowList";
import { defDepositsSumArr, Deposits, DepositsSum, updateDepositsSum } from "./FinStatement/Cashflow/Deposits";
import { defFtEthflowSumArr, FtEthflow, FtEthflowSum, updateFtEthflowSum, } from "./FinStatement/Cashflow/FtEthflow";
import { defFtCbpflowSumArr, FtCbpflow, FtCbpflowSum, updateFtCbpflowSum } from "./FinStatement/Cashflow/FtCbpflow";
import { BtnProps, SGNA } from "./FinStatement/SGNA";
import { getEthPricesForAppendRecords, getPriceAtTimestamp, updateMonthlyEthPrices } from "../../../api/firebase/ethPriceTools";
import { DateTimeField } from "@mui/x-date-pickers";
import { Assets } from "./FinStatement/Assets";
import { LiabilyAndEquity,  } from "./FinStatement/LiabilityAndEquity";
import { IncomeStatement } from "./FinStatement/IncomeStatement";
import { EquityChangeStatement } from "./FinStatement/EquityChangeStatement";
import { CryptoInventory } from "./FinStatement/CryptoInventory";
import { EthflowStatement } from "./FinStatement/EthflowStatement";
import { TipsAndUpdates } from "@mui/icons-material";
import { usePublicClient } from "wagmi";

export interface Cashflow {
  seq: number,
  blockNumber: bigint,
  timestamp: number,
  transactionHash: HexType,
  typeOfIncome: string,
  amt: bigint,
  usd: bigint,
  ethPrice: bigint,
  addr: HexType,
  acct: bigint,
}

export interface ReportItem {
  inEth: bigint,
  inUsd: bigint,
}

export const defReportItem: ReportItem = {
  inEth: 0n,
  inUsd: 0n,
}

export interface CashflowRange {
  head: number,
  tail: number,
  len: number,
}

export const defCashflowRange = {
  head: 0,
  tail: 0,
  len: 0,
}

export interface CashflowRecordsProps {
  exRate: bigint;
  setRecords: Dispatch<SetStateAction<Cashflow[]>>;
}

export interface BtnCompProps {
  inETH: boolean,
  exRate: bigint,
  display: ()=>void,
}

export const showUSD = (usd:bigint) => {
  return baseToDollar((usd / 10n ** 14n).toString()) + ' USD';
}

export const weiToEth9Dec = (eth:bigint) => {
  return bigIntToNum(eth / 10n**9n, 9) + ' ETH';
}

export interface StatementProps {
  inETH: boolean,
  startDate: number,
  endDate: number,
  opnBlkNo: bigint,
  rptBlkNo: bigint,
  centPrice: bigint,
  display: ((type:number)=>void)[],
}

export function trimCashflow(arr: Cashflow[], startDate:number, endDate:number, type: number): Cashflow[] {
  let output: Cashflow[] = [];

    switch (type) {
      case 1: 
        output = arr.filter(v => v.timestamp < startDate);
        break;
      case 2:
        output = arr.filter(v => v.timestamp >= startDate && v.timestamp <= endDate);
        break;
      case 3:
        output = arr.filter(v => v.timestamp <= endDate);
        break;
    }  

  return output;
}

export function FinStatement() {

  const [ cbpInflow, setCbpInflow ] = useState<CbpInflowSum[]>(defCbpInflowSumArr);
  const [ cbpInflowRecords, setCbpInflowRecords ] = useState<Cashflow[]>([]);

  const [ cbpOutflow, setCbpOutflow ] = useState<CbpOutflowSum[]>(defCbpOutflowSumArr);
  const [ cbpOutflowRecords, setCbpOutflowRecords ] = useState<Cashflow[]>([]);

  const [ ethInflow, setEthInflow ] = useState<EthInflowSum[]>(defEthInflowSumArr);
  const [ ethInflowRecords, setEthInflowRecords ] = useState<Cashflow[]>([]);

  const [ ethOutflow, setEthOutflow ] = useState<EthOutflowSum[]>(defEthOutflowSumArr);
  const [ ethOutflowRecords, setEthOutflowRecords ] = useState<Cashflow[]>([]);

  const [ deposits, setDeposits ] = useState<DepositsSum[]>(defDepositsSumArr);
  const [ depositsRecords, setDepositsRecords ] = useState<Cashflow[]>([]);

  const [ ftEthflow, setFtEthflow ] = useState<FtEthflowSum[]>(defFtEthflowSumArr);
  const [ ftEthflowRecords, setFtEthflowRecords] = useState<Cashflow[]>([]);

  const [ ftCbpflow, setFtCbpflow ] = useState<FtCbpflowSum[]>(defFtCbpflowSumArr);
  const [ ftCbpflowRecords, setFtCbpflowRecords] = useState<Cashflow[]>([]);

  const [ flags, setFlags ] = useState<boolean[]>([false, false, false, false, false, false, false]);

  useEffect(()=>{
    let len:boolean[] = [false, false, false, false, false, false, false];
    len[0] = cbpInflowRecords.length > 0;
    len[1] = cbpOutflowRecords.length > 0;
    len[2] = ethInflowRecords.length > 0;
    len[3] = ethOutflowRecords.length > 0;
    len[4] = depositsRecords.length > 0;
    len[5] = ftCbpflowRecords.length > 0;
    len[6] = ftEthflowRecords.length > 0;

    setFlags(len);

  }, [cbpInflowRecords, cbpOutflowRecords, ethInflowRecords, ethOutflowRecords, depositsRecords, ftCbpflowRecords, ftEthflowRecords]);

  const [ inETH, setInETH ] = useState(false);
  const [ exRate, setExRate ] = useState(10000n);

  useEffect(()=>{
    const getRate = async ()=> {
      let rateOfEx = await rate();
      setExRate(rateOfEx);
    }
    getRate();
  });


  const [ startDate, setStartDate ] = useState(Math.floor((new Date('2024-05-18T00:00:00Z')).getTime()/1000));
  const [ endDate, setEndDate] = useState(Math.floor((new Date()).getTime()/1000));

  const [ centPrice, setCentPrice ] = useState(1n);
  const [ ethRateDate, setEthRateDate ] = useState('0');

  const [ rptBlkNo, setRptBlkNo ] = useState(0n);
  const [ opnBlkNo, setOpnBlkNo ] = useState(0n);

  const client = usePublicClient();

  const updateCashflowRange = () => {

    if (endDate < startDate) return;

    setCbpInflow([...updateCbpInflowSum(cbpInflowRecords, startDate, endDate)]);
    setCbpOutflow([...updateCbpOutflowSum(cbpOutflowRecords, startDate, endDate)]);
    setEthInflow([...updateEthInflowSum(ethInflowRecords, startDate, endDate)]);
    setEthOutflow([...updateEthOutflowSum(ethOutflowRecords, startDate, endDate)]);
    setDeposits([...updateDepositsSum(depositsRecords, startDate, endDate)]);
    setFtCbpflow([...updateFtCbpflowSum(ftCbpflowRecords, startDate, endDate)]);
    setFtEthflow([...updateFtEthflowSum(ftEthflowRecords, startDate, endDate)]);


    const findBlocknumberByTimestamp = async (targetTimestamp: bigint) => {

      const latestBlock = await client.getBlock();
      let high = latestBlock.number;
      let low = 0n; 
      let output = high;
    
      while (low <= high) {
        const mid = (low + high) / 2n;
        const block = await client.getBlock({ blockNumber: mid });
    
        if (!block) break; // Block may not be found
        const blockTimestamp = block.timestamp;
    
        if (blockTimestamp < targetTimestamp) {
          low = mid + 1n;
        } else if (blockTimestamp > targetTimestamp) {
          high = mid - 1n;
        } else {
          output = block.number; // Exact match
          break;
        }
    
        output = block.number;
      }
    
      return output;
    }
  
    findBlocknumberByTimestamp(BigInt(endDate)).then(
      blkNo => {
        setRptBlkNo(blkNo);
        console.log('endDate: ', endDate, 'rptBlkNo: ', blkNo);
      }
    );

    findBlocknumberByTimestamp(BigInt(startDate)).then(
      blkNo => {
        setOpnBlkNo(blkNo);
        console.log('startDate: ', startDate, 'opnBlkNo: ', blkNo);
      }
    );

  }

  useEffect(()=>{

    const updateCentPrice = async ()=> {
      await updateMonthlyEthPrices();

      let prices = await getEthPricesForAppendRecords(endDate * 1000);
      if (!prices) return;
  
      let mark = getPriceAtTimestamp(endDate * 1000, prices);
  
      setCentPrice(mark.centPrice);
      setEthRateDate((mark.timestamp / 1000).toString());
    }

    updateCentPrice();
    
  }, [endDate]);

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
 
  // ==== Breakdown Display ====

  const [ items, setItems ] = useState<BtnProps[]>([]);
  const [ showSGNA, setShowSGNA ] = useState(false);

  const [ list, setList ] = useState<Cashflow[]>([]);
  const [ open, setOpen ] = useState(false);
  const [ sumInfo, setSumInfo ] = useState<SumInfo[]>([]);

  const showGasIncomeRecords = (type:number) => {
    let records = trimCashflow(ethInflowRecords, startDate, endDate, type);

    records = records.filter((v)=>v.typeOfIncome == 'GasIncome');

    let curSumInUsd = weiToDust(ethInflow[type].gas);

    let arrSumInfo = inETH 
        ? [ {title: 'Gas Income - (ETH ', data: ethInflow[type].gas}]
        : [ {title: 'Gas Income - (USD ', data: ethInflow[type].gasInUsd},
            {title: 'Exchange Gain/Loss', data: curSumInUsd - ethInflow[type].gasInUsd},
          ];

    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const showPaidInCapRecords = (type:number) => {

    let records = trimCashflow(ethInflowRecords, startDate, endDate, type);

    records = records.filter((v)=>v.typeOfIncome == 'PayInCap' ||
        v.typeOfIncome == 'PayOffCIDeal' || 
        v.typeOfIncome =='CloseBidAgainstInitOffer' ||
        v.typeOfIncome == 'CloseInitOfferAgainstBid'
    );

    let curSumInUsd = weiToDust(ethInflow[type].capital);
    
    let arrSumInfo = inETH 
        ? [ {title: 'Paid In Cap - (ETH ', data: ethInflow[type].capital} ]
        : [ {title: 'Paid In Cap - (USD ', data: ethInflow[type].capitalInUsd},
            {title: 'Exchange Gain/Loss', data: curSumInUsd - ethInflow[type].capitalInUsd},
          ];

    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const showEthTransferIncomeRecords = (type: number) => {

    let records = trimCashflow(ethInflowRecords, startDate, endDate, type);

    records = records.filter((v)=>v.typeOfIncome == 'TransferIncome');
    let curSumInUsd = weiToDust(ethInflow[type].transfer);

    let arrSumInfo = inETH 
        ? [ {title: 'ETH Transfer - (ETH ', data: ethInflow[type].transfer} ]
        : [ {title: 'ETH Transfer - (USD ', data: ethInflow[type].transferInUsd},
            {title: 'Exchange Gain/Loss', data: curSumInUsd - ethInflow[type].transferInUsd},
          ];

    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const showEthGmmPaymentRecords = (type:number) => {

    let records = trimCashflow(ethOutflowRecords, startDate, endDate, type);

    records = records.filter((v)=>v.typeOfIncome == 'GmmTransfer' ||
        v.typeOfIncome == 'GmmExpense');

    let curSumInUsd = weiToDust(ethOutflow[type].gmmTransfer + ethOutflow[type].gmmExpense);

    let arrSumInfo = inETH 
        ? [ {title: 'Gmm Payment - (ETH ', data: ethOutflow[type].gmmTransfer + ethOutflow[type].gmmExpense},
            {title: 'Gmm Transfer', data: ethOutflow[type].gmmTransfer},
            {title: 'Gmm Expense', data: ethOutflow[type].gmmExpense},
          ]
        : [ {title: 'Gmm Payment - (USD ', data: ethOutflow[type].gmmTransferInUsd + ethOutflow[type].gmmExpenseInUsd},
            {title: 'Exchange Gain/Loss', data: (ethOutflow[type].gmmTransferInUsd + ethOutflow[type].gmmExpenseInUsd) - curSumInUsd},
            {title: 'Gmm Transfer', data: ethOutflow[type].gmmTransferInUsd},
            {title: 'Gmm Expense', data: ethOutflow[type].gmmExpenseInUsd},
          ];

    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const showEthBmmPaymentRecords = (type:number) => {

    let records = trimCashflow(ethOutflowRecords, startDate, endDate, type);

    records = records.filter((v)=>v.typeOfIncome == 'BmmTransfer' ||
        v.typeOfIncome == 'BmmExpense');

    let curSumInUsd = weiToDust(ethOutflow[type].bmmTransfer + ethOutflow[type].bmmExpense);

    let arrSumInfo = inETH 
        ? [ {title: 'Bmm Payment - (ETH ', data: ethOutflow[type].bmmTransfer + ethOutflow[type].bmmExpense},
            {title: 'Bmm Transfer', data: ethOutflow[type].bmmTransfer},
            {title: 'Bmm Expense', data: ethOutflow[type].bmmExpense},
          ]
        : [ {title: 'Bmm Payment - (USD ', data: ethOutflow[type].bmmTransferInUsd + ethOutflow[type].bmmExpenseInUsd},
            {title: 'Exchange Gain/Loss', data: (ethOutflow[type].bmmTransferInUsd + ethOutflow[type].bmmExpenseInUsd) - curSumInUsd},
            {title: 'Bmm Transfer', data: ethOutflow[type].bmmTransferInUsd},
            {title: 'Bmm Expense', data: ethOutflow[type].bmmExpenseInUsd},
          ];

    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const showDistributionRecords = (type:number) => {
    let records = trimCashflow(ethOutflowRecords, startDate, endDate, type);

    records = records.filter((v)=>v.typeOfIncome == 'Distribution');

    let curSumInUsd = weiToDust(ethOutflow[type].distribution);

    let arrSumInfo = inETH 
        ? [ {title: 'Distribution - (ETH ', data: ethOutflow[type].distribution} ]
        : [ {title: 'Distribution - (USD ', data: ethOutflow[type].distributionInUsd},
            {title: 'Exchange Gain/Loss', data: ethOutflow[type].distributionInUsd - curSumInUsd},
          ];

    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const showFtEthRecords = (type:number) => {
    let records = trimCashflow(ftEthflowRecords, startDate, endDate, type);

    let curSumInUsd = weiToDust(ftEthflow[type].totalEth);

    let arrSumInfo = inETH
      ? [ {title: 'Eth Balance in FT - (ETH ', data: ftEthflow[type].totalEth},
          {title: 'Gas Income', data: ftEthflow[type].refuelEth},
          {title: 'Income Pickup', data: ftEthflow[type].withdrawEth},
        ]
      : [ {title: 'Eth Balance in FT - (USD ', data: ftEthflow[type].totalEthInUsd},
          {title: 'Exchange Gain/Loss', data: curSumInUsd - ftEthflow[type].totalEthInUsd},
          {title: 'Gas Income', data: ftEthflow[type].refuelEthInUsd},
          {title: 'Income Pickup', data: ftEthflow[type].withdrawEthInUsd},
        ];

    if (records.length > 0) {
      setSumInfo(arrSumInfo);
      setList(records);
      setOpen(true);
    }
  }

  const displayEthOfComp = (type:number) => {
    let items:BtnProps[] = [
      {simbol: ' ', title: 'ETH of Comp', amt: ethInflow[type].totalAmt - ethOutflow[type].totalAmt, amtInUsd: weiToDust(ethInflow[type].totalAmt - ethOutflow[type].totalAmt), show: ()=>{}},
      {simbol: '+', title: 'Gas Income', amt: ethInflow[type].gas, amtInUsd: weiToDust(ethInflow[type].gas), show: ()=>showGasIncomeRecords(type)},
      {simbol: '+', title: 'Paid In Cap', amt: ethInflow[type].capital, amtInUsd: weiToDust(ethInflow[type].capital), show: ()=>showPaidInCapRecords(type)},
      {simbol: '+', title: 'Transfer Income', amt: ethInflow[type].transfer, amtInUsd: weiToDust(ethInflow[type].transfer), show: ()=>showEthTransferIncomeRecords(type)},
      {simbol: '-', title: 'Gmm Payment', amt: ethOutflow[type].gmmTransfer + ethOutflow[type].gmmExpense, amtInUsd: weiToDust(ethOutflow[type].gmmExpense + ethOutflow[type].gmmTransfer), show: ()=>showEthGmmPaymentRecords(type)},
      {simbol: '-', title: 'Bmm Payment', amt: ethOutflow[type].bmmTransfer + ethOutflow[type].bmmExpense, amtInUsd: weiToDust(ethOutflow[type].bmmExpense + ethOutflow[type].bmmTransfer), show: ()=>showEthBmmPaymentRecords(type)},
      {simbol: '-', title: 'Distribution', amt: ethOutflow[type].distribution, amtInUsd: weiToDust(ethOutflow[type].distribution), show: ()=>showDistributionRecords(type)},
    ];

    if (items.length > 0) {
      setItems(items);
      setShowSGNA(true);
    }
  }

  // ==== Liabilities ====

  const showFuelSoldRecords = (type:number) => {
    let records = trimCashflow(cbpOutflowRecords, startDate, endDate, type);

    records = records.filter((v)=>v.typeOfIncome == 'FuelSold');

    let curSumInUsd = weiToDust(cbpToETH(cbpOutflow[type].fuelSold));

    let arrSumInfo = inETH 
        ? [ {title: 'Fuel Sold - (ETH ', data: cbpToETH(cbpOutflow[type].fuelSold)} ]
        : [ {title: 'Fuel Sold - (USD ', data: cbpOutflow[type].fuelSoldInUsd},
            {title: 'Exchange Gain/Loss', data: cbpOutflow[type].fuelSoldInUsd - curSumInUsd},
          ];
    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const showGmmCbpPaymentRecords = (type:number) => {
    let records = trimCashflow(cbpOutflowRecords, startDate, endDate, type);

    records = records.filter((v)=>v.typeOfIncome == 'GmmTransfer');

    let curSumInUsd = weiToDust(cbpToETH(cbpOutflow[type].gmmTransfer));

    let arrSumInfo = inETH 
        ? [ {title: 'Gmm CBP Payment - (ETH ', data: cbpToETH(cbpOutflow[type].gmmTransfer)} ]
        : [ {title: 'Gmm CBP Payment - (USD ', data: cbpOutflow[type].gmmTransferInUsd},
            {title: 'Exchange Gain/Loss', data: cbpOutflow[type].gmmTransferInUsd - curSumInUsd},
          ];
    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const showBmmCbpPaymentRecords = (type:number) => {
    let records = trimCashflow(cbpOutflowRecords, startDate, endDate, type);

    records = records.filter((v)=>v.typeOfIncome == 'BmmTransfer');

    let curSumInUsd = weiToDust(cbpToETH(cbpOutflow[type].bmmTransfer));

    let arrSumInfo = inETH 
        ? [ {title: 'Bmm CBP Payment - (ETH ', data: cbpToETH(cbpOutflow[type].bmmTransfer)} ]
        : [ {title: 'Bmm CBP Payment - (USD ', data: cbpOutflow[type].bmmTransferInUsd},
            {title: 'Exchange Gain/Loss', data: cbpOutflow[type].bmmTransferInUsd - curSumInUsd},
          ];
    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const displayDeferredRevenue = (type:number) => {

    let deferredRevenue = cbpToETH(cbpOutflow[type].totalAmt - cbpInflow[type].totalAmt + cbpInflow[type].mint);
    let deferredRevenueInUsd = weiToDust(deferredRevenue);

    let items:BtnProps[] = [
      {simbol: ' ', title: 'Deferred Revenue', amt: deferredRevenue, amtInUsd: deferredRevenueInUsd, show: ()=>{}},
      {simbol: '+', title: 'Fuel Sold', amt: cbpToETH(cbpOutflow[type].fuelSold), amtInUsd: weiToDust(cbpToETH(cbpOutflow[type].fuelSold)), show: ()=>showFuelSoldRecords(3)},
      {simbol: '+', title: 'Gmm CBP Payment', amt: cbpToETH(cbpOutflow[type].gmmTransfer), amtInUsd: weiToDust(cbpToETH(cbpOutflow[type].gmmTransfer)), show: ()=>showGmmCbpPaymentRecords(3)},
      {simbol: '+', title: 'Bmm CBP Payment', amt: cbpToETH(cbpOutflow[type].bmmTransfer), amtInUsd: weiToDust(cbpToETH(cbpOutflow[type].bmmTransfer)), show: ()=>showBmmCbpPaymentRecords(3)},
      {simbol: '+', title: 'New User Awards', amt: cbpToETH(cbpOutflow[type].newUserAward), amtInUsd: weiToDust(cbpToETH(cbpOutflow[type].newUserAward)), show: ()=>showNewUserAwardRecords(3)},
      {simbol: '+', title: 'Startup Cost', amt: cbpToETH(cbpOutflow[type].startupCost), amtInUsd: weiToDust(cbpToETH(cbpOutflow[type].startupCost)), show: ()=>showStartupCostRecords(3)},
      {simbol: '-', title: 'Royalty Income', amt: cbpToETH(cbpInflow[type].royalty), amtInUsd: weiToDust(cbpToETH(cbpInflow[type].royalty)), show: ()=>showRoyaltyRecords(3)},
    ];

    if (items.length > 0) {
      setItems(items);
      setShowSGNA(true);
    }
  }

  // ==== Income ====

  const showRoyaltyRecords = (type:number) => {

    let records = trimCashflow(cbpInflowRecords, startDate, endDate, type);

    records = records.filter((v)=>v.typeOfIncome == 'Royalty');

    let curSumInUsd = weiToDust(cbpToETH(cbpInflow[type].royalty));

    let arrSumInfo = inETH 
        ? [ {title: 'Royalty Income - (ETH ', data: cbpInflow[type].royalty * 10000n / exRate} ]
        : [ {title: 'Royalty Income - (USD ', data: cbpInflow[type].royaltyInUsd},
            {title: 'Exchange Gain/Loss', data: curSumInUsd - cbpInflow[type].royaltyInUsd},
          ];
    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const showOtherIncomeRecords = (type:number) => {

    let records = trimCashflow(ethInflowRecords, startDate, endDate, type);

    records = records.filter((v)=>v.typeOfIncome == 'TransferIncome');

    let curSumInUsd = weiToDust(ethInflow[type].transfer);

    let arrSumInfo = inETH
        ? [ {title: 'Other Income (ETH ', data: ethInflow[type].transfer} ]
        : [ {title: 'Other Income - (USD ', data: ethInflow[type].transferInUsd},
            {title: 'Exchange Gain/Loss', data: curSumInUsd - ethInflow[type].transferInUsd},
          ];
    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const showGmmExpRecords = (type:number) => {

    let records = trimCashflow(ethOutflowRecords, startDate, endDate, type);
    records = records.concat(trimCashflow(cbpOutflowRecords, startDate, endDate, type));

    records = records.filter((v) => v.typeOfIncome == 'GmmTransfer' ||
        v.typeOfIncome == 'GmmExpense');

    records = records.sort((a, b)=>Number(a.timestamp - b.timestamp));

    let curSumInUsd = weiToDust(cbpToETH(cbpOutflow[type].gmmTransfer) + ethOutflow[type].gmmTransfer + ethOutflow[type].gmmExpense);

    let arrSumInfo = inETH
        ? [ {title: 'GMM Expense - (ETH ', data: (ethOutflow[type].gmmTransfer + ethOutflow[type].gmmExpense + cbpOutflow[type].gmmTransfer * 10000n /exRate)},
          {title: 'CBP Transfer', data: cbpOutflow[type].gmmTransfer * 10000n / exRate},
          {title: 'ETH Transfer', data: ethOutflow[type].gmmTransfer},
          {title: 'ETH Action Expense', data: ethOutflow[type].gmmExpense}]
        : [ {title: 'GMM Expense - (USD ', data: (ethOutflow[type].gmmTransferInUsd + ethOutflow[type].gmmExpenseInUsd + cbpOutflow[type].gmmTransferInUsd)},
          {title: 'Exchange Gain/Loss', data: cbpOutflow[type].gmmTransferInUsd + ethOutflow[type].gmmTransferInUsd + ethOutflow[type].gmmExpenseInUsd - curSumInUsd },          
          {title: 'CBP Transfer', data: cbpOutflow[type].gmmTransferInUsd},
          {title: 'ETH Transfer', data: ethOutflow[type].gmmTransferInUsd},
          {title: 'ETH Action Expense', data: ethOutflow[type].gmmExpenseInUsd}];

    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  } 

  const showBmmExpRecords = (type:number) => {

    let records = trimCashflow(ethOutflowRecords, startDate, endDate, type);
    records = records.concat(trimCashflow(cbpOutflowRecords, startDate, endDate, type));

    records = records.filter((v) => v.typeOfIncome == 'BmmTransfer' || v.typeOfIncome == 'BmmExpense');

    records = records.sort((a, b) => Number(a.timestamp - b.timestamp));

    let curSumInUsd = weiToDust(cbpToETH(cbpOutflow[type].bmmTransfer) + ethOutflow[type].bmmTransfer + ethOutflow[type].bmmExpense);

    let arrSumInfo = inETH
        ? [ {title: 'BMM Expense (ETH ', data: (ethOutflow[type].bmmTransfer + ethOutflow[type].bmmExpense + cbpOutflow[type].bmmTransfer * 10000n /exRate)},
          {title: 'CBP Transfer', data: cbpOutflow[type].bmmTransfer * 10000n / exRate},
          {title: 'ETH Transfer', data: ethOutflow[type].bmmTransfer},
          {title: 'ETH Action Expense', data: ethOutflow[type].bmmExpense} ]
        : [ {title: 'BMM Expense - (USD ', data: (ethOutflow[type].bmmTransferInUsd + ethOutflow[type].bmmExpenseInUsd + cbpOutflow[type].bmmTransferInUsd)},
          {title: 'Exchange Gain/Loss', data: cbpOutflow[type].bmmTransferInUsd + ethOutflow[type].bmmTransferInUsd + ethOutflow[type].bmmExpenseInUsd - curSumInUsd },          
          {title: 'CBP Transfer', data: cbpOutflow[type].bmmTransferInUsd},
          {title: 'ETH Transfer', data: ethOutflow[type].bmmTransferInUsd},
          {title: 'ETH Action Expense', data: ethOutflow[type].bmmExpenseInUsd} ];

    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const showNewUserAwardRecords = (type:number) => {

    let records = trimCashflow(cbpOutflowRecords, startDate, endDate, type);

    records = records.filter((v) => v.typeOfIncome == 'NewUserAward');

    let curSumInUsd = weiToDust(cbpToETH(cbpOutflow[type].newUserAward));

    let arrSumInfo = inETH 
        ? [ {title: 'New User Award (ETH ', data: cbpOutflow[type].newUserAward * 10000n / exRate }]
        : [ {title: 'New User Award (USD ', data: cbpOutflow[type].newUserAwardInUsd}, 
            {title: 'Exchange Gain/Loss', data: cbpOutflow[type].newUserAwardInUsd - curSumInUsd},
          ];

    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const showStartupCostRecords = (type:number) => {
    let records = trimCashflow(cbpOutflowRecords, startDate, endDate, type);

    records = records.filter((v) => v.typeOfIncome == 'StartupCost');

    let curSumInUsd = weiToDust(cbpToETH(cbpOutflow[type].startupCost));

    let arrSumInfo = inETH 
        ? [ {title: 'Startup Cost (ETH ', data: cbpOutflow[type].startupCost * 10000n / exRate }]
        : [ {title: 'Startup Cost (USD ', data: cbpOutflow[type].startupCostInUsd },
            {title: 'Exchange Gain/Loss', data: cbpOutflow[type].startupCostInUsd - curSumInUsd },
          ];

    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const displaySGNA = (type:number) => {

  let gmmExp = cbpToETH(cbpOutflow[type].gmmTransfer) + ethOutflow[type].gmmTransfer + ethOutflow[type].gmmExpense;
  let gmmExpInUsd = cbpOutflow[type].gmmTransferInUsd + ethOutflow[type].gmmTransferInUsd + ethOutflow[type].gmmExpense;

  let bmmExp = cbpToETH(cbpOutflow[type].bmmTransfer) + ethOutflow[type].bmmTransfer + ethOutflow[type].bmmExpense;
  let bmmExpInUsd = cbpOutflow[type].bmmTransferInUsd + ethOutflow[type].bmmTransferInUsd + ethOutflow[type].bmmExpense;

  let sgNa = gmmExp + bmmExp + cbpToETH(cbpOutflow[type].newUserAward + cbpOutflow[type].startupCost);
  let sgNaInUsd = gmmExpInUsd + bmmExpInUsd + cbpOutflow[type].newUserAwardInUsd + cbpOutflow[type].startupCostInUsd;

    let items:BtnProps[] = [
      {simbol: ' ', title: 'Sales, General & Administrative', amt: sgNa, amtInUsd: sgNaInUsd, show: ()=>{}},
      {simbol: '+', title: 'New User Awards', amt:cbpToETH(cbpOutflow[type].newUserAward) , amtInUsd: cbpOutflow[type].newUserAwardInUsd, show: ()=>showNewUserAwardRecords(type)},
      {simbol: '+', title: 'Startup Cost', amt:cbpToETH(cbpOutflow[type].startupCost) , amtInUsd: cbpOutflow[type].startupCostInUsd, show: ()=>showStartupCostRecords(type)},
      {simbol: '+', title: 'GMM Approved Expense', amt:gmmExp , amtInUsd: gmmExpInUsd, show: ()=>showGmmExpRecords(type)},
      {simbol: '+', title: 'BMM Approved Expense', amt:bmmExp , amtInUsd: bmmExpInUsd, show: ()=>showBmmExpRecords(type)},
    ];

    if (items.length > 0) {
      setItems(items);
      setShowSGNA(true);
    }
  }

  const displayCbpMintToOthers = (type:number) => {

    let cbpMintOut = cbpToETH(cbpOutflow[type].newUserAward + cbpOutflow[type].startupCost);
    let cbpMintOutInUsd = cbpOutflow[type].newUserAwardInUsd + cbpOutflow[type].startupCostInUsd;

    let items:BtnProps[] = [
      {simbol: ' ', title: 'CBP Mint To Others', amt: cbpMintOut, amtInUsd: cbpMintOutInUsd, show: ()=>{}},
      {simbol: '+', title: 'New User Awards', amt:cbpToETH(cbpOutflow[type].newUserAward) , amtInUsd: cbpOutflow[type].newUserAwardInUsd, show: ()=>showNewUserAwardRecords(type)},
      {simbol: '+', title: 'Startup Cost', amt:cbpToETH(cbpOutflow[type].startupCost) , amtInUsd: cbpOutflow[type].startupCostInUsd, show: ()=>showStartupCostRecords(type)},
    ];

    if (items.length > 0) {
      setItems(items);
      setShowSGNA(true);
    }
  }

  // ==== EthInflow ====

  const displayEthInflow = (type:number) => {

    let records = trimCashflow(ethInflowRecords, startDate, endDate, type);

    let curSumInUsd = ethInflow[type].totalAmt * 10n ** 16n / centPrice;

    let arrSumInfo = inETH
      ? [ {title: 'ETH Income - (ETH ', data: ethInflow[type].totalAmt},
          {title: 'GasIncome', data: ethInflow[type].gas},
          {title: 'PayInCap', data: ethInflow[type].capital},
          {title: 'TransferIncome', data: ethInflow[type].transfer} 
        ]
      : [ {title: 'ETH Income - (USD ', data: ethInflow[type].sumInUsd},
          {title: 'Exchange Gain/Loss', data: curSumInUsd - ethInflow[type].sumInUsd},
          {title: 'GasIncome', data: ethInflow[type].gasInUsd},
          {title: 'PayInCap', data: ethInflow[type].capitalInUsd},
          {title: 'TransferIncome', data: ethInflow[type].transferInUsd}
        ];

    setSumInfo(arrSumInfo);
    setList(records);
    setOpen(true);
  }

  const displayEthOutflow = (type:number) => {

    let records = trimCashflow(ethOutflowRecords, startDate, endDate, type);

    let curSumInUsd = ethOutflow[type].totalAmt * 10n ** 16n / centPrice;

    let arrSumInfo = inETH
      ? [ {title: 'ETH Outflow - (ETH ', data: ethOutflow[type].totalAmt},
          {title: 'Distribution', data: ethOutflow[type].distribution},
          {title: 'GMM Transfer', data: ethOutflow[type].gmmTransfer},
          {title: 'GMM Expense', data: ethOutflow[type].gmmExpense},
          {title: 'BMM Transfer', data: ethOutflow[type].bmmTransfer},
          {title: 'BMM Expense', data: ethOutflow[type].bmmExpense},
        ]
      : [ {title: 'ETH Outflow - (USD ', data: ethOutflow[type].sumInUsd},
          {title: 'Exchange Gain/Loss', data: ethOutflow[type].sumInUsd - curSumInUsd},
          {title: 'Distribution', data: ethOutflow[type].distributionInUsd},
          {title: 'GMM Transfer', data: ethOutflow[type].gmmTransferInUsd},
          {title: 'GMM Expense', data: ethOutflow[type].gmmExpenseInUsd},
          {title: 'BMM Transfer', data: ethOutflow[type].bmmTransferInUsd},
          {title: 'BMM Expense', data: ethOutflow[type].bmmExpenseInUsd}
        ];
    setSumInfo(arrSumInfo);
    setList(records);
    setOpen(true);
  }

  const displayCbpInflow = (type:number) => {

    let records = trimCashflow(cbpInflowRecords, startDate, endDate, type);

    let curSumInUsd = cbpInflow[type].totalAmt * 10000n / exRate * 10n ** 16n / centPrice;

    let arrSumInfo = inETH
        ? [ {title: 'CBP Income - (CBP ', data: cbpInflow[type].totalAmt},
            {title: 'Royalty', data: cbpInflow[type].royalty},
            {title: 'Transfer', data: cbpInflow[type].transfer}, 
            {title: 'Mint', data: cbpInflow[type].mint}]
        : [ {title: 'CBP Income - (USD ', data: cbpInflow[type].sumInUsd},
            {title: 'Exchange Gain/Loss', data: curSumInUsd - cbpInflow[type].sumInUsd},
            {title: 'Royalty', data: cbpInflow[type].royaltyInUsd},
            {title: 'Transfer', data: cbpInflow[type].transferInUsd},
            {title: 'Mint', data: cbpInflow[type].mintInUsd}]; 

    setSumInfo(arrSumInfo);
    setList(records);
    setOpen(true);
  }

  const displayCbpOutflow = (type:number) => {

    let records = trimCashflow(cbpOutflowRecords, startDate, endDate, type);

    let curSumInUsd = cbpOutflow[type].totalAmt * 10000n / exRate * 10n ** 16n / centPrice;

    let arrSumInfo = inETH
        ? [ {title: 'CBP Outflow - (CBP ', data: cbpOutflow[type].totalAmt},
            {title: 'New User Award', data: cbpOutflow[type].newUserAward},
            {title: 'Startup Cost', data: cbpOutflow[type].startupCost},
            {title: 'Fuel Sold', data: cbpOutflow[type].fuelSold},
            {title: 'GMM Transfer', data: cbpOutflow[type].gmmTransfer},
            {title: 'BMM Transfer', data: cbpOutflow[type].bmmTransfer} 
          ]
        : [ {title: 'CBP Outflow - (USD ', data: cbpOutflow[type].sumInUsd},
            {title: 'Exchange Gain/Loss', data: cbpOutflow[type].sumInUsd - curSumInUsd},
            {title: 'New User Award', data: cbpOutflow[type].newUserAward},
            {title: 'Startup Cost', data: cbpOutflow[type].startupCostInUsd},
            {title: 'Fuel Sold', data: cbpOutflow[type].fuelSoldInUsd},
            {title: 'GMM Transfer', data: cbpOutflow[type].gmmTransferInUsd},
            {title: 'BMM Transfer', data: cbpOutflow[type].bmmTransferInUsd} 
          ];
    setSumInfo(arrSumInfo);
    setList(records);
    setOpen(true);
  }

  const displayDepositsInflow = (type:number) => {
    let records = trimCashflow(depositsRecords, startDate, endDate, type);

    records = records.filter(v => v.typeOfIncome != 'Pickup' && v.typeOfIncome != 'CustodyValueOfBidOrder' &&
        v.typeOfIncome != 'CloseOfferAgainstBid' && v.typeOfIncome != 'RefundValueOfBidOrder' && 
        v.typeOfIncome != 'CloseInitOfferAgainstBid'
    )

    let inEth = deposits[type].balance + deposits[type].consideration + deposits[type].distribution;
    let inUsd = deposits[type].balanceInUsd + deposits[type].considerationInUsd + deposits[type].distributionInUsd;
    let exChangeGainLoss = weiToDust(inEth) - inUsd;


    let arrSumInfo = inETH
      ? [ {title: 'Deposits Inflow - (ETH ', data: inEth},
          {title: 'Consideration', data: deposits[type].consideration},
          {title: 'Distribution', data: deposits[type].distribution},
          {title: 'Balance', data: deposits[type].balance} 
        ]
      : [ {title: 'Deposits Inflow - (USD ', data: inUsd},
          {title: 'Exchange Gain/Loss', data: exChangeGainLoss},
          {title: 'Consideration', data: deposits[type].considerationInUsd},
          {title: 'Distribution', data: deposits[type].distributionInUsd},
          {title: 'Balance', data: deposits[type].balanceInUsd}
        ];

    setSumInfo(arrSumInfo);
    setList(records);
    setOpen(true);
  }

  const displayCustody = (type:number) => {
    let records = trimCashflow(depositsRecords, startDate, endDate, type);

    records = records.filter(v => v.typeOfIncome == 'CustodyValueOfBidOrder' || v.typeOfIncome == 'CloseOfferAgainstBid' ||
        v.typeOfIncome == 'RefundValueOfBidOrder' || v.typeOfIncome == 'CloseInitOfferAgainstBid'
    )

    let exchangeGainLoss = weiToDust(deposits[type].custody) - deposits[type].custodyInUsd;

    let arrSumInfo = inETH
      ? [ {title: 'Custody - (ETH ', data: deposits[type].custody},
        ]
      : [ {title: 'Custody - (USD ', data: deposits[type].custodyInUsd},
          {title: 'Exchange Gain/Loss', data: exchangeGainLoss},
        ];

    setSumInfo(arrSumInfo);
    setList(records);
    setOpen(true);
  }

  const displayDepositsOutflow = (type:number) => {
    let records = trimCashflow(depositsRecords, startDate, endDate, type);

    records = records.filter(v => v.typeOfIncome == 'Pickup');
    let exchangeGainLoss = weiToDust(deposits[type].pickup) - deposits[type].pickupInUsd;

    let arrSumInfo = inETH
      ? [ {title: 'Deposits Outflow - (ETH ', data: deposits[type].pickup},
          {title: 'Pickup', data: deposits[type].pickup},
        ]
      : [ {title: 'Deposits Outflow - (USD ', data: deposits[type].pickupInUsd},
          {title: 'Exchange Gain/Loss', data: exchangeGainLoss},
          {title: 'Pickup', data: deposits[type].pickupInUsd},
        ];

    setSumInfo(arrSumInfo);
    setList(records);
    setOpen(true);
  }



  const displayFtCbpflow = (type:number) => {
    let records = trimCashflow(ftCbpflowRecords, startDate, endDate, type);

    let curSumCbpInUsd =  ftCbpflow[type].totalCbp * 10000n / exRate * 10n ** 16n / centPrice;

    let arrSumInfo = inETH
      ? [ {title: 'CBP Balance in FT - (CBP ', data: ftCbpflow[type].totalCbp},
          {title: '+ Add Fuel', data: ftCbpflow[type].addCbp},
          {title: '- Fuel Sold', data: ftCbpflow[type].refuelCbp},
          {title: '- Fuel Withdrawn', data: ftCbpflow[type].withdrawCbp}
        ]
      : [ {title: 'CBP Balance in FT - (USD ', data: ftCbpflow[type].totalCbpInUsd},
          {title: 'Exchange Gain/Loss', data: curSumCbpInUsd - ftCbpflow[type].totalCbpInUsd},
          {title: '+ Add Fuel', data: ftCbpflow[type].addCbpInUsd},
          {title: '- Fuel Sold', data: ftCbpflow[type].refuelCbpInUsd},
          {title: '- Fuel Withdrawn', data: ftCbpflow[type].withdrawCbpInUsd}
        ];

    setSumInfo(arrSumInfo);
    setList(records);
    setOpen(true);
  }

  const displayFtEthflow = (type:number) => {
    let records = trimCashflow(ftEthflowRecords, startDate, endDate, type);

    let curSumInUsd = ftEthflow[type].totalEth * 10n ** 16n / centPrice;

    let arrSumInfo = inETH
      ? [ {title: 'Eth Balance in FT - (ETH ', data: ftEthflow[type].totalEth},
          {title: 'Gas Income', data: ftEthflow[type].refuelEth},
          {title: 'Income Pickup', data: ftEthflow[type].withdrawEth},
        ]
      : [ {title: 'Eth Balance in FT - (USD ', data: ftEthflow[type].totalEthInUsd},
          {title: 'Exchange Gain/Loss', data: curSumInUsd - ftEthflow[type].totalEthInUsd},
          {title: 'Gas Income', data: ftEthflow[type].refuelEthInUsd},
          {title: 'Income Pickup', data: ftEthflow[type].withdrawEthInUsd},
        ];
    setSumInfo(arrSumInfo);
    setList(records);
    setOpen(true);
  }


  return (
    <Paper elevation={3} 
      sx={{
        m:1, p:1, border:1,
        borderColor:'divider',
        width: '100%' 
      }} 
    >

      <Stack direction='row' sx={{ alignItems:'center', justifyContent:'space-between' }} >

        <Stack direction='row' sx={{alignItems:'center'}}>

          <Stack direction='column' sx={{ alignItems:'center' }} >
            <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
              <b>Financial Statement</b> 
            </Typography>
            <Typography variant='body2' sx={{ m:2, my:0, textDecoration:'underline'}} >
              Date: ({dateParser(ethRateDate)}) 
            </Typography>

          </Stack>  

          <Divider orientation="vertical" flexItem sx={{ m:2 }} />

          <Stack direction='column' sx={{ alignItems:'center' }} >
            <Stack direction='row' sx={{ alignItems:'center' }} >

              <Typography variant='h6' color= {inETH ? 'gray' : 'blue'} sx={{ m:2 }} >
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

            <Stack direction='row' sx={{ alignItems:'center' }} >

              <Typography variant='body2' sx={{ m:2, my:0, textDecoration:'underline'}} >
                {baseToDollar((10n**20n/centPrice).toString())} (USD/ETH) 
              </Typography>

            </Stack>

          </Stack>

          <Divider orientation="vertical" flexItem sx={{ m:2 }} />

          <Stack direction='row' sx={{ m:2, alignItems:'center'}} >

            <DateTimeField
              label='BeginningDate'
              helperText=' '
              sx={{m:1, mt:3, minWidth:188 }}
              value={ stampToUtc(startDate) }
              onChange={(date) => setStartDate(utcToStamp(date))}
              format='YYYY-MM-DD HH:mm:ss'
              size='small'
            />

            <Typography variant='body2' sx={{ m:2}} >
              ——
            </Typography>

            <DateTimeField
              label='EnddingDate'
              helperText=' '
              sx={{m:1, mt:3, minWidth:188 }}
              value={ stampToUtc(endDate) }
              onChange={(date) => setEndDate( utcToStamp(date) )}
              format='YYYY-MM-DD HH:mm:ss'
              size='small'
            />

            <Button variant="contained" sx={{m:2, mt:0.8, mr:20, width:'128'}} onClick={()=>updateCashflowRange()} disabled={flags.findIndex(v => v==true) < 0 || startDate > endDate} >
              Update Period
            </Button>

            {flags.map((v, i)=>(
              <TipsAndUpdates key={i} color={ v ? 'warning' : 'disabled'} sx={{m:1}} />
            ))}

          </Stack>

        </Stack>

      </Stack>

      <CbpInflow exRate={exRate} setRecords={setCbpInflowRecords} />

      <CbpOutflow exRate={exRate} setRecords={setCbpOutflowRecords} />

      <EthInflow exRate={exRate} setRecords={setEthInflowRecords} />

      <EthOutflow exRate={exRate} setRecords={setEthOutflowRecords} />

      <Deposits exRate={exRate} setRecords={setDepositsRecords} />

      <FtCbpflow exRate={exRate} setRecords={setFtCbpflowRecords} />

      <FtEthflow exRate={exRate} setRecords={setFtEthflowRecords} />

      <CashFlowList inETH={inETH} arrSum={sumInfo} records={list} open={open} setOpen={setOpen}/>

      <SGNA inETH={inETH} items={items} open={showSGNA} setOpen={setShowSGNA} />
          
      <Stack direction='row' >

        <Assets inETH={inETH} centPrice={centPrice} startDate={startDate} endDate={endDate} opnBlkNo={opnBlkNo} rptBlkNo={rptBlkNo} display={[()=>displayEthOfComp(3)]} ethInflow={ethInflow} ethOutflow={ethOutflow} />

        <LiabilyAndEquity inETH={inETH} centPrice={centPrice} exRate={exRate} startDate={startDate} opnBlkNo={opnBlkNo} endDate={endDate} rptBlkNo={rptBlkNo} display={[()=>displayDeferredRevenue(3), ()=>showPaidInCapRecords(3)]} cbpInflow={cbpInflow} cbpOutflow={cbpOutflow} ethInflow={ethInflow} ethOutflow={ethOutflow} />

      </Stack>
      
      <Stack direction='row'>

        <Stack width='50%' direction='column' sx={{m:1}} >

          <IncomeStatement inETH={inETH} centPrice={centPrice} exRate={exRate} startDate={startDate} endDate={endDate} opnBlkNo={opnBlkNo} rptBlkNo={rptBlkNo} display={[()=>showRoyaltyRecords(2), ()=>showOtherIncomeRecords(2), ()=>displaySGNA(2)]} cbpInflow={cbpInflow} cbpOutflow={cbpOutflow} ethInflow={ethInflow} ethOutflow={ethOutflow} />
 
          <EquityChangeStatement inETH={inETH} centPrice={centPrice} exRate={exRate} startDate={startDate} endDate={endDate} opnBlkNo={opnBlkNo} rptBlkNo={rptBlkNo} display={[()=>showPaidInCapRecords(2), ()=>showDistributionRecords(2)]} cbpInflow={cbpInflow} cbpOutflow={cbpOutflow} ethInflow={ethInflow} ethOutflow={ethOutflow} />

        </Stack>

        <Stack width='50%'  direction='column' sx={{m:1}}>

          <EthflowStatement inETH={inETH} exRate={exRate} centPrice={centPrice} startDate={startDate} endDate={endDate} opnBlkNo={opnBlkNo} rptBlkNo={rptBlkNo} display={[()=>displayCbpInflow(2), ()=>displayCbpMintToOthers(2), ()=>displayCbpOutflow(2), ()=>displayFtCbpflow(2), ()=>displayEthInflow(2), ()=>displayEthOutflow(2), ()=>displayFtEthflow(3), ()=>displayDepositsInflow(2), ()=>displayCustody(2),  ()=>displayDepositsOutflow(2)]} cbpInflow={cbpInflow} cbpOutflow={cbpOutflow} ethInflow={ethInflow} ethOutflow={ethOutflow} ftCbpflow={ftCbpflow} ftEthflow={ftEthflow} deposits={deposits} />

        </Stack>

      </Stack>

      <Stack direction='row' >

        <CryptoInventory inETH={inETH} exRate={exRate} centPrice={centPrice} startDate={startDate} endDate={endDate} opnBlkNo={opnBlkNo} rptBlkNo={rptBlkNo} display={[()=>displayCbpInflow(2), ()=>displayCbpMintToOthers(2), ()=>displayCbpOutflow(2), ()=>displayFtCbpflow(2), ()=>displayEthInflow(2), ()=>displayEthOutflow(2), ()=>displayFtEthflow(3), ()=>displayDepositsInflow(2), ()=>displayCustody(2),  ()=>displayDepositsOutflow(2)]} cbpInflow={cbpInflow} cbpOutflow={cbpOutflow} ethInflow={ethInflow} ethOutflow={ethOutflow} ftCbpflow={ftCbpflow} ftEthflow={ftEthflow} deposits={deposits} />

      </Stack>

    </Paper>
  );
} 