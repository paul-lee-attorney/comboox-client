import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Chip, } from "@mui/material";

import { longDataParser, longSnParser } from "../../../../scripts/common/toolsKit";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { Swap } from "../../../../scripts/comp/roo";
import { ActionsOfDealProps } from "./ActionsOfDeal";
import { ListAltOutlined } from "@mui/icons-material";
import { Deal, getAllSwaps, statesOfSwap } from "../../../../scripts/comp/ia";
import { HexType } from "../../../../scripts/common";

export interface SwapsListProps {
  addr: HexType;
  deal: Deal;
}

export function SwapsList({ addr, deal }: SwapsListProps) {

  const [ list, setList ] = useState<readonly Swap[]>([]);

  useEffect(()=>{
    getAllSwaps(addr, deal.head.seqOfDeal).then(
      res => setList(res)
    );
  })

  const [ show, setShow ] = useState(false);

  const handleClick = async () => {
    setShow(true);
  }

  const [ seqOfSwap, setSeqOfSwap ] = useState<string>('0');

  const handleRowSelect = (ids: GridRowSelectionModel) => setSeqOfSwap(ids[0].toString());

  const columns: GridColDef[] = [
    { 
      field: 'seq', 
      headerName: 'Seq',
      valueGetter: p => longSnParser(p.row.seqOfSwap.toString()),
      width: 88,
    },
    { 
      field: 'seqOfPledge', 
      headerName: 'SeqOfPledge',
      valueGetter: p => longSnParser(p.row.seqOfPledge.toString()),
      width: 128,
    },
    { 
      field: 'paidOfPledge', 
      headerName: 'PaidOfPledge',
      valueGetter: p => longDataParser(p.row.paidOfPledge.toString()),
      headerAlign: 'right',
      align:'right',
      width: 168,
    },  
    { 
      field: 'seqOfTarget', 
      headerName: 'SeqOfTarget',
      valueGetter: p => longDataParser(p.row.seqOfTarget.toString()),
      headerAlign: 'right',
      align:'right',
      width: 168,
    },  
  
    { 
      field: 'paidOfTarget', 
      headerName: 'PaidOfTarget',
      valueGetter: p => longDataParser(p.row.paidOfTarget.toString()),
      headerAlign: 'right',
      align:'right',
      width: 168,
    },  
    { 
      field: 'priceOfDeal', 
      headerName: 'PriceOfDeal',
      valueGetter: p => longDataParser(p.row.priceOfDeal.toString()),
      headerAlign: 'right',
      align:'right',
      width: 168,
    },  
    { 
      field: 'optType', 
      headerName: 'TypeOfOpt',
      valueGetter: p => p.row.isPutOpt ? 'Put' : 'Call',
      headerAlign: 'center',
      align:'center',
      width: 128,
    },  
    {
      field: 'state',
      headerName: 'State',
      valueGetter: p => p.row.state,
      width: 128,
      headerAlign:'center',
      align: 'center',
      renderCell: ({ value }) => (
        <Chip 
          variant='filled'
          label={ 
            statesOfSwap[value]
          } 
          color={
            value == 3
            ? 'warning'
            : value == 2
              ? 'success'
              : value == 1
                ? 'primary'
                : 'default'
          }
        />
      )
    }  
  ];

  return (
    <>
      <Button 
        variant="outlined" 
        fullWidth 
        startIcon={<ListAltOutlined />}
        onClick={ handleClick } 
        sx={{
          m:1,
          height: 40
        }}
      >
        Swaps List ({list?.length})
      </Button>

      <Dialog
        maxWidth="xl"
        fullWidth
        open={ show }
        onClose={()=>setShow(false)}
        aria-labelledby="dialog-title"
        sx={{m:1, p:1}}
      >
        <DialogTitle id="dialog-title" sx={{ textDecoration:'underline' }} >
          <b>Swaps List</b>
        </DialogTitle>


        <DialogContent>

          <Box sx={{minWidth: '880' }}>
            {list && (
              <DataGrid 
                initialState={{pagination:{paginationModel:{pageSize: 5}}}} 
                pageSizeOptions={[5, 10, 15, 20]} 
                getRowId={row => row.seqOfSwap} 
                rows={ list } 
                columns={ columns }
                onRowSelectionModelChange={ handleRowSelect }
              />      
            )}
          </Box>

        </DialogContent>

        <DialogActions>
          <Button variant="outlined" sx={{ m:1, mx:3, }} onClick={()=>setShow(false)}>Close</Button>
        </DialogActions>

      </Dialog>

    </>
  )

}