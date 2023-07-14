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

import { HexType } from "../../../../interfaces";

import {
  AddCircle,
  ListAlt,
  RemoveCircle,
} from "@mui/icons-material"

import { SetVotingRule, VotingRule } from "./SetVotingRule";

import { 
  usePrepareShareholdersAgreementRemoveRule, 
  useShareholdersAgreementRemoveRule 
} from "../../../../generated";

import { bigint } from "ethers";

export interface VotingRuleWrap {
  subTitle: string,
  votingRule: VotingRule,
}

interface VotingRulesProps {
  sha: HexType;
  initSeqList: number[] | undefined;
  isFinalized: boolean;
}

export function VotingRules({sha, initSeqList, isFinalized}: VotingRulesProps) {

  const mandatoryRules: number[] = [1,2,3,4,5,6,7,8,9,10,11,12];

  const [ cp, setCp ] = useState(mandatoryRules);

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

  // const {
  //   config: removeRuleConfig
  // } = usePrepareShareholdersAgreementRemoveRule({
  //   address: sha,
  //   args: [BigInt(cp[cp.length - 1])]
  // })

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
        variant="outlined"
        startIcon={<ListAlt />}
        sx={{ m:0.5, minWidth: 248, justifyContent:'start' }}
        onClick={()=>setOpen(true)}      
      >
        Voting Rules 
      </Button>

      <Dialog
        maxWidth={false}
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="dialog-title"        
      >
        <DialogContent>

          <Paper elevation={3} sx={{ m:1, p:1, border:1, borderColor:'divider' }}>
            <Box sx={{ width:1180 }}>

              <Stack direction={'row'} sx={{ alignItems:'center' }}>
                <Toolbar sx={{ textDecoration:'underline' }}>
                  <h4>Voting Rules</h4>
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
                      disabled={ cp.length < 13 || removeRuleLoading || !removeRule }
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

                {cp.map(v=> (
                  <Grid key={ v } item xs={3} >
                      <SetVotingRule  sha={ sha } seq={ v } isFinalized={ isFinalized } />
                  </Grid>
                ))}

              </Grid>

            </Box>
          </Paper>

        </DialogContent>

        <DialogActions>
            <Button onClick={()=>setOpen(false)}>Close</Button>
        </DialogActions>

      </Dialog>
    
    </>
  );
} 

