import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

import { useComBooxContext } from '../../../scripts/common/ComBooxContext';

import { centToDollar, dateParser, longDataParser, longSnParser } from '../../../scripts/common/toolsKit';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ShareClip, votesHistory } from '../../../scripts/comp/rom';
import { booxMap } from '../../../scripts/common';

const columns: GridColDef[] = [
  {
    field: 'timestamp',
    headerName: 'timestamp',
    valueGetter: (p) => dateParser(p.row.timestamp.toString()),
    width: 218,
  },
  {
    field: 'votingWeight',
    headerName: 'VotingWeight (%)',
    valueGetter: (p) => longDataParser(p.row.votingWeight.toString()),
    width: 218,
    headerAlign: 'center',
    align: 'center',
  },
  {
    field: 'par',
    headerName: 'Par (Dollar)',
    valueGetter: (p) => centToDollar(p.row.par.toString()),
    width: 330,
    headerAlign: 'right',
    align: 'right',
  },
  {
    field: 'paid',
    headerName: 'Paid (Dollar)',
    valueGetter: (p) => centToDollar(p.row.paid.toString()),
    width: 330,
    headerAlign: 'right',
    align: 'right',
  },
  {
    field: 'clean',
    headerName: 'CleanPaid (Dollar)',
    valueGetter: (p) => centToDollar(p.row.cleanPaid.toString()),
    width: 330,
    headerAlign: 'right',
    align: 'right',
  },
]

interface InvHistoryOfMemberProps {
  acct: number;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;  
}

export function InvHistoryOfMember({acct, open, setOpen}: InvHistoryOfMemberProps) {
  const { boox } = useComBooxContext();

  const [ invHistory, setInvHistory ] = useState<readonly ShareClip[]>();

  useEffect(()=>{
    if (boox) {
      votesHistory(boox[booxMap.ROM], acct).then(
        res => setInvHistory(res)
      );
    }
  }, [boox, acct]);

  return (

    <Dialog
      maxWidth={false}
      open={open}
      onClose={()=>setOpen(false)}
      aria-labelledby="dialog-title" 
    >
      <DialogTitle id="dialog-title" sx={{ mx:2, textDecoration:'underline' }} >
        <b>Investment History of Member - {longSnParser(acct.toString())}</b>
      </DialogTitle>

      <DialogContent>

        {invHistory && (
          <DataGrid
            initialState={{pagination:{paginationModel:{pageSize: 5}}}}
            pageSizeOptions={[5, 10, 15, 20]}
            getRowId={row => row.timestamp.toString()}
            rows={ invHistory }
            columns={ columns }
          />
        )}

      </DialogContent>

      <DialogActions>
        <Button variant="outlined" sx={{ m:1, mx:3 }} onClick={()=>setOpen(false)}>Close</Button>
      </DialogActions>

    </Dialog>

  )
}



