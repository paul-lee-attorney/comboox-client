"use client"

import { useEffect, useState } from "react";

import { Box, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Typography } from "@mui/material";

import { Tabs, TabList, TabPanel, Tab } from "@mui/joy";

import { CopyLongStrTF } from "../../common/CopyLongStr";
import { AddrZero, booxMap } from "../../common";

import { ActionsOfInvestor } from "./components/ActionsOfInvestor";
import { ActionsOfOrder } from "./components/ActionsOfOrder";
import { Order, defaultOrder, Investor, getOrders, investorInfoList, DealProps, Deal, dealParser } from "./loo";
import { OrdersList } from "./components/OrdersList";
import { InvestorsList } from "./components/InvestorsList";
import { counterOfClasses } from "../ros/ros";
import { useComBooxContext } from "../../../_providers/ComBooxContextProvider";
import { DealsList } from "./components/DealsList";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { baseToDollar, longSnParser } from "../../common/toolsKit";
import { BillOfOrder } from "./components/BillOfOrder";
import { BillOfDeal } from "./components/BillOfDeal";
import { DealsChart } from "./components/DealsChart";
import { SetBookAddr } from "../../components/SetBookAddr";

function ListOfOrders() {

  const { boox } = useComBooxContext();

  const [addr, setAddr] = useState(boox ? boox[booxMap.LOO] : AddrZero );

  const [ index, setIndex ] = useState (0);

  const [ classes, setClasses ] = useState<number[]>([]);
  const [ classOfShare, setClassOfShare ] = useState<number>(0);

  useEffect(()=>{
    if (boox) {
      counterOfClasses(boox[booxMap.ROS]).then(
        res => {
          let i = 1;
          let list: number[] = [1];
          while (i <= res) {
            i++;
            list.push(i);
          }
          
          setClasses(list);
        }
      )
    }
  }, [boox])

  const [ offers, setOffers ] = useState<readonly Order[]>([]);
  const [ bids, setBids ] = useState<readonly Order[]>([]);

  const [ invList, setInvList ] = useState<readonly Investor[]>([]);
  const [ time, setTime ] = useState<number>(0);

  const refresh = ()=>{
    setTime(Date.now());
  }

  useEffect(()=>{
      getOrders(addr, classOfShare, true).then(
        res => setOffers(res)
      );

      getOrders(addr, classOfShare, false).then(
        res => setBids(res)
      );
 
      investorInfoList(addr).then(
        res => setInvList(res)
      );
  }, [addr, classOfShare, time]);

  const [ acct, setAcct ] = useState<string>('0');

  const [ order, setOrder ] = useState<Order>(defaultOrder);
  const [ open, setOpen ] = useState(false);

  const client = usePublicClient();

  const [ deals, setDeals ] = useState<DealProps[]>([]);
  const [ qty, setQty ] = useState(0n);
  const [ amt, setAmt ] = useState(0n);

  // const [ left, setLeft ] = useState(0);
  // const [ right, setRight ] = useState(0);

  useEffect(()=>{

    const getEvents = async () => {

      if (addr.toLowerCase() == AddrZero.toLowerCase()) return;

      // const lastBlock = await client.getBlockNumber();

      let dealLogs = await client.getLogs({
        address: addr,
        event: parseAbiItem('event DealClosed(bytes32 indexed deal, uint indexed consideration)'),
        fromBlock: 'earliest',
        // fromBlock: lastBlock > 60000n + BigInt(left) ? lastBlock - 60000n - BigInt(left) : 0n,
        // toBlock: lastBlock > BigInt(right) ? lastBlock - BigInt(right) : 0n
      });

      let cnt = dealLogs.length;

      let qty:bigint = 0n;
      let amt:bigint = 0n;
      let arr:DealProps[] = [];
      let counter = 0;

      while (cnt > 0) {

        let log = dealLogs[cnt-1];
        let deal:Deal = dealParser(log.args.deal ?? '0x00');
        let consideration: bigint = log.args.consideration ?? 0n;

        let blkNo = log.blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});

        let classOfOrder = Number(deal.classOfShare);

        if (classOfShare != classOfOrder) {
          cnt--;
          continue;
        }

        let item:DealProps = {
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: log.transactionHash,
          seqOfDeal: counter,
          classOfShare: longSnParser(classOfShare.toString()),
          seqOfShare: longSnParser(deal.seqOfShare),
          buyer: longSnParser(deal.buyer),
          groupRep: longSnParser(deal.groupRep),
          paid: deal.paid,
          price: deal.price,
          votingWeight: deal.votingWeight,
          distrWeight: deal.distrWeight,
          consideration: consideration,
        }

        cnt--;

        qty += deal.paid;
        amt += deal.paid * deal.price;

        arr.push(item); 
        counter++;
      }

      setQty(qty);
      setAmt(amt);
      setDeals(arr);
    }

    getEvents();

  },[addr, client, classOfShare, setQty, setAmt, time]);  

  const [ deal, setDeal ] = useState<DealProps | undefined>();
  const [ show, setShow ] = useState<boolean>(false);

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, minWidth:1680, border:1, borderColor:'divider' }} >

      <Stack direction="row" sx={{alignItems:'center'}} >

          <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
            <b>LOO - List Of Orders</b>
          </Typography>

          <Box width='168'>
            <CopyLongStrTF title="Addr"  src={ addr.toLowerCase() }  />
          </Box>

          <SetBookAddr setAddr={setAddr} />

      </Stack>

      <Tabs 
        size="md" 
        value={ index } 
        sx={{ justifyContent:'center', alignItems:'start' }}
        onChange={(e, v) => setIndex(v as number)} 
      >

        <Stack direction='row' sx={{mx:3}} >

          <FormControl variant="filled" size="small" sx={{ minWidth: 168 }}>
            <InputLabel id="typeOfAction-label">ClassOfShare</InputLabel>
            <Select
              labelId="typeOfAction-label"
              id="typeOfAction-select"
              label="ClassOfShare"
              value={ classOfShare == 0 ? '' : classOfShare }
              onChange={(e) => setClassOfShare( parseInt( e.target.value.toString() ))}
            >
              {classes.map((v) => (
                <MenuItem key={v} value={ v } > <b>{v}</b> </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TabList variant="soft" color="neutral" tabFlex={1} sx={{ width: 336 }}  >
            <Tab ><b>Orders</b></Tab>
            <Tab ><b>Investors</b></Tab>
          </TabList>

        </Stack>

        <TabPanel value={0} sx={{ justifyContent:'start', alignItems:'center', minWidth:1680 }} >
          
          <ActionsOfOrder classOfShare={classOfShare} seqOfOrder={order.node.seq} refresh={refresh} />
          <DealsChart classOfShare={classOfShare} time={time} refresh={refresh} />
          
          <OrdersList name={'Sell'} list={offers} setOrder={setOrder} setOpen={setOpen} refresh={refresh} />
          <OrdersList name={'Buy'} list={bids} setOrder={setOrder} setOpen={setOpen} refresh={refresh} />

          <DealsList list={deals} qty={baseToDollar(qty.toString())} amt={baseToDollar((amt/10000n).toString())} refresh={refresh} setDeal={setDeal} setShow={setShow} />
          
          <BillOfOrder order={order} open={open} setOpen={setOpen} />
          {deal && (
            <BillOfDeal deal={deal} open={show} setOpen={setShow} />
          )}

        </TabPanel>

        <TabPanel value={1} sx={{ justifyContent:'start', alignItems:'center' }} >
          <ActionsOfInvestor acct={acct} refresh={ refresh } />
          {invList && (
            <InvestorsList list={invList} setAcct={setAcct} />
          )}
        </TabPanel>

      </Tabs>

    </Paper>
  );
} 

export default ListOfOrders;