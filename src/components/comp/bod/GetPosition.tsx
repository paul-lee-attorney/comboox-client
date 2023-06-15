import { useEffect, useState } from "react";
import { readContract } from "@wagmi/core";

import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { BigNumber } from "ethers";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { AssignmentInd, Rule } from "@mui/icons-material";
import { useBookOfDirectorsGetPosition } from "../../../generated";
import dayjs from "dayjs";


export interface Position {
  title: number;
  seqOfPos: number;
  acct: number;
  nominator: number;
  startDate: number;
  endDate: number;
  seqOfVR: number;
  para: number;
  argu: number;  
}

export const arrTitleOfOfficers = ['ZeroPoint', 'Chairman', 'ViceChairman', 'ManagingDirector', 'Director', 'CEO',
'CFO', 'COO', 'CTO', 'President', 'VicePresident', 'Supervisor', 'SeniorManager', 'Manager', 'ViceManager'];

interface GetPositionProps{
  seq: number;
}

export function GetPosition({seq}: GetPositionProps) {
  const { boox } = useComBooxContext();

  const [ pos, setPos ] = useState<Position>();

  useBookOfDirectorsGetPosition({
    address: boox[2],
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
          <DialogTitle id="dialog-title">
            Position Info - No. {pos.seqOfPos.toString().padStart(3, '0')}
          </DialogTitle>
        )}

        <DialogContent>

          <Paper sx={{
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
                <Typography>
                  <h3>
                    Title: { arrTitleOfOfficers[pos.title] }
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
                    minWidth: 218,
                  }}
                  value={ pos?.acct.toString().padStart(13, '0') }
                />

                <TextField 
                  variant='filled'
                  label='Nominator'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ pos?.nominator.toString().padStart(13, '0') }
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
                    value={ dayjs.unix( pos.startDate ).format('YYYY-MM-DD HH:mm:ss') }
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
                    value={ dayjs.unix( pos.endDate ).format('YYYY-MM-DD HH:mm:ss') }
                  />
                )}

              </Stack>

            </Stack>

          </Paper>

        </DialogContent>

        <DialogActions>
          <Button onClick={()=>setOpen(false)}>Close</Button>
        </DialogActions>
      
      </Dialog>
    </>
  );
}