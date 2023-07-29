import { useState } from "react";

import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, TextField, Typography } from "@mui/material";
import { AssignmentInd } from "@mui/icons-material";
import { useBookOfDirectorsGetPosition } from "../../../generated";
import { dateParser, longSnParser } from "../../../scripts/toolsKit";
import { titleOfPositions } from "../boc/rules/SetPositionAllocateRule";
import { Position } from "../../../queries/bod";
import { QuitPosition } from "./QuitPosition";
import { GetVotingRule } from "../boc/rules/GetVotingRule";


interface GetPositionProps{
  seq: number;
}

export function GetPosition({seq}: GetPositionProps) {
  const { boox } = useComBooxContext();

  const [ pos, setPos ] = useState<Position>();

  const {
    refetch: getPosition
  } = useBookOfDirectorsGetPosition({
    address: boox ? boox[2]: undefined,
    args: [BigInt(seq)],
    onSuccess(data) {
      setPos(data);
    } 
  })

  const [ open, setOpen ] = useState(false);

  return (
    <>
      <Button
        disabled={ !pos }
        variant="outlined"
        fullWidth={true}
        startIcon={<AssignmentInd />}
        sx={{ m:1, height:40 }}
        onClick={()=>setOpen(true)}      
      >
        Seq Of Position: {seq}
      </Button>

      <Dialog
        maxWidth={false}
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="dialog-title"
      >
        {pos && (
          <DialogTitle id="dialog-title" sx={{ textDecoration:'underline' }} >
            <b>Position Info - No. {pos.seqOfPos.toString().padStart(4, '0')}</b>
          </DialogTitle>
        )}

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
              {pos && (
                <Typography sx={{ ml:1, textDecoration:'underline' }} >
                  <h3>
                    Title: { titleOfPositions[pos.title - 1] }
                  </h3>
                </Typography>
              )}

              <Stack direction={'row'} sx={{ alignItems: 'center' }} >
                <TextField 
                  variant='outlined'
                  label='UserNo.'
                  inputProps={{readOnly: true}}
                  size="small"
                  sx={{
                    m:1,
                    width: 450,
                  }}
                  value={ longSnParser(pos?.acct.toString() ?? '0' ) }
                />
              </Stack>

              <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                <TextField 
                  variant='outlined'
                  label='Nominator'
                  inputProps={{readOnly: true}}
                  size="small"
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ longSnParser(pos?.nominator.toString() ?? '0') }
                />

                <TextField 
                  variant='outlined'
                  label='TitleOfNominator'
                  inputProps={{readOnly: true}}
                  size="small"
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ titleOfPositions[(pos?.titleOfNominator ?? 1) -1] }
                />

              </Stack>

              <Stack direction={'row'} sx={{ alignItems: 'center' }} >
                
                {pos && (
                  <TextField 
                    variant='outlined'
                    label='StartDate.'
                    inputProps={{readOnly: true}}
                    size="small"
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ dateParser(pos.startDate) }
                  />
                )}

                {pos && (
                  <TextField 
                    variant='outlined'
                    label='EndDate'
                    inputProps={{readOnly: true}}
                    size="small"
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ dateParser( pos.endDate ) }
                  />
                )}

              </Stack>
              <Stack direction={'row'} sx={{ alignItems: 'center' }} >
                {pos && (
                  <GetVotingRule seq={pos.seqOfVR} />
                )}
              </Stack>

            </Stack>

          </Paper>

        </DialogContent>

        <DialogActions>
          <QuitPosition seq={seq} setOpen={setOpen} refreshPosition={getPosition} />          
          <Button 
            sx={{m:1, mx:3, p:1, minWidth:128 }}
            variant="outlined"
            onClick={()=>setOpen(false)}
          >
            Close
          </Button>
        </DialogActions>
      
      </Dialog>
    </>
  );
}