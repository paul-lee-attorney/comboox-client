
import { Paper, Stack, Typography, Divider, Button, Switch } from "@mui/material";

import { useComBooxContext } from "../../../_providers/ComBooxContextProvider";
import { useEffect, useState } from "react";
import { rate } from "../../fuel_tank/ft";
import { baseToDollar, bigIntToNum, bigIntToStrNum } from "../../common/toolsKit";
import { CbpIncome, CbpIncomeSumProps, defaultSum,  } from "./FinStatement/CbpIncome";
import { defaultEthIncomeSum, EthIncome, EthIncomeSumProps } from "./FinStatement/EthIncome";
import { CbpOutflow, CbpOutflowSumProps, defaultCbpOutSum } from "./FinStatement/CbpOutflow";
import { defaultEthOutSum, EthOutflow, EthOutflowSumProps } from "./FinStatement/EthOutflow";
import { HexType } from "../../common";
import { CashFlowList, SumInfo } from "./FinStatement/CashflowList";
import { defaultDepositsSum, Deposits, DepositsSumProps } from "./FinStatement/Deposits";
import { balanceOfWei, getCentPriceInWei } from "../../rc";
import { usePublicClient } from "wagmi";
import { totalDeposits } from "../gk";

export type CashflowProps = {
  seq: number,
  blockNumber: bigint,
  timestamp: bigint,
  transactionHash: HexType,
  typeOfIncome: string,
  amt: bigint,
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

  const [ exRate, setExRate ] = useState(10000n);
  const [ inETH, setInETH ] = useState(false);

  useEffect(()=>{
    const getRate = async ()=> {
      let rateOfEx = await rate(undefined);
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

  useEffect(()=>{
    if (gk) {
      balanceOfWei(gk).then(
        res => setBalanceOfEth(res)
      );

      totalDeposits(gk, undefined).then(
        res => setDepositsOfETH(res)
      )      
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

  const ethToBP = (eth: bigint) => {
    return eth * 100n / centPrice;
  }

  const cbpToETH = (cbp: bigint) => {
    return cbp * 10000n / exRate;
  }

  // const bpToETH = (bp: bigint) => {
  //   return bp * centPrice / 100n;
  // }

  const ethToUSD = (eth: bigint) => {
    return baseToDollar(ethToBP(eth).toString()) + ' USD';
  }

  const ethToGwei = (eth: bigint) => {
    return bigIntToNum(eth / 10n**9n, 9) + ' ETH';
  }

  // let initContribution = isComBoox ? bpToETH(300000n * 10000n) : 0n;

  // let armotization = isComBoox ? bpToETH(300000n * 10000n / (15n * 365n) * days) : 0n;

  let gmmExp = cbpToETH(cbpOutflow.gmmTransfer) + ethOutflow.gmmTransfer + ethOutflow.gmmExpense;

  let bmmExp = cbpToETH(cbpOutflow.bmmTransfer) + ethOutflow.bmmTransfer + ethOutflow.bmmExpense;

  let ebitda = cbpIncome.royalty + ethIncome.transfer - gmmExp - bmmExp;
  
  let profits = ebitda - armotization;

  let totalAssets = initContribution - armotization + (balanceOfEth - depositsOfETH);

  let equityChange = ethIncome.capital + ebitda
    + ethIncome.gas - cbpToETH(cbpIncome.royalty)
    - ethOutflow.ownersEquity - armotization;

  let totalEquity = initContribution + equityChange;

  let deferredIncome = ethIncome.gas - cbpToETH(cbpIncome.royalty);

  let ownersEquity = initContribution + equityChange;

  // ==== Details Display ====

  const showRoyaltyRecords = () => {
    let records = cbpIncomeRecords.filter((v)=>v.typeOfIncome == 'Royalty');
    let arrSumInfo = [
      {title: 'Royalty Income - (CBP ', data: cbpIncome.royalty}
    ];
    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const showOtherIncomeRecords = () => {
    let records = ethIncomeRecords.filter((v)=>v.typeOfIncome == 'Transfer');
    let arrSumInfo = [
      {title: 'Other Income - (ETH ', data: ethIncome.transfer}
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
    let arrSumInfo = [
      {title: 'Paid In Cap - (ETH ', data: ethIncome.capital}
    ];
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
    let arrSumInfo = [
      {title: 'GMM Expense - (ETH ', data: (ethOutflow.gmmTransfer + ethOutflow.gmmExpense + cbpOutflow.gmmTransfer * 10000n /exRate)},
      {title: 'CBP Transfer', data: cbpOutflow.gmmTransfer * 10000n / exRate},
      {title: 'ETH Transfer', data: ethOutflow.gmmTransfer},
      {title: 'ETH Action Expense', data: ethOutflow.gmmExpense}
    ];

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
    let arrSumInfo = [
      {title: 'BMM Expense - (ETH ', data: (ethOutflow.bmmTransfer + ethOutflow.bmmExpense + cbpOutflow.bmmTransfer * 10000n /exRate)},
      {title: 'CBP Transfer', data: cbpOutflow.bmmTransfer * 10000n / exRate},
      {title: 'ETH Transfer', data: ethOutflow.bmmTransfer},
      {title: 'ETH Action Expense', data: ethOutflow.bmmExpense},
    ];

    if (records.length > 0) {
      setList(records);
      setSumInfo(arrSumInfo);
      setOpen(true);
    }
  }

  const showGasIncomeRecords = () => {
    let records = ethIncomeRecords.filter((v) => v.typeOfIncome == 'Gas');
    let arrSumInfo = [
      {title: 'Deffered Income - (ETH ', data: (ethIncome.gas - cbpIncome.royalty * 10000n / exRate)},
      {title: 'Gas Income', data: ethIncome.gas},
      {title: 'Royalty Income', data: cbpIncome.royalty * 10000n / exRate},
    ];

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
              <b>Balance Sheet</b>
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
              <b>ETH Of the Address: ({ inETH 
                ? ethToGwei(balanceOfEth)
                : ethToUSD(balanceOfEth)}) </b>
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
            <Typography variant="h6" textAlign='center' width='20%'>
              &nbsp;
            </Typography>
            <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
              <b>ETH of Comp: ({ inETH 
                ? ethToGwei(balanceOfEth - depositsOfETH)
                : ethToUSD(balanceOfEth - depositsOfETH)}) </b>
            </Button>
          </Stack>

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

          <Divider orientation="horizontal"  sx={{ my:2, color:'blue' }} flexItem  />

          <Stack direction='row' width='100%' >
            <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} >
              <b>Init Contribution: ({ inETH
                ? ethToGwei(initContribution)
                : ethToUSD(initContribution) + 'USD'}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='10%'>
              +
            </Typography>
            <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} >
              <b>Equity Changes: ({ inETH
                ? ethToGwei(equityChange)
                : ethToUSD(equityChange)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='30%'>
              &nbsp;
            </Typography>
            <Button variant="outlined" sx={{width: '70%', m:0.5, justifyContent:'start'}} >
              <b>Total Equity: ({ inETH
                ? ethToGwei(totalEquity)
                : ethToUSD(totalEquity)}) </b>
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
              <b>Income Statement</b>
            </Typography>
          </Stack>

          <Stack direction='row' width='100%' >
            <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} onClick={()=>showRoyaltyRecords()} >
              <b>Royalty Inc: ({ inETH
                ? ethToGwei(cbpToETH(cbpIncome.royalty))
                : ethToUSD(cbpToETH(cbpIncome.royalty))}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='10%'>
              +
            </Typography>
            <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} onClick={()=>showOtherIncomeRecords()} >
              <b>Other Inc: ({ inETH
                ? ethToGwei(ethIncome.transfer)
                : ethToUSD(ethIncome.transfer)}) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='10%'>
              -
            </Typography>
            <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} onClick={()=>showGmmExpRecords()} >
              <b>Gmm Exp: ({ inETH
                ? ethToGwei(gmmExp)
                : ethToUSD(gmmExp) }) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='10%'>
              -
            </Typography>
            <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} onClick={()=>showBmmExpRecords()}>
              <b>Bmm Exp: ({ inETH
                ? ethToGwei(bmmExp)
                : ethToUSD(bmmExp) }) </b>
            </Button>
          </Stack>

          <Stack direction='row' width='100%' >
            <Typography variant="h6" textAlign='center' width='20%'>
              &nbsp;
            </Typography>
            <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
              <b>EBITDA: ({ inETH
                ? ethToGwei(ebitda)
                : ethToUSD(ebitda)}) </b>
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
                : ethToUSD(profits) }) </b>
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
                <b>Statement of Changes in Equity</b>
              </Typography>
            </Stack>

            <Stack direction='row' width='100%' >
              <Button variant="outlined" sx={{width: '100%', m:0.5, justifyContent:'start'}} >
                <b>Init Contribution: ({ inETH 
                  ? ethToGwei(initContribution)
                  : ethToUSD(initContribution)})</b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' >
              <Typography variant="h6" textAlign='center' width='10%'>
                +
              </Typography>
              <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} onClick={()=>showPaidInCapRecords()} >
                <b>Paid-In Cap: ({ inETH
                  ? ethToGwei(ethIncome.capital)
                  : ethToUSD(ethIncome.capital)}) </b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' >
              <Typography variant="h6" textAlign='center' width='10%'>
                +
              </Typography>
              <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} onClick={()=>showGasIncomeRecords()} >
                <b>Deferred Inc: ({ inETH
                  ? ethToGwei(deferredIncome)
                  : ethToUSD(deferredIncome)}) </b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' >
              <Typography variant="h6" textAlign='center' width='10%'>
                +
              </Typography>
              <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} >
                <b>Profits: ({ inETH 
                  ? ethToGwei(profits)
                  : ethToUSD(profits)}) </b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' >
              <Typography variant="h6" textAlign='center' width='10%'>
                -
              </Typography>
              <Button variant="outlined" sx={{width: '90%', m:0.5, justifyContent:'start'}} >
                <b>Distribution: ({ inETH
                  ? ethToGwei(ethOutflow.ownersEquity)
                  : ethToUSD(ethOutflow.ownersEquity)}) </b>
              </Button>
            </Stack>

            <Stack direction='row' width='100%' >
              <Typography variant="h6" textAlign='center' width='10%'>
                &nbsp;
              </Typography>
              <Typography variant="h6" textAlign='center' width='10%'>
                -
              </Typography>
              <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
                <b>Equity Change: ({ inETH
                  ? ethToGwei(equityChange)
                  : ethToUSD(equityChange)}) </b>
              </Button>
            </Stack>

            <Divider orientation="horizontal"  sx={{ my:2, color:'blue' }} flexItem  />

            <Stack direction='row' width='100%' >
              <Typography variant="h6" textAlign='center' width='30%'>
                &nbsp;
              </Typography>
              <Button variant="outlined" sx={{width: '70%', m:0.5, justifyContent:'start'}} >
                <b>Owners Equity: ({ inETH
                  ? ethToGwei(ownersEquity)
                  : ethToUSD(ownersEquity)}) </b>
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
                  <CbpIncome sum={cbpIncome} setSum={setCbpIncome} records={cbpIncomeRecords} setRecords={setCbpIncomeRecords} setSumInfo={setSumInfo} setList={setList} setOpen={setOpen} />
                </Stack>

                <Stack direction='row' width='100%' >
                  <Typography variant="h6" textAlign='center' width='10%'>
                    -
                  </Typography>
                  <CbpOutflow sum={cbpOutflow} setSum={setCbpOutflow} records={cbpOutflowRecords} setRecords={setCbpOutflowRecords} setSumInfo={setSumInfo} setList={setList} setOpen={setOpen} />
                </Stack>

                <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
                  <b>CBP Balance: ({bigIntToStrNum((cbpIncome.totalAmt - cbpOutflow.totalAmt)/10n**9n, 9) + ' CBP'}) </b>
                </Button>

              </Stack>

              <Divider orientation="horizontal"  sx={{ my:2, color:'blue' }} flexItem  />

              <Stack direction='column' sx={{ alignItems:'end' }} >

                <Stack direction='row' width='100%' >
                  <Typography variant="h6" textAlign='center' width='10%'>
                    +
                  </Typography>
                  <EthIncome sum={ethIncome} setSum={setEthIncome} records={ethIncomeRecords} setRecords={setEthIncomeRecords} setSumInfo={setSumInfo} setList={setList} setOpen={setOpen} />
                </Stack>

                <Stack direction='row' width='100%' >
                  <Typography variant="h6" textAlign='center' width='10%'>
                    -
                  </Typography>
                  <EthOutflow sum={ethOutflow} setSum={setEthOutflow} records={ethOutflowRecords} setRecords={setEthOutflowRecords} setSumInfo={setSumInfo} setList={setList} setOpen={setOpen} />
                </Stack>

                <Stack direction='row' width='100%' >
                  <Typography variant="h6" textAlign='center' width='10%'>
                    -
                  </Typography>
                  <Deposits sum={deposits} setSum={setDeposits} records={depositsRecords} setRecords={setDepositsRecords} setSumInfo={setSumInfo} setList={setList} setOpen={setOpen} />
                </Stack>


                <Button variant="outlined" sx={{width: '80%', m:0.5, justifyContent:'start'}} >
                  <b>ETH Balance: ({bigIntToStrNum((ethIncome.totalAmt - ethOutflow.totalAmt - deposits.totalAmt)/10n**9n, 9) + ' ETH'}) </b>
                </Button>

              </Stack>

        </Paper>

      </Stack>
    
    </Paper>
  );
} 