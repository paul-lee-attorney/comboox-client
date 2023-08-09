import { Button, Chip, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Paper, TextField, Toolbar } from "@mui/material";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Article } from "@mui/icons-material";
import { dateParser, longDataParser, longSnParser } from "../../../scripts/toolsKit";

import { InfoOfFile } from "../../../queries/filesFolder";

import { CopyLongStrTF } from "../utils/CopyLongStr";
import { GetVotingRule } from "../../comp/roc/rules/GetVotingRule";
import { labState } from "./GetFilesList";

export interface IndexCardProps{
  file: InfoOfFile;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function IndexCard({file, open, setOpen}: IndexCardProps) {

  return (
    <Dialog
      maxWidth={false}
      open={open}
      onClose={()=>setOpen(false)}
      aria-labelledby="dialog-title"
      sx={{m:1, p:1}} 
    >
      {/* <DialogTitle id="dialog-title" sx={{ textDecoration:'underline' }}>
        <h4>{"Index Card"}</h4>
      </DialogTitle> */}
      <DialogContent>
        <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >
          <table width={1580} >
            <thead> 
              <tr>
                <td colSpan={3}>
                  <Toolbar sx={{ color:'black', textDecoration:'underline' }}>
                    <h4>Index Card of File</h4>
                  </Toolbar>
                </td>
                <td>
                  <Chip 
                    variant='filled'
                    label={ 
                      labState[(file.head.state ?? 1) - 1]
                    } 
                    sx={{width: 128}}
                    color={
                      file.head.state == 7
                      ? 'success'
                      : file.head.state == 6
                        ? 'error'
                        : file.head.state == 5
                          ? 'info'
                          : file.head.state == 4
                            ? 'secondary'
                            : file.head.state == 3
                              ? 'primary'
                              : file.head.state == 2
                                ? 'warning'
                                : 'default'
                    }
                  />
                </td>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  <CopyLongStrTF size="body1" title="Addr:" src={file.addr}  />
                </td>            
                <td>
                  <CopyLongStrTF size="body1" title="Sn:" src={file.sn} />
                </td>            
                <td>
                  <CopyLongStrTF size="body1" title="Url:" src={file.ref.docUrl} />
                </td>            
                <td>
                  <CopyLongStrTF size="body1" title="Hash:" src={file.ref.docHash} />
                </td>
              </tr>

              <tr>
                <td>
                  <TextField 
                    fullWidth
                    inputProps={{readOnly: true}}
                    sx={{ m:1 }} 
                    id="tfCirculateDate" 
                    label="CirculateDate" 
                    variant="outlined"
                    value = { dateParser(file.head.circulateDate) }
                    size='small'
                  />
                </td>
                <td>
                  <TextField 
                    fullWidth
                    inputProps={{readOnly: true}}
                    sx={{ m:1 }} 
                    id="tfSigningDeadline" 
                    label="SigningDeadline" 
                    variant="outlined"
                    value = { dateParser(file.head.circulateDate + file.head.signingDays * 86400) }
                    size='small'
                  />
                </td>
                <td>
                  <TextField 
                    fullWidth
                    inputProps={{readOnly: true}}
                    sx={{ m:1 }} 
                    id="tfShaExecDeadline" 
                    label="ShaExecDeadline" 
                    variant="outlined"
                    value = { dateParser(file.head.circulateDate + (file.head.signingDays + file.head.shaExecDays) * 86400) }
                    size='small'
                  />
                </td>
                <td>
                  <TextField 
                    fullWidth
                    inputProps={{readOnly: true}}
                    sx={{ m:1 }} 
                    id="tfShaConfirmDeadline" 
                    label="ShaConfirmDeadline" 
                    variant="outlined"
                    value = { dateParser(file.head.circulateDate + (file.head.signingDays + file.head.shaExecDays + file.head.shaConfirmDays) * 86400) }
                    size='small'
                  />
                </td>
              </tr>

              <tr>
                <td>
                  <TextField 
                    fullWidth
                    inputProps={{readOnly: true}}
                    sx={{ m:1 }} 
                    id="tfProposeDate" 
                    label="ProposeDate" 
                    variant="outlined"
                    value = { dateParser(file.head.proposeDate) }
                    size='small'
                  />
                </td>
                <td>
                  <TextField 
                    fullWidth
                    inputProps={{readOnly: true}}
                    sx={{ m:1 }} 
                    id="tfShareRegDate" 
                    label="ShareRegDate" 
                    variant="outlined"
                    value = { dateParser(file.head.proposeDate + file.head.reconsiderDays * 86400) }
                    size='small'
                  />
                </td>
                <td>
                  <TextField 
                    fullWidth
                    inputProps={{readOnly: true}}
                    sx={{ m:1 }} 
                    id="tfVoteStartDate" 
                    label="VoteStartDate" 
                    variant="outlined"
                    value = { dateParser(file.head.proposeDate + (file.head.reconsiderDays + file.head.votePrepareDays) * 86400) }
                    size='small'
                  />
                </td>
                <td>
                  <TextField 
                    fullWidth
                    inputProps={{readOnly: true}}
                    sx={{ m:1 }} 
                    id="tfVoteEndDate" 
                    label="VoteEndDate" 
                    variant="outlined"
                    value = { dateParser(file.head.proposeDate + (file.head.reconsiderDays + file.head.votePrepareDays + file.head.votingDays) * 86400) }
                    size='small'
                  />
                </td>
              </tr>

              <tr>
                <td>
                  <GetVotingRule seq={file.head.seqOfVR} />
                </td>
                <td>
                  <TextField 
                    fullWidth
                    inputProps={{readOnly: true}}
                    sx={{ m:1 }} 
                    id="tfSeqOfMotion" 
                    label="SeqOfMotion" 
                    variant="outlined"
                    value = { longDataParser( file.head.seqOfMotion.toString() ) }
                    size='small'
                  />
                </td>
                <td>
                  <TextField 
                    fullWidth
                    inputProps={{readOnly: true}}
                    sx={{ m:1 }} 
                    id="tfPutOptionDeadline" 
                    label="PutOptionDeadline" 
                    variant="outlined"
                    value = { dateParser(file.head.proposeDate + (file.head.reconsiderDays + file.head.votePrepareDays + file.head.votingDays + file.head.execDaysForPutOpt) * 86400) }
                    size='small'
                  />
                </td>
                <td>
                  <TextField 
                    fullWidth
                    inputProps={{readOnly: true}}
                    sx={{ m:1 }} 
                    id="tfClosingDeadline" 
                    label="ClosingDeadline" 
                    variant="outlined"
                    value = { dateParser(file.head.circulateDate + file.head.closingDays * 86400) }
                    size='small'
                  />
                </td>
              </tr>

            </tbody>
          </table>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" sx={{ m:1, mx:3 }} onClick={()=>setOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>

  )
}