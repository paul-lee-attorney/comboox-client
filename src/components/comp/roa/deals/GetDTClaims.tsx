import { useEffect, useState } from "react";

import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, TextField, Toolbar } from "@mui/material";
import { HandshakeOutlined, ListAltOutlined } from "@mui/icons-material";
import { useGeneralKeeperAcceptAlongDeal, useRegisterOfAgreementsHasDtClaims, } from "../../../../generated";
import { HexParser, centToDollar, dateParser, longSnParser } from "../../../../scripts/common/toolsKit";
import { ActionsOfDealCenterProps } from "./ActionsOfDeal";
import { DTClaim, getDTClaimsOfDeal, hasDTClaims } from "../../../../scripts/comp/roa";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Bytes32Zero, HexType, booxMap } from "../../../../scripts/common";
import { defaultDeal } from "../../../../scripts/comp/ia";
import { CopyLongStrSpan } from "../../../common/utils/CopyLongStr";

export function GetDTClaims({addr, deal, setOpen, setDeal, setTime, timeline, timestamp}: ActionsOfDealCenterProps) {
  const { gk, boox } = useComBooxContext();

  const [ claims, setClaims ] = useState<readonly DTClaim[]>([]);
  const [ appear, setAppear ] = useState(false);

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
      valueGetter: p => centToDollar(p.row.paid.toString()) ,
      headerAlign:'right',
      align: 'right',
      width: 218,
    },
    { 
      field: 'par', 
      headerName: 'Par',
      valueGetter: p => centToDollar(p.row.par.toString()) ,
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
        <CopyLongStrSpan title='Hash' src={value} />
      )
    },
  ];

  useEffect(()=>{
    if (boox) {
      hasDTClaims(boox[booxMap.ROA], addr, deal.head.seqOfDeal).then(
        flag => {
          if (flag) {
            getDTClaimsOfDeal(boox[booxMap.ROA], addr, deal.head.seqOfDeal).then(
              v => setClaims(v)
            );
          }
        }
      );
    }
  }, [boox, addr, deal.head.seqOfDeal]);

  const handleClick = async () => {
    setAppear(true);
  }

  const [ sigHash, setSigHash ] = useState<HexType>(Bytes32Zero);

  const {
    isLoading: acceptAlongDealLoading,
    write: acceptAlongDeal,
  } = useGeneralKeeperAcceptAlongDeal({
    address: gk,
    args: [ addr, BigInt(deal.head.seqOfDeal), sigHash],
    onSuccess() {
      setDeal(defaultDeal);
      setTime(Date.now());
      setOpen(false);    
    }
  })

  return (
    <>
      <Button
        // disabled={ !claims }
        variant="outlined"
        fullWidth
        startIcon={<ListAltOutlined />}
        sx={{ m:1, height:40 }}
        onClick={ handleClick }
      >
        DT Claims ({claims?.length})
      </Button>

      <Dialog
        maxWidth={false}
        open={appear}
        onClose={()=>setAppear(false)}
        aria-labelledby="dialog-title"
      >

        <DialogTitle id="dialog-title" sx={{ textDecoration:'underline' }} >
          <b>DragAlong / TagAlong Claims</b>
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

            {timestamp >= timeline.dtDeadline && timestamp < timeline.terminateStart && (
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
            )}

            
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