
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";
import { AddrZero, booxMap } from "../../../../../scripts/common";
import { useRegisterOfConstitutionPointer } from "../../../../../generated";
import { VotingRule, authorities, vrParser } from "./SetVotingRule";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, TextField, } from "@mui/material";
import { ListAlt } from "@mui/icons-material";
import { toPercent } from "../../../../../scripts/common/toolsKit";
import { getRule } from "../../../../../scripts/comp/sha";
import { useState } from "react";


interface GetVotingRuleProps{
  seq: number;
}

export function GetVotingRule({seq}: GetVotingRuleProps) {
  const { boox } = useComBooxContext();

  const [ objVr, setObjVr] = useState<VotingRule>();
  
  useRegisterOfConstitutionPointer({
    address: boox ? boox[booxMap.ROC] : undefined,
    onSuccess(res) {
      if (res != AddrZero)
        getRule(res, seq).then(
          rule => setObjVr(vrParser(rule))
        )
    }
  })

  const [ open, setOpen ] = useState(false);

  const handleClick = ()=> {
    setOpen(true);
  }

  return (
    <>
      {objVr && (
        <Button
          variant="outlined"
          startIcon={<ListAlt />}
          fullWidth={true}
          sx={{ m:1, height:40 }}
          onClick={ handleClick }      
        >
          VotingRule: No. {seq}
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

                  {objVr.frExecDays > 0 && (
                    <TextField 
                      variant='outlined'
                      label='FRExecDays'
                      inputProps={{readOnly: true}}
                      size="small"
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={objVr.frExecDays.toString()}
                    />
                  )}

                  {objVr.dtExecDays > 0 && (
                    <TextField 
                      variant='outlined'
                      label='DTExecDays'
                      inputProps={{readOnly: true}}
                      size="small"
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={objVr.dtExecDays.toString()}
                    />
                  )}

                  {objVr.dtConfirmDays > 0 && (
                    <TextField 
                      variant='outlined'
                      label='DTConfirmDays'
                      inputProps={{readOnly: true}}
                      size="small"
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={objVr.dtConfirmDays.toString()}
                    />
                  )}

                </Stack>

                <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                  {objVr.invExitDays > 0 && (
                    <TextField 
                      variant='outlined'
                      label='InvExitDays'
                      inputProps={{readOnly: true}}
                      size="small"
                      sx={{
                        m:1,
                        minWidth: 218,
                      }}
                      value={objVr.invExitDays.toString()}
                    />
                  )}

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