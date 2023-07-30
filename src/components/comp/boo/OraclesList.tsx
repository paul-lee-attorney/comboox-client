import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Typography } from "@mui/joy";

import { dateParser, longDataParser, longSnParser } from "../../../scripts/toolsKit";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { CheckPoint } from "../../../queries/boo";

const columns: GridColDef[] = [
  { 
    field: 'timestamp', 
    headerName: 'Timestamp',
    valueGetter: p => dateParser(p.row.timestamp),
    width: 180,
  },
  { 
    field: 'paid', 
    headerName: 'Paid',
    valueGetter: p => longDataParser(p.row.paid.toString()),
    headerAlign: 'right',
    align:'right',
    width: 180,
  },
  { 
    field: 'par', 
    headerName: 'Par',
    valueGetter: p => longDataParser(p.row.par.toString()),
    headerAlign: 'right',
    align:'right',
    width: 180,
  },  
  { 
    field: 'cleanPaid', 
    headerName: 'CleanPaid',
    valueGetter: p => longDataParser(p.row.cleanPaid.toString()),
    headerAlign: 'right',
    align:'right',
    width: 180,
  },
];

interface OraclesListProps{
  list: readonly CheckPoint[];
  seqOfOpt: number;
}

export function OraclesList({ list, seqOfOpt }: OraclesListProps) {

  const [ open, setOpen ] = useState(false);
  const [ oracle, setOracle ] = useState<CheckPoint>();

  useEffect(()=>{
    let len = list.length;
    if (len > 0)
      setOracle(list[len-1]);
  }, [list])

  const handleClick = ()=>{
    setOpen(true);
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
          p1: { longDataParser(oracle ? oracle.paid.toString(): '0')} 
          p2: { longDataParser(oracle ? oracle.par.toString(): '0')}
          p3: { longDataParser(oracle ? oracle.cleanPaid.toString(): '0')}
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
          Oracles List For The Option - { longSnParser( seqOfOpt.toString() )}
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
          <Button variant="outlined" sx={{ m:1, mx:3 }} onClick={()=>setOpen(false)}>Close</Button>
        </DialogActions>

      </Dialog>

    </>
  )

}