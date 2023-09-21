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

import { 
  useShareholdersAgreementRemoveRule 
} from "../../../../../generated";

import { SetPositionAllocateRule } from "./SetPositionAllocateRule";
import { RulesEditProps } from "../GovernanceRules/SetGovernanceRule";

export function PositionAllocateRules({sha, initSeqList, isFinalized, getRules}: RulesEditProps) {

  const mandatoryRules = [256];
  
  const [ cp, setCp ] = useState<number[]>(mandatoryRules);

  useEffect(()=>{
    if (initSeqList && initSeqList.length > 0) {
      setCp([...initSeqList]);
    }
  }, [initSeqList]);

  const addCp = () => {
    setCp(v => {
      let arr = [...v];
      arr.push(v[v.length-1] + 1);
      return arr;
    })
  }

  const [open, setOpen] = useState(false);

  const {
    isLoading: removeRuleLoading,
    write: removeRule,
  } = useShareholdersAgreementRemoveRule({
    address: sha,
    args: [BigInt(cp[cp.length - 1])],
    onSuccess() {
      setCp(v => {
        let arr = [...v];
        arr.pop();      
        return arr;
      });
      setOpen(false);
    }
  })


  const removeCp = () => {
    removeRule?.();
  }

  return (
    <>
      <Button
        variant={ initSeqList && initSeqList.length > 0 ? "contained" : "outlined" }
        startIcon={<ListAlt />}
        sx={{ m:0.5, minWidth: 248, justifyContent:'start' }}
        onClick={()=>setOpen(true)}      
      >
        Position Rules 
      </Button>

      <Dialog
        maxWidth={false}
        open={open}
        onClose={ getRules }
        aria-labelledby="dialog-title"        
      >
        <DialogContent>      

          <Paper elevation={3} sx={{ m:1, p:1, border: 1, borderColor:'divider' }}>
            <Box sx={{ width:1180 }}>

              <Stack direction={'row'} sx={{ alignItems:'center' }}>
                <Toolbar sx={{ textDecoration:'underline' }}>
                  <h4>Position Allocate Rules</h4>
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
                      disabled={ cp.length < 2 || removeRuleLoading || !removeRule } 
                      sx={{width: 20, height: 20, m: 1, p: 1, }} 
                      onClick={ removeCp }
                      color="primary"
                    >
                      <RemoveCircle/>
                    </IconButton>            
                  </>
                )}

              </Stack>

              <Grid container spacing={0.5} >

                {cp.map((v)=> (
                  <Grid key={v} item xs={3}>
                    <SetPositionAllocateRule sha={ sha } seq={ v } isFinalized={ isFinalized } getRules={ getRules } />
                  </Grid>
                ))}

              </Grid>

            </Box>
          </Paper>

        </DialogContent>

        <DialogActions>
          <Button variant="outlined" sx={{ m:1, mx:3 }} onClick={()=>setOpen(false)}>Close</Button>
        </DialogActions>

      </Dialog>

    </>
  );
} 

