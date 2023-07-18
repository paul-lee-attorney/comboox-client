import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Chip } from "@mui/material";
import { LinearProgress, Typography } from "@mui/joy";

import { dateParser, longDataParser, longSnParser, toPercent } from "../../../scripts/toolsKit";
import { Bytes32Zero, HexType } from "../../../interfaces";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Ballot, VoteCase, getBallotsList } from "../../../queries/meetingMinutes";
import { Brief, CheckPoint, counterOfBriefs, getAllBriefsOfOption, getAllOraclesOfOption, getLatestOracle, getOracleAtDate } from "../../../queries/boo";


const statesOfSwap = [
  'Pending', 'Issued', 'Crystalized', 'Locked', 'Released', 'Executed', 'Revoked'
]


const columns: GridColDef[] = [
  { 
    field: 'seqOfBrf', 
    headerName: 'SeqOfBrief',
    valueGetter: p => longSnParser(p.row.seqOfBrf),
    width: 80,
  },
  { 
    field: 'seqOfSwap', 
    headerName: 'SeqOfSwap',
    valueGetter: p => longSnParser(p.row.seqOfSwap),
    width: 80,
  },
  { 
    field: 'rateOfSwap', 
    headerName: 'RateOfSwap',
    valueGetter: p => longDataParser(p.row.rateOfSwap.toString()),
    headerAlign: 'right',
    align:'right',
    width: 180,
  },
  { 
    field: 'paidOfConsider', 
    headerName: 'PaidOfConsider',
    valueGetter: p => longDataParser(p.row.paidOfConsider.toString()),
    headerAlign: 'right',
    align:'right',
    width: 180,
  },  
  { 
    field: 'paidOfTarget', 
    headerName: 'PaidOfTarget',
    valueGetter: p => longDataParser(p.row.paidOfTarget.toString()),
    headerAlign: 'right',
    align:'right',
    width: 180,
  },  
  { 
    field: 'obligor', 
    headerName: 'Obligor',
    valueGetter: p => longSnParser(p.row.obligor.toString()),
    headerAlign: 'right',
    align:'right',
    width: 180,
  },  
  {
    field: 'state',
    headerName: 'State',
    valueGetter: p => p.row.state,
    width: 80,
    headerAlign:'center',
    align: 'center',
    renderCell: ({ value }) => (
      <Chip 
        variant='filled'
        label={ 
          statesOfSwap[value]
        } 
        sx={{width: 80}}
        color={
          value == 6
          ? 'error'
          : value == 5
            ? 'success'
            : value == 4
              ? 'primary'
              : value == 3
                ? 'info'
                : value == 2
                  ? 'warning'
                  : value == 1
                    ? 'secondary'
                    : 'default'
        }
      />
    )
  },
];

interface BriefsListProps{
  addr: HexType;
  seqOfOpt: number;
}

export function BriefsList({ addr, seqOfOpt }: BriefsListProps) {

  const [ qtyOfBrfs, setQtyOfBrfs ] = useState<number>(0);
  const [ list, setList ] = useState<readonly Brief[]>();
  const [ open, setOpen ] = useState(false);

  useEffect(()=>{
    counterOfBriefs(addr, seqOfOpt).then(
      v => setQtyOfBrfs(v)
    )
  });

  const handleClick = async () => {
    let ls = await getAllBriefsOfOption(addr, seqOfOpt);
    if (ls) {
      setList(ls);
      setOpen(true);
    }
  }

  return (
    <>
      <Button fullWidth onClick={ handleClick } >

        <Typography
          level="body3"
          fontWeight="xl"
          textColor="common.white"
          sx={{ mixBlendMode: 'difference' }}
        >
          Breifs List (QTY: {qtyOfBrfs})
        </Typography>            

      </Button>

      <Dialog
        maxWidth="xl"
        fullWidth
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="dialog-title"
        sx={{m:1, p:1}}
      >
        <DialogTitle id="dialog-title">
          Briefs List of Option (NO. { longSnParser( seqOfOpt.toString() )})
        </DialogTitle>

        <DialogContent>

          <Box sx={{minWidth: '1280' }}>
            {list && (
              <DataGrid 
                initialState={{pagination:{paginationModel:{pageSize: 5}}}} 
                pageSizeOptions={[5, 10, 15, 20]} 
                getRowId={row => row.acct} 
                rows={ list } 
                columns={ columns }
                disableRowSelectionOnClick
              />      
            )}
          </Box>

        </DialogContent>

        <DialogActions>
          <Button onClick={()=>setOpen(false)}>Close</Button>
        </DialogActions>

      </Dialog>

    </>
  )

}