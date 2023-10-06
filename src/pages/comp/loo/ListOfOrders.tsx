import { useComBooxContext } from "../../../scripts/common/ComBooxContext";
import { useState } from "react";
import { FormControl, InputLabel, MenuItem, Paper, Select, Stack, Toolbar } from "@mui/material";

import { Tabs, TabList, TabPanel, Tab } from "@mui/joy";

import { useListOfOrdersGetChain, useListOfOrdersInvestorInfoList, useRegisterOfSharesCounterOfClasses } from "../../../generated";
import { CopyLongStrSpan } from "../../../components/common/utils/CopyLongStr";
import { booxMap } from "../../../scripts/common";
import { ActionsOfInvestor } from "../../../components/comp/loo/ActionsOfInvestor";
import { ActionsOfOrder } from "../../../components/comp/loo/ActionsOfOrder";
import { Deal, defaultDeal, OrderWrap, defaultOrderWrap, Investor } from "../../../scripts/comp/loo";
import { OrdersList } from "../../../components/comp/loo/OrdersList";
import { InvestorsList } from "../../../components/comp/loo/InvestorsList";

function ListOfOrders() {

  const { boox } = useComBooxContext();

  const [ index, setIndex ] = useState (0);

  const [ classes, setClasses ] = useState<number[]>([]);
  const [ classOfShare, setClassOfShare ] = useState<number>(0);

  const {
    refetch: getCounterOfClasses
  } = useRegisterOfSharesCounterOfClasses({
    address: boox ? boox[booxMap.ROS] : undefined,
    onSuccess(res) {
      let i = 1;
      let list: number[] = [1];
      while (i <= res) {
        i++;        
        list.push(i);
      }
      
      setClasses(list);
    }
  })

  const [ list, setList ] = useState<readonly OrderWrap[]>([]);

  const {
    refetch: getList
  } = useListOfOrdersGetChain ({
    address: boox ? boox[booxMap.LOO] : undefined,
    args: [BigInt(classOfShare)],
    onSuccess(res) {
      setList(res);
    }
  });

  const [ invList, setInvList ] = useState<readonly Investor[]>([]);

  const {
    refetch: getInvList
  } = useListOfOrdersInvestorInfoList ({
    address: boox ? boox[booxMap.LOO] : undefined,
    onSuccess(res) {
      setInvList(res);
    }
  });

  const [ acct, setAcct ] = useState<string>('0');

  const [ order, setOrder ] = useState<OrderWrap>(defaultOrderWrap);
  const [ open, setOpen ] = useState(false);

  const [ deal, setDeal ] = useState<Deal>(defaultDeal);
  const [ show, setShow ] = useState(false);
  
  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, minWidth:1680, border:1, borderColor:'divider' }} >

      <Stack direction="row" sx={{alignItems:'center'}} >

          <Toolbar sx={{m:1, p:1, textDecoration:'underline'}}>
            <h3>LOO - List Of Orders</h3>
          </Toolbar>

          {boox && (
            <CopyLongStrSpan title="Addr" size="body1" src={ boox[booxMap.LOO].toLowerCase() }  />
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
              value={ classOfShare }
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
          <ActionsOfOrder classOfShare={classOfShare} seqOfOrder={order.seq} getAllOrders={getList} />
          {list && (
            <OrdersList list={list} setOrder={setOrder} setOpen={setOpen} refresh={getList}/>
          )}
        </TabPanel>

        <TabPanel value={1} sx={{ justifyContent:'start', alignItems:'center' }} >
          <ActionsOfInvestor acct={acct} getAllInvestors={getInvList} />
          {invList && (
            <InvestorsList list={invList} setAcct={setAcct} />
          )}
        </TabPanel>



      </Tabs>


      {/* <Stack direction="row" >
        <ActionsOfInvestor getAllInvestors={()=>{}} />
      </Stack> */}


      {/* {motion && boox && (
        <ApprovalFormOfMotion 
          minutes={boox[booxMap.GMM]}  
          open={open} 
          motion={motion} 
          setOpen={setOpen} 
          obtainMotionsList={obtainSeqList} 
        />
      )} */}

    </Paper>
  );
} 

export default ListOfOrders;