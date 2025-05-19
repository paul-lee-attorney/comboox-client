"use client"

import { useEffect, useState } from "react";

import { Box, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Typography } from "@mui/material";

import { CopyLongStrTF } from "../../common/CopyLongStr";
import { AddrZero, booxMap, Bytes32Zero } from "../../common";

import { ActionsOfOrder } from "./components/ActionsOfOrder";
import { OrdersList } from "./components/OrdersList";
import { counterOfClasses } from "../ros/ros";
import { useComBooxContext } from "../../../_providers/ComBooxContextProvider";
import { DealsList } from "./components/DealsList";
import { usePublicClient } from "wagmi";
import { baseToDollar, longSnParser } from "../../common/toolsKit";
import { BillOfOrder } from "./components/BillOfOrder";
import { BillOfDeal } from "./components/BillOfDeal";
import { DealsChart } from "./components/DealsChart";
import { SetBookAddr } from "../../components/SetBookAddr";
import { Deal, defaultOrder, Order } from "../loe/loe";
import { dealParser, DealProps, getOrders } from "./lou";
import { ArbiscanLog, decodeArbiscanLog, getAllLogs } from "../../../api/firebase/arbiScanLogsTool";

import { Hex } from "viem";

function UsdListOfOrders() {

  const {gk, boox } = useComBooxContext();

  const [addr, setAddr] = useState(boox ? boox[booxMap.UsdLOO] : AddrZero );

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
  }, [addr, classOfShare, time]);

  const [ order, setOrder ] = useState<Order>(defaultOrder);
  const [ open, setOpen ] = useState(false);

  const client = usePublicClient();

  const [ deals, setDeals ] = useState<DealProps[]>([]);
  const [ qty, setQty ] = useState(0n);
  const [ amt, setAmt ] = useState(0n);

  useEffect(()=>{

    const getEvents = async () => {

      if (!gk || addr.toLowerCase() == AddrZero.toLowerCase()) return;

      let rawLogs = await getAllLogs(gk, 'LOU', addr, 'DealClosed');

      let abiStr = 'event DealClosed(bytes32 indexed fromSn, bytes32 indexed toSn, bytes32 qtySn, uint indexed consideration)';

      type TypeOfDealClosedLog = ArbiscanLog & {
        eventName: string, 
        args: {
          fromSn: Hex,
          toSn: Hex,
          qtySn: Hex,
          consideration:bigint,
        }
      }

      let dealLogs = rawLogs?.map(log => decodeArbiscanLog(log, abiStr) as TypeOfDealClosedLog) ?? [];

      let cnt = dealLogs.length;

      let qty:bigint = 0n;
      let amt:bigint = 0n;
      let arr:DealProps[] = [];
      let counter = 0;

      while (cnt > 0) {

        let log = dealLogs[cnt-1];
        let deal:Deal = dealParser(
          log.args.fromSn ?? Bytes32Zero, log.args.toSn ?? Bytes32Zero, log.args.qtySn ?? Bytes32Zero
        );

        let consideration: bigint = log.args.consideration ?? 0n;

        let classOfOrder = Number(deal.classOfShare);

        if (classOfShare != classOfOrder) {
          cnt--;
          continue;
        }

        let item:DealProps = {
          ...deal,

          blockNumber: BigInt(log.blockNumber),
          timestamp: BigInt(log.timeStamp),
          transactionHash: log.transactionHash ?? Bytes32Zero,

          seqOfDeal: counter,          
          consideration: consideration,
          classOfShare: longSnParser(classOfShare.toString()),
          seqOfShare: longSnParser(deal.seqOfShare),
          buyer: longSnParser(deal.buyer),
          groupRep: longSnParser(deal.groupRep),
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

  },[gk, addr, client, classOfShare, setQty, setAmt, time]);  

  const [ deal, setDeal ] = useState<DealProps | undefined>();
  const [ show, setShow ] = useState<boolean>(false);

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:2, m:1, border:1, borderColor:'divider', width:'fit-content' }} >

      <Stack direction="row" sx={{alignItems:'center'}} >

          <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
            <b>LOU - List Of USD Orders</b>
          </Typography>

          <Box width='168'>
            <CopyLongStrTF title="Addr"  src={ addr.toLowerCase() }  />
          </Box>

          <Box width='168' sx={{ m:2 }}>
            <FormControl size="small" sx={{ minWidth: 168 }}>
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
          </Box>

          {/* <Tooltip title='Video Tutorials' >
            <Link href='https://youtu.be/Ds4ndJiSzIM' passHref>
              <IconButton 
                component="a"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ml:8, mr:2}} color="primary"
              >
                <VideoCameraFront />
              </IconButton>
            </Link>
          </Tooltip>

          <Tooltip title='视频教程' >
            <Link href='https://youtu.be/Ds4ndJiSzIM' passHref>
              <IconButton
                component="a"
                target="_blank"
                rel="noopener noreferrer"
                sx={{mx:2}} color="primary"
              >
                <VideoCameraBackOutlined />
              </IconButton>
            </Link>
          </Tooltip> */}

          <SetBookAddr setAddr={setAddr} />

      </Stack>
          
      <ActionsOfOrder classOfShare={classOfShare} seqOfOrder={order.node.seq} refresh={refresh} />
      <DealsChart classOfShare={classOfShare} time={time} refresh={refresh} />
      
      <OrdersList name={'Sell'} list={offers} setOrder={setOrder} setOpen={setOpen} refresh={refresh} />
      <OrdersList name={'Buy'} list={bids} setOrder={setOrder} setOpen={setOpen} refresh={refresh} />

      <DealsList list={deals} qty={baseToDollar(qty.toString())} amt={baseToDollar((amt/10000n).toString())} refresh={refresh} setDeal={setDeal} setShow={setShow} />
      
      <BillOfOrder order={order} open={open} setOpen={setOpen} />
      {deal && (
        <BillOfDeal deal={deal} open={show} setOpen={setShow} />
      )}

    </Paper>
  );
} 

export default UsdListOfOrders;