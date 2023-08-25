import { useState } from "react";

import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, Toolbar } from "@mui/material";
import { Calculate, Handshake, ListAltOutlined } from "@mui/icons-material";
import { useGeneralKeeperComputeFirstRefusal, useRegisterOfAgreementsHasFrClaims } from "../../../../generated";
import { centToDollar, dateParser, longSnParser, toPercent } from "../../../../scripts/toolsKit";
import { ActionsOfDealCenterProps, ActionsOfDealProps } from "./ActionsOfDeal";
import { FRClaim, getFRClaimsOfDeal } from "../../../../queries/roa";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { defaultDeal } from "../../../../queries/ia";
import { CopyLongStrSpan } from "../../../common/utils/CopyLongStr";

export function GetFRClaims({ia, deal, setOpen, setDeal, refreshDealsList, timeline, timestamp}: ActionsOfDealCenterProps) {
  const { gk, boox } = useComBooxContext();

  const [ claims, setClaims ] = useState<readonly FRClaim[]>([]);
  const [ appear, setAppear ] = useState(false);

  const closeOrderOfDeal = ()=>{
    setDeal(defaultDeal);
    refreshDealsList();
    setOpen(false);
  }

  const columns: GridColDef[] = [
    {
      field: 'seqOfDeal', 
      headerName: 'SeqOfDeal',
      valueGetter: p => longSnParser(p.row.seqOfDeal.toString()),
      width: 128,
      headerAlign:'center',
      align:'center',
    },

    { 
      field: 'claimer', 
      headerName: 'Claimer',
      valueGetter: p => longSnParser(p.row.claimer.toString()),
      headerAlign:'right',
      align: 'right',
      width: 218,
    },
    { 
      field: 'weight', 
      headerName: 'Weight',
      valueGetter: p => centToDollar(p.row.weight.toString()) ,
      headerAlign:'right',
      align: 'right',
      width: 218,
    },
    { 
      field: 'ratio', 
      headerName: 'Ratio',
      valueGetter: p => toPercent(p.row.ratio.toString()) ,
      headerAlign:'center',
      align: 'center',
      width: 218,
    },
    { 
      field: 'sigDate', 
      headerName: 'SigDate',
      valueGetter: p => dateParser(p.row.sigDate) ,
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
  
  const {
    refetch: getFRClaims,
  } = useRegisterOfAgreementsHasFrClaims({
    address: boox ? boox[6] : undefined,
    args: [ia, BigInt(deal.head.seqOfDeal)],
    onSuccess(flag) {
      if (flag && boox)
        getFRClaimsOfDeal(boox[6], ia, deal.head.seqOfDeal).
          then(v => setClaims(v));
    }
  })

  const handleClick = () => {
    setAppear(true);
  }

  const {
    isLoading: computeFirstRefusalLoading,
    write: computeFirstRefusal,
  } = useGeneralKeeperComputeFirstRefusal({
    address: gk,
    args: [ ia, BigInt(deal.head.seqOfDeal)],
    onSuccess() {
      closeOrderOfDeal()
    }
  })

  return (
    <>
      <Button
        variant="outlined"
        fullWidth
        startIcon={<ListAltOutlined />}
        sx={{ m:1, height:40 }}
        onClick={handleClick}
      >
        FR Claims ({claims?.length})
      </Button>

      <Dialog
        maxWidth={false}
        open={appear}
        onClose={()=>setAppear(false)}
        aria-labelledby="dialog-title"
      >

        <DialogTitle id="dialog-title" sx={{ textDecoration:'underline' }} >
          <b>First Refusal Claims</b>
        </DialogTitle>

        <DialogContent>

          <Box sx={{minWidth: '1680' }}>
            {claims && (  
              <DataGrid 
                initialState={{pagination:{paginationModel:{pageSize: 5}}}} 
                pageSizeOptions={[5, 10, 15, 20]} 
                getRowId={row => row.claimer} 
                rows={ claims } 
                columns={ columns }
                disableRowSelectionOnClick
                // onRowClick={handleRowClick}
              />
            )}

            { claims && claims.length > 0 && timestamp >= timeline.frDeadline && timestamp < timeline.terminateStart &&  (
              <Paper elevation={3} sx={{
                m:1, p:1, 
                border: 1, 
                borderColor:'divider' 
                }} 
              >
                <Toolbar>
                <h4>Compute First Refusal Claims</h4> 
                </Toolbar>

                <Stack direction="row" sx={{ alignItems:'center' }} >
                  
                  <Button 
                    disabled = { computeFirstRefusalLoading }
                    sx={{ m: 1, minWidth: 168, height: 40 }} 
                    variant="contained" 
                    endIcon={<Calculate />}
                    onClick={()=> computeFirstRefusal?.()}
                    size='small'
                  >
                    Compute
                  </Button>

                </Stack>
              </Paper>
            )}
          </Box>

        </DialogContent>

        <DialogActions>
          <Button 
            sx={{m:1, mx:3, p:1, minWidth:128 }}
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