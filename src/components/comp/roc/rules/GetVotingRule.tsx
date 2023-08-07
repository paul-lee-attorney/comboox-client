import { useEffect, useState } from "react";
import { readContract } from "@wagmi/core";

import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { AddrZero, HexType } from "../../../../interfaces";
import { registerOfConstitutionABI, useRegisterOfConstitution, useRegisterOfConstitutionPointer, useShareholdersAgreementGetRule } from "../../../../generated";
import { VotingRule, authorities, vrParser } from "./SetVotingRule";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, TextField, Toolbar } from "@mui/material";
import { ListAlt } from "@mui/icons-material";
import { toPercent } from "../../../../scripts/toolsKit";
import { getSha } from "../../../../queries/roc";
import { getRule } from "../../../../queries/sha";


interface GetVotingRuleProps{
  seq: number;
}

export function GetVotingRule({seq}: GetVotingRuleProps) {
  const { boox } = useComBooxContext();

  // const [ sha, setSha ] = useState<HexType>();

  const [ objVr, setObjVr] = useState<VotingRule>();
  
  useRegisterOfConstitutionPointer({
    address: boox ? boox[1] : undefined,
    onSuccess(res) {
      if (res != AddrZero)
        getRule(res, seq).then(
          rule => setObjVr(vrParser(rule))
        )
    }
  })

  const [ open, setOpen ] = useState(false);

  const handleClick = async ()=> {
    // await obtainVR();
    setOpen(true);
  }

  return (
    <>
      {objVr && (
        <Button
          // disabled={ !objVr }
          variant="outlined"
          startIcon={<ListAlt />}
          fullWidth={true}
          sx={{ m:1, height:40 }}
          onClick={ handleClick }      
        >
          Seq Of VotingRule: {seq}
        </Button>
      )}

      {objVr && (
        <Dialog
          maxWidth={false}
          open={open}
          onClose={()=>setOpen(false)}
          aria-labelledby="dialog-title"
        >
          <DialogTitle id="dialog-title" sx={{ textDecoration:'underline' }}>
            <h4>Voting Rule - No. {seq} ({objVr.seqOfSubRule} / {objVr.qtyOfSubRule})</h4>
          </DialogTitle>

          <DialogContent>

            <Paper elevation={3} sx={{
              alignContent:'center', 
              justifyContent:'center', 
              p:1, m:1, 
              border: 1, 
              borderColor:'divider' 
              }} 
            >

              <Stack 
                direction={'column'} 
                spacing={1} 
              >

                <Stack direction={'row'} sx={{ alignItems: 'center' }} >
                  {objVr && (
                    <TextField 
                      variant='outlined'
                      label='Authority'
                      inputProps={{readOnly: true}}
                      size="small"
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={ authorities[objVr.authority - 1] }
                    />
                  )}

                  {objVr.headRatio > 0 && (
                    <TextField 
                      variant='outlined'
                      label='HeadRatio'
                      inputProps={{readOnly: true}}
                      size="small"
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={toPercent(objVr.headRatio)}
                    />
                  )}

                  {objVr.amountRatio > 0 && (
                    <TextField 
                      variant='outlined'
                      label='AmountRatio'
                      inputProps={{readOnly: true}}
                      size="small"
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={toPercent(objVr.amountRatio)}
                    />
                  )}

                </Stack>

                <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                  <TextField 
                    variant='outlined'
                    label='OnlyAttendance ?'
                    inputProps={{readOnly: true}}
                    size="small"
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={objVr.onlyAttendance ? 'True' : 'False'}
                  />

                  {objVr.impliedConsent && (
                    <TextField 
                      variant='outlined'
                      label='ImpliedConsent ?'
                      inputProps={{readOnly: true}}
                      size="small"
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={objVr.impliedConsent ? 'True' : 'False'}
                    />
                  )}

                  <TextField 
                    variant='outlined'
                    label='PartyAsConsent ?'
                    inputProps={{readOnly: true}}
                    size="small"
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={objVr.partyAsConsent ? 'True' : 'False'}
                  />

                  {objVr.againstShallBuy && (
                    <TextField 
                      variant='outlined'
                      label='AgainstShallBuy ?'
                      inputProps={{readOnly: true}}
                      size="small"
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={objVr.againstShallBuy ? 'True' : 'False'}
                    />
                  )}

                </Stack>

                <Stack direction={'row'} sx={{ alignItems: 'center' }} >
                  {objVr.vetoers[0] > 0 && (
                    <TextField 
                      variant='outlined'
                      label='Vetoer_1'
                      inputProps={{readOnly: true}}
                      size="small"
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={objVr.vetoers[0].toString()}
                    />
                  )}

                  {objVr.vetoers[1] > 0 && (
                    <TextField 
                      variant='outlined'
                      label='Vetoer_2'
                      inputProps={{readOnly: true}}
                      size="small"
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={objVr.vetoers[1].toString()}
                    />
                  )}

                </Stack>

                <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                  {objVr.shaExecDays > 0 && (
                    <TextField 
                      variant='outlined'
                      label='ShaExecDays'
                      inputProps={{readOnly: true}}
                      size="small"
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={objVr.shaExecDays.toString()}
                    />
                  )}

                  {objVr.shaConfirmDays > 0 && (
                    <TextField 
                      variant='outlined'
                      label='ReviewDays'
                      inputProps={{readOnly: true}}
                      size="small"
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={objVr.shaConfirmDays.toString()}
                    />
                  )}

                  {objVr.reconsiderDays > 0 && (
                    <TextField 
                      variant='outlined'
                      label='ReconsiderDays'
                      inputProps={{readOnly: true}}
                      size="small"
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={objVr.reconsiderDays.toString()}
                    />
                  )}

                </Stack>

                <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                  {objVr.votePrepareDays > 0 && (
                    <TextField 
                      variant='outlined'
                      label='VotePrepareDays'
                      inputProps={{readOnly: true}}
                      size="small"
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={objVr.votePrepareDays.toString()}
                    />
                  )}

                  <TextField 
                    variant='outlined'
                    label='VotingDays'
                    inputProps={{readOnly: true}}
                    size="small"
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={objVr.votingDays.toString()}
                  />

                  {objVr.execDaysForPutOpt > 0 && (
                    <TextField 
                      variant='outlined'
                      label='ExecDaysForPutOpt'
                      inputProps={{readOnly: true}}
                      size="small"
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={objVr.execDaysForPutOpt.toString()}
                    />
                  )}
                  
                </Stack>

              </Stack>

            </Paper>

          </DialogContent>

          <DialogActions>
            <Button variant="outlined" sx={{ m:1, mx:3 }} onClick={()=>setOpen(false)}>Close</Button>
          </DialogActions>
    
        </Dialog>

      )}
    </>
  );
}