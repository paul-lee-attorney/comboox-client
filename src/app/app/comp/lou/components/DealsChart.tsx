import { IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";

import { dateParser } from "../../../common/toolsKit";
import { AllSeriesType, axisClasses, BarPlot, ChartsAxisHighlight, ChartsTooltip, ChartsXAxis, ChartsYAxis, LineHighlightPlot, LinePlot, ResponsiveChartContainer } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { AddrZero, booxMap, Bytes32Zero } from "../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { Refresh } from "@mui/icons-material";
import { Deal } from "../../loe/loe";
import { dealParser } from "../lou";
import { DealLog, getDealLogs, setDealLogs } from "../../../../api/firebase/dealInfoTools";

interface DealChartProps {
  classOfShare: number;
  time: number;
  refresh: ()=>void;
}

interface ChartItem {
  timestamp: bigint;
  high: bigint;
  low: bigint;
  volumn: bigint;
}

export function DealsChart({classOfShare, time, refresh}: DealChartProps) {

  const { gk, boox } = useComBooxContext();
  const client = usePublicClient();
  const [line, setLine] = useState<ChartItem[]>([]);

useEffect(()=>{

  const getEvents = async () => {

    if (!gk || !boox || boox[booxMap.UsdLOO] == AddrZero) return;

    const addrUsdLOO = boox[booxMap.UsdLOO];

    let logs = await getDealLogs(gk, 'usdc');

    const fromBlkNum = logs ? BigInt(logs[logs.length - 1].blockNumber) : 0n;
    const toBlkNum = await client.getBlockNumber();

    let startBlkNum = fromBlkNum;
    let dealLogs:DealLog[] = [];

    while(startBlkNum <= toBlkNum) {
      const endBlkNum = startBlkNum + 500n > toBlkNum ? toBlkNum : startBlkNum + 500n;
      try{
        let dealClosedLogs = await client.getLogs({
          address: addrUsdLOO,
          event: parseAbiItem('event DealClosed(bytes32 indexed fromSn, bytes32 indexed toSn, bytes32 qtySn, uint indexed consideration)'),
          fromBlock: startBlkNum,
          toBlock: endBlkNum,
        });

        let tLogs = dealClosedLogs.map(v => ({
          seq: v.logIndex,
          blockNumber: v.blockNumber.toString(),
          timestamp: 0,
          fromSn: v.args.fromSn || Bytes32Zero,
          toSn: v.args.toSn || Bytes32Zero,
          qtySn: v.args.qtySn || Bytes32Zero,
          consideration: (v.args.consideration ?? 0n).toString(),
        }));
        
        dealLogs = [...dealLogs, ...tLogs];
        startBlkNum = endBlkNum + 1n;
      }catch(error){
        console.error("Error fetching dealLogs:", error);
        break;
      }
    }
    
    const blkNums = [... new Set(dealLogs.map(log => log.blockNumber))];

    const blks = await Promise.all(
      blkNums.map(blkNum => client.getBlock({ blockNumber: BigInt(blkNum) }))
    );

    const blkTimestampMap = blks.reduce((map:{[key:string]:number}, blk) => {
      map[blk.number.toString()] = Number(blk.timestamp);
      return map;
    }, {} as {[key:string]:number});

    if (dealLogs.length > 0) {
      dealLogs = dealLogs.sort((a, b) => a.timestamp - b.timestamp || a.seq - b.seq);

      await setDealLogs(gk, 'usdc', dealLogs);

      if (logs) {
        logs = logs.concat(dealLogs);
      } else {
        logs = dealLogs;
      }

    } 

    if (!logs) return;

    let cnt = logs.length;

    let arr:ChartItem[] = [];
    let i = 0;
    let len = 0;
 
    while (i<cnt && len<1800) {

      let log = logs[i];
      let deal:Deal = dealParser(log.fromSn, log.toSn, log.qtySn);

      if (classOfShare != Number(deal.classOfShare)) {
        i++;
        continue;
      }

      let item:ChartItem = {
        timestamp: BigInt(log.timestamp),
        volumn: deal.paid,
        high: deal.price,
        low: deal.price,
      }

      if (len > 0) {

        let lastItem = arr[len-1];

        if (lastItem.timestamp == item.timestamp) {
          if (item.high > lastItem.high) arr[len-1].high = item.high;
          if (item.low < lastItem.low) arr[len-1].low = item.low;
          arr[len-1].volumn += item.volumn;
        } else {
          arr.push(item);
          len++;
        }

      } else {
        arr.push(item);
        len++;
      }

      i++;

    }
    setLine(arr);
  }

  getEvents();

},[gk, boox, client, classOfShare, time, setLine]);

  const series = [
    {
      type: 'bar',
      yAxisId: 'volume',
      label: 'Volume',
      color: 'lightgray',
      data: line.map((item) => Number(item.volumn)/10000),
      highlightScope: { highlight: 'item' },
    },
    {
      type: 'line',
      yAxisId: 'price',
      color: 'green',
      label: 'Low',
      data: line.map((item) => Number(item.low)/10000),
      highlightScope: { highlight: 'item' },
    },
    {
      type: 'line',
      yAxisId: 'price',
      color: 'red',
      label: 'High',
      data: line.map((item) => Number(item.high)/10000),
    },
  ] as AllSeriesType[];
  
  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >

      <Stack direction={'row'} sx={{ alignItems:'center' }} >
        <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
          <b>Deals Chart</b>  
        </Typography>

        <Tooltip 
          title='Refresh List' 
          placement='right' 
          arrow 
        >
          <IconButton
            size='small'
            sx={{ mx:5 }}
            onClick={()=>refresh()}
            color="primary"
          >
            <Refresh />
          </IconButton>
        </Tooltip>

      </Stack>

        <ResponsiveChartContainer
          series={series}
          height={400}
          margin={{ top: 10, left: 80, right: 80 }}
          xAxis={[
            {
              id: 'date',
              data: line.map((item) => Number(item.timestamp)),
              scaleType: 'band',
              valueFormatter: (value) => dateParser(value.toString()),
            },
          ]}
          yAxis={[
            {
              id: 'price',
              scaleType: 'linear',
            },
            {
              id: 'volume',
              scaleType: 'linear',
              valueFormatter: (value) => `${(value).toLocaleString()}`,
            },
          ]}
        >
          <ChartsAxisHighlight x="line" />
          <BarPlot />
          <LinePlot />

          <LineHighlightPlot />
          <ChartsXAxis
            label="Timestamp"
            position="bottom"
            axisId="date"
            tickInterval={(value, index) => {
              return index % 5 == 0;
            }}
            tickLabelStyle={{
              fontSize: 10,
            }}
          />
          <ChartsYAxis
            label="Price"
            position="left"
            axisId="price"
            tickLabelStyle={{ fontSize: 10 }}
            sx={{
              [`& .${axisClasses.label}`]: {
                transform: 'translateX(-30px)',
              },
            }}
          />
          <ChartsYAxis
            label="Volume"
            position="right"
            axisId="volume"
            tickLabelStyle={{ fontSize: 10 }}
            sx={{
              [`& .${axisClasses.label}`]: {
                transform: 'translateX(30px)',
              },
            }}
          />
          <ChartsTooltip />
        </ResponsiveChartContainer>

    </Paper>
  );
} 