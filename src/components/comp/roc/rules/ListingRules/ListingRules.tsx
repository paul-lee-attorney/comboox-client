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
import { RulesEditProps } from "../GovernanceRules/SetGovernanceRule";
import { SetListingRule } from "./SetListingRule";


export function ListingRules({sha, initSeqList, isFinalized, getRules}: RulesEditProps) {

  const mandatoryRule: number[] = isFinalized ? [] : [1024];

  const [ cp, setCp ] = useState(mandatoryRule);

  useEffect(()=>{
    if (initSeqList && initSeqList.length > 0) {
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
    }
  }, [initSeqList]);

  const addCp = () => {
    setCp(v => {
      let arr = [...v];
      arr.push(v[v.length - 1]+1);
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

  return (
    <>
      <Button
        variant={ initSeqList && (initSeqList.length > 0) ? "contained" : "outlined" }
        startIcon={<ListAlt />}
        sx={{ m:0.5, minWidth: 248, justifyContent:'start' }}
        onClick={()=>setOpen(true)} 
      >
        Listing Rules 
      </Button>

      <Dialog
        maxWidth={false}
        open={open}
        onClose={ getRules }
        aria-labelledby="dialog-title"        
      >
        <DialogContent>

          <Paper elevation={3} sx={{ m:1, p:1, border:1, borderColor:'divider' }}>
            <Box sx={{ width:1180 }}>

              <Stack direction={'row'} sx={{ alignItems:'center' }}>
                <Toolbar sx={{ textDecoration:'underline' }}>
                  <h4>Listing Rules</h4>
                </Toolbar>

                {!isFinalized && cp && (
                  <>
                    <IconButton 
                      sx={{width: 20, height: 20, m: 1, p: 1}} 
                      onClick={ addCp }
                      color="primary"
                    >
                      <AddCircle/>
                    </IconButton>
                    <IconButton 
                      disabled={ cp.length < 1 || removeRuleLoading || !removeRule }
                      sx={{width: 20, height: 20, m: 1, p: 1, }} 
                      onClick={()=>removeRule?.() }
                      color="primary"
                    >
                      <RemoveCircle/>
                    </IconButton>
                  </>
                )}

              </Stack>

              <Grid container spacing={0.5} >

                {cp.map(v=> (
                  <Grid key={ v } item xs={3} >
                    <SetListingRule  sha={ sha } seq={ v } isFinalized={ isFinalized } getRules={ getRules } />
                  </Grid>
                ))}

              </Grid>

            </Box>
          </Paper>

        </DialogContent>

        <DialogActions>
            <Button variant="outlined" sx={{ m:1, mx:3 }} onClick={ ()=>setOpen(false) }>Close</Button>
        </DialogActions>

      </Dialog>
    
    </>
  );
} 

