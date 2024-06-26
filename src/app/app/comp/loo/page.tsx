"use client"

import { useEffect, useState } from "react";

import { FormControl, InputLabel, MenuItem, Paper, Select, Stack, Typography } from "@mui/material";

import { Tabs, TabList, TabPanel, Tab } from "@mui/joy";

import { CopyLongStrSpan } from "../../common/CopyLongStr";
import { booxMap } from "../../common";

import { ActionsOfInvestor } from "./components/ActionsOfInvestor";
import { ActionsOfOrder } from "./components/ActionsOfOrder";
import { OrderWrap, defaultOrderWrap, Investor, getChain, investorInfoList } from "./loo";
import { OrdersList } from "./components/OrdersList";
import { InvestorsList } from "./components/InvestorsList";
import { counterOfClasses } from "../ros/ros";
import { useComBooxContext } from "../../../_providers/ComBooxContextProvider";

function ListOfOrders() {

  const { boox } = useComBooxContext();

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

  const [ list, setList ] = useState<readonly OrderWrap[]>([]);
  const [ invList, setInvList ] = useState<readonly Investor[]>([]);
  const [ time, setTime ] = useState<number>(0);

  const refresh = ()=>{
    setTime(Date.now());
  }

  useEffect(()=>{
    if (boox) {

      getChain(boox[booxMap.LOO], classOfShare).then(
        res => setList(res)
      );

      investorInfoList(boox[booxMap.LOO]).then(
        res => setInvList(res)
      )

    }
  }, [boox, classOfShare, time]);


  const [ acct, setAcct ] = useState<string>('0');

  const [ order, setOrder ] = useState<OrderWrap>(defaultOrderWrap);
  const [ open, setOpen ] = useState(false);
  
  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, minWidth:1680, border:1, borderColor:'divider' }} >

      <Stack direction="row" sx={{alignItems:'center'}} >

          <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
            <b>LOO - List Of Orders</b>
          </Typography>

          {boox && (
            <CopyLongStrSpan title="Addr"  src={ boox[booxMap.LOO].toLowerCase() }  />
          )}

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

        <TabPanel value={0} sx={{ justifyContent:'start', alignItems:'center' }} >
          <ActionsOfOrder classOfShare={classOfShare} seqOfOrder={order.seq} refresh={refresh} />
          {list && (
            <OrdersList list={list} setOrder={setOrder} setOpen={setOpen} refresh={refresh} />
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