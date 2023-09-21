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
} from "@mui/material";

import {
  AddCircle,
  ListAlt,
  RemoveCircle,
} from "@mui/icons-material"

import { SetGroupUpdateOrder } from "./SetGroupUpdateOrder";
import { RulesEditProps } from "../GovernanceRules/SetGovernanceRule";
import { useShareholdersAgreementRemoveRule } from "../../../../../generated";

export function GroupUpdateOrders({sha, initSeqList, isFinalized, getRules }: RulesEditProps) {

  const mandatoryRule: number[] = isFinalized ? [] : [768];

  const [ cp, setCp ] = useState(mandatoryRule);

  useEffect(()=>{
    if (initSeqList) {
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

  const {
    isLoading: removeRuleLoading,
    write: removeRule,
  } = useShareholdersAgreementRemoveRule({
    address: sha,
    args: [BigInt(cp[cp.length - 1])],
    onSuccess() {
      if (cp.length > 1) {
        setCp(v => {
          let arr = [...v];
          arr.pop();
          return arr;
        });
      }
      setOpen(false);
    }
  })

  // const removeCp = () => {
  //   setCp(v => {
  //     let arr = [...v];
  //     arr.pop();      
  //     return arr;
  //   })
  // }

  const [open, setOpen] = useState(false);

  return (
    <>

      <Button
        // disabled={ !newGR }
        variant={ initSeqList && initSeqList.length > 0 ? "contained" : "outlined"}
        startIcon={<ListAlt />}
        // fullWidth={true}
        sx={{ m:0.5, minWidth: 248, justifyContent:'start' }}
        onClick={()=>setOpen(true)}      
      >
        Grouping Orders 
      </Button>

      <Dialog
        maxWidth={false}
        open={open}
        onClose={ getRules }
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
                      disabled={ cp.length < 2 } 
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
                <SetGroupUpdateOrder key={ v } sha={ sha }  seq={ v } isFinalized={isFinalized} getRules={ getRules } />
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

