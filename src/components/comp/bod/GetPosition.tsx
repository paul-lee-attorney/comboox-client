import { useEffect, useState } from "react";
import { readContract } from "@wagmi/core";

import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { BigNumber } from "ethers";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { AssignmentInd, FollowTheSigns, Rule } from "@mui/icons-material";
import { useBookOfDirectorsGetPosition, useGeneralKeeperQuitPosition, usePrepareGeneralKeeperQuitPosition } from "../../../generated";
import dayjs from "dayjs";
import { dateParser, longSnParser } from "../../../scripts/toolsKit";
import { titleOfNominator, titleOfPositions } from "../boh/rules/SetPositionAllocateRule";
import { Position } from "../../../queries/bod";
import { QuitPosition } from "./QuitPosition";
import { GetVotingRule } from "../boh/rules/GetVotingRule";


interface GetPositionProps{
  seq: number;
  getOfficersList: ()=>any;
}

export function GetPosition({seq, getOfficersList}: GetPositionProps) {
  const { gk, boox } = useComBooxContext();

  const [ pos, setPos ] = useState<Position>();

  const {
    refetch: getPosition
  } = useBookOfDirectorsGetPosition({
    address: boox ? boox[2]: undefined,
    args: [BigNumber.from(seq)],
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
        sx={{ m:1 }}
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
                  variant='filled'
                  label='UserNo.'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    width: 450,
                  }}
                  value={ longSnParser(pos?.acct.toString() ?? '0' ) }
                />
              </Stack>

              <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                <TextField 
                  variant='filled'
                  label='Nominator'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ longSnParser(pos?.nominator.toString() ?? '0') }
                />

                <TextField 
                  variant='filled'
                  label='TitleOfNominator'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ titleOfNominator[(pos?.titleOfNominator ?? 1) -1] }
                />

              </Stack>

              <Stack direction={'row'} sx={{ alignItems: 'center' }} >
                
                {pos && (
                  <TextField 
                    variant='filled'
                    label='StartDate.'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ dateParser(pos.startDate) }
                  />
                )}

                {pos && (
                  <TextField 
                    variant='filled'
                    label='EndDate'
                    inputProps={{readOnly: true}}
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ dateParser( pos.endDate ) }
                  />
                )}

              </Stack>
              <Stack direction={'row'} sx={{ m:1, p:1, alignItems: 'center' }} >
                {pos && (
                  <GetVotingRule seq={pos.seqOfVR} />
                )}
              </Stack>

            </Stack>

          </Paper>

        </DialogContent>

        <DialogActions>
          <QuitPosition seq={seq} getOfficersList={getOfficersList} setOpen={setOpen} refreshPosition={getPosition} />          
          <Button 
            sx={{m:1, ml:5, p:1, minWidth:128 }}
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