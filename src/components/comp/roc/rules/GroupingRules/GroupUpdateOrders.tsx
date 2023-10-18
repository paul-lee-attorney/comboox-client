import { useEffect, useState } from "react";
import { 
  Stack,
  IconButton,
  Paper,
  Toolbar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";
import {
  AddCircle,
  ListAlt,
  RemoveCircle,
} from "@mui/icons-material"
import { SetGroupUpdateOrder } from "./SetGroupUpdateOrder";
import { useShareholdersAgreementRemoveRule } from "../../../../../generated";
import { GroupRulesSettingProps } from "../VotingRules/VotingRules";
import { HexType } from "../../../../../scripts/common";
import { refreshAfterTx } from "../../../../../scripts/common/toolsKit";

export function GroupUpdateOrders({sha, initSeqList, isFinalized, time, refresh }: GroupRulesSettingProps) {

  const mandatoryRule: number[] = isFinalized ? [] : [768];
  const [ cp, setCp ] = useState(mandatoryRule);
  const [open, setOpen] = useState(false);

  useEffect(()=>{
    if (initSeqList && initSeqList.length > 0) {
      if (!isFinalized) {
        setCp(v => {
          let setRules = new Set([...v]);
          initSeqList.forEach(k => {
            setRules.add(k)
          });
          let arrRules = Array.from(setRules).sort(
            (a, b) => (a-b)
          );
          return arrRules;
        })
      } else {
        setCp(initSeqList);
      }
    } 
  }, [initSeqList, isFinalized]);

  const addCp = () => {
    setCp(v => {
      let arr = [...v];
      arr.push(v[v.length-1] + 1);      
      return arr;
    })
  }

  const [ loading, setLoading ] = useState(false);

  const udpateResults = ()=> {
    if (cp.length > 1) {
      setCp(v => {
        let arr = [...v];
        arr.pop();
        return arr;
      });
    }
    setLoading(false);
    setOpen(false);
  }

  const {
    isLoading: removeRuleLoading,
    write: removeRule,
  } = useShareholdersAgreementRemoveRule({
    address: sha,
    args: cp && cp.length > 0 
      ? [BigInt(cp[cp.length - 1])]
      : undefined,
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, udpateResults);
    }
  });
  
  return (
    <>
      <Button
        variant={ initSeqList && initSeqList.length > 0 ? "contained" : "outlined"}
        startIcon={<ListAlt />}
        sx={{ m:0.5, minWidth: 248, justifyContent:'start' }}
        onClick={()=>setOpen(true)}      
      >
        Grouping Orders 
      </Button>

      <Dialog
        maxWidth={false}
        open={open}
        onClose={ ()=>setOpen(false) }
        aria-labelledby="dialog-title"        
      >
        <DialogContent>

          <Paper elevation={3} sx={{ m:1 , p:1, border: 1, borderColor:'divider' }}>
            <Box sx={{ width:1280 }}>

              <Stack direction={'row'} sx={{ alignItems:'center' }}>
                <Toolbar>
                  <h4>Group Update Orders</h4>
                </Toolbar>
                {!isFinalized && (
                  <>
                    <IconButton 
                      sx={{width: 20, height: 20, m: 1, p: 1}} 
                      onClick={ addCp }
                      color="primary"
                    >
                      <AddCircle/>
                    </IconButton>
                    <IconButton
                      disabled={ cp.length < 2 || removeRuleLoading || loading} 
                      sx={{width: 20, height: 20, m: 1, p: 1, }} 
                      onClick={ ()=>removeRule?.() }
                      color="primary"
                    >
                      <RemoveCircle/>
                    </IconButton>      
                  </>
                )}

              </Stack>

              {cp.map((v)=> (
                <Grid key={v} item xs={3}>
                  <SetGroupUpdateOrder key={ v } sha={ sha }  seq={ v } isFinalized={isFinalized} time={time} refresh={refresh} />
                </Grid>
              ))}
            
            </Box>
          </Paper>

        </DialogContent>

        <DialogActions>
          <Button variant='outlined' sx={{ m:1, mx:3 }} onClick={()=>setOpen(false)}>Close</Button>
        </DialogActions>

      </Dialog>        
  
    </>
  );
} 

