import { useState } from "react";

import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { HandshakeOutlined, ListAltOutlined } from "@mui/icons-material";
import { useGeneralKeeperAcceptAlongDeal } from "../../../../generated";
import { HexParser, dateParser, longDataParser, longSnParser } from "../../../../scripts/toolsKit";
import { ActionsOfDealProps } from "./ActionsOfDeal";
import { DTClaim, getDTClaimsOfDeal } from "../../../../queries/roa";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { Bytes32Zero, HexType } from "../../../../interfaces";
import { defaultDeal } from "../../../../queries/ia";
import { CopyLongStrSpan } from "../../../common/utils/CopyLongStr";

export function GetDTClaims({ia, deal, setOpen, setDeal, refreshDealsList}: ActionsOfDealProps) {
  const { gk, boox } = useComBooxContext();

  const [ claims, setClaims ] = useState<readonly DTClaim[]>();
  const [ appear, setAppear ] = useState(false);

  const closeOrderOfDeal = ()=>{
    setDeal(defaultDeal);
    refreshDealsList();
    setOpen(false);    
  }

  const columns: GridColDef[] = [
    {
      field: 'type', 
      headerName: 'Type',
      valueGetter: p => p.row.typeOfClaim,
      width: 88,
      headerAlign:'center',
      align:'center',
      renderCell: ({ value }) => (
        <Chip
          variant="filled"
          color={value == 0 ? 'primary' : 'success'}
          label={ value == 0 ? 'Drag' : 'Tag' } 
        />
      )
    },

    { 
      field: 'seqOfShare', 
      headerName: 'SeqOfShare',
      valueGetter: p => longSnParser(p.row.seqOfShare.toString()) ,
      headerAlign:'right',
      align: 'right',
      width: 218,
    },
    { 
      field: 'paid', 
      headerName: 'Paid',
      valueGetter: p => longDataParser(p.row.paid.toString()) ,
      headerAlign:'right',
      align: 'right',
      width: 218,
    },
    { 
      field: 'par', 
      headerName: 'Par',
      valueGetter: p => longDataParser(p.row.par.toString()) ,
      headerAlign:'right',
      align: 'right',
      width: 218,
    },
    { 
      field: 'claimer', 
      headerName: 'Claimer',
      valueGetter: p => longSnParser(p.row.claimer.toString()) ,
      headerAlign:'center',
      align: 'center',
      width: 218,
    },
    { 
      field: 'sigDate', 
      headerName: 'SigDate',
      valueGetter: p => dateParser(p.row.sigDate.toString()) ,
      headerAlign:'center',
      align: 'center',
      width: 218,
    },
    { 
      field: 'sigHash', 
      headerName: 'SigHash',
      valueGetter: p => p.row.sigHash,
      headerAlign:'center',
      align: 'center',
      width: 218,
      renderCell:({value})=>(
        <CopyLongStrSpan title='Hash' size='body1' src={value} />
      )
    },
  ]
  
  const handleClick = async () => {
    if (boox) {
      let ls = await getDTClaimsOfDeal(boox[6], ia, deal.head.seqOfDeal);
      setClaims(ls);
      setAppear(true);
    }
  }

  // const [ seqOfShare, setSeqOfShare ] = useState<number>();

  // const handleRowClick = async (p:GridRowParams)=> {
  //   setSeqOfShare(p.row.seqOfShare);
  // }

  const [ sigHash, setSigHash ] = useState<HexType>(Bytes32Zero);

  const {
    isLoading: acceptAlongDealLoading,
    write: acceptAlongDeal,
  } = useGeneralKeeperAcceptAlongDeal({
    address: gk,
    args: [ ia, BigInt(deal.head.seqOfDeal), sigHash],
    onSuccess() {
      closeOrderOfDeal()
    }
  })

  return (
    <>
      {/* {claims && ( */}
        <Button
          // disabled={ !claims }
          variant="outlined"
          fullWidth={true}
          startIcon={<ListAltOutlined />}
          sx={{ m:1 }}
          onClick={handleClick}
        >
          DT Claims ({claims?.length})
        </Button>
      {/* )} */}

      <Dialog
        maxWidth={false}
        open={appear}
        onClose={()=>setAppear(false)}
        aria-labelledby="dialog-title"
      >

        <DialogTitle id="dialog-title" sx={{ textDecoration:'underline' }} >
          <b>DragAlong / TagAlong Claims - {deal.head.seqOfDeal}</b>
        </DialogTitle>

        <DialogContent>

          <Box sx={{minWidth: '1680' }}>
            {claims && (
              <DataGrid 
                initialState={{pagination:{paginationModel:{pageSize: 5}}}} 
                pageSizeOptions={[5, 10, 15, 20]} 
                getRowId={row => row.seqOfShare} 
                rows={ claims } 
                columns={ columns }
                disableRowSelectionOnClick
                // onRowClick={handleRowClick}
              />      
            )}

            <Paper elevation={3} sx={{
              m:1, p:1, 
              border: 1, 
              borderColor:'divider' 
              }} 
            >
              <Toolbar>
               <h4>Accept Tag/Drag Claim</h4> 
              </Toolbar>
              <Stack direction="row" sx={{ alignItems:'center' }} >
                
                <TextField
                  variant='outlined'
                  label='SigHash'
                  size="small"
                  sx={{
                    m:1,
                    minWidth: 640,
                  }}
                  value={ sigHash }
                  onChange={(e)=>setSigHash(HexParser( e.target.value ))}
                />              

                <Button 
                  disabled = { acceptAlongDealLoading }
                  sx={{ m: 1, minWidth: 218, height: 40 }} 
                  variant="contained" 
                  endIcon={<HandshakeOutlined />}
                  onClick={()=> acceptAlongDeal?.()}
                  size='small'
                >
                  Accept
                </Button>

              </Stack>
            </Paper>
            
          </Box>

        </DialogContent>

        <DialogActions>
          <Button 
            sx={{m:1, ml:5, p:1, minWidth:128 }}
            variant="outlined"
            onClick={()=>setAppear(false)}
          >
            Close
          </Button>
        </DialogActions>
      
      </Dialog>
    </>
  );
}