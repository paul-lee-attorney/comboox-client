import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Chip, Stack, TextField, Typography } from "@mui/material";

import { centToDollar, longDataParser, longSnParser } from "../../../scripts/common/toolsKit";
import { useState } from "react";
import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import { Swap, checkValueOfSwap} from "../../../scripts/comp/roo";
import { useComBooxContext } from "../../../scripts/common/ComBooxContext";
import { booxMap } from "../../../scripts/common";


const statesOfSwap = [
  'Pending', 'Issued', 'Closed', 'Terminated'
]

interface SwapsListProps{
  list: readonly Swap[];
  seqOfOpt: number;
}

export function SwapsList({ list, seqOfOpt }: SwapsListProps) {

  const { boox } = useComBooxContext();

  const [ open, setOpen ] = useState(false);

  const handleClick = async () => {
    setOpen(true);
  }

  interface SwapWithValue{
    seqOfSwap: number;
    value: bigint;
  }

  const [ swapWithValue, setSwapWithValue ] = useState<SwapWithValue>();

  const [ showValue, setShowValue ] = useState(false);

  const handleRowClick: GridEventListener<'rowClick'> = async (p) => {
    if (boox) {
      let swapWrap:SwapWithValue = {
        seqOfSwap: p.row.seqOfSwap,
        value: await checkValueOfSwap(boox[booxMap.ROO], seqOfOpt, p.row.seqOfSwap),
      }
      setSwapWithValue(swapWrap);
      setShowValue(true);
    }
  }

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
      valueGetter: p =>  centToDollar(p.row.paidOfPledge.toString()),
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
      valueGetter: p =>  centToDollar(p.row.paidOfTarget.toString()),
      headerAlign: 'right',
      align:'right',
      width: 168,
    },  
    { 
      field: 'priceOfDeal', 
      headerName: 'PriceOfDeal',
      valueGetter: p => centToDollar(p.row.priceOfDeal.toString()),
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
        onClick={ handleClick } 
        sx={{
          m:1,
          height: 40
        }}
      >

        <Typography
          variant="body2"
          fontWeight="xl"
          color="primary"
        >
          Swaps List ({list.length})
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
          Swaps List of Option (NO. { longSnParser( seqOfOpt.toString() )})
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
                disableRowSelectionOnClick
                onRowClick={ handleRowClick }
              />      
            )}
          </Box>

          <Dialog
            maxWidth="xl"
            open={ showValue }
            onClose={()=>setShowValue(false)}
            sx={{m:1, p:2}}
          >
            <Stack direction='row' sx={{ alignItems:'center' }}>

              <TextField 
                variant='outlined'
                size='small'
                label='SeqOfSwap'
                inputProps={{readOnly: true}}
                sx={{
                  m:5,
                  mr:1, 
                  minWidth: 168,
                }}
                value={ swapWithValue?.seqOfSwap.toString() ?? '0'}
              />

              {swapWithValue && (
                <TextField 
                  variant='outlined'
                  size='small'
                  label='ValueOfSwap (GLee)'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:5,
                    ml:1,
                    minWidth: 388,
                  }}
                  value={ longDataParser((swapWithValue?.value / BigInt(10 ** 9) ?? '0').toString()) }
                />
              )}

              <Button variant="outlined" sx={{ m:5 }} onClick={()=>setShowValue(false)}>Close</Button>

            </Stack>

          </Dialog>

        </DialogContent>

        <DialogActions>
          <Button variant="outlined" sx={{ m:1, mx:3, }} onClick={()=>setOpen(false)}>Close</Button>
        </DialogActions>

      </Dialog>

    </>
  )

}