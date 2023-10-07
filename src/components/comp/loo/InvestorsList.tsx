import { Chip, Paper, Stack, Toolbar, } from "@mui/material";
import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import { dateParser, longSnParser } from "../../../scripts/common/toolsKit";
import { Investor } from "../../../scripts/comp/loo";
import { Dispatch, SetStateAction } from "react";
import { CopyLongStrSpan } from "../../common/utils/CopyLongStr";

interface OrdersListProps {
  list: readonly Investor[];
  setAcct: Dispatch<SetStateAction<string>>;
}


export function InvestorsList({list, setAcct}:OrdersListProps) {

  const statesOfInvestor =[
    'Pending', 'Approved', 'Revoked'
  ]

  const columns: GridColDef[] = [

    {
      field: 'userNo',
      headerName: 'UserNo',
      valueGetter: p => longSnParser(p.row.userNo.toString()),
      headerAlign: 'center',
      align:'center',      
      width: 218,
    },
    {
      field: 'groupRep',
      headerName: 'GroupRep',
      valueGetter: p => longSnParser(p.row.groupRep.toString()),
      headerAlign: 'center',
      align:'center',      
      width: 218,
    },
    { 
      field: 'regDate', 
      headerName: 'RegDate',
      valueGetter: p => dateParser(p.row.regDate),
      headerAlign: 'center',
      align:'center',
      width: 180,
    },
    {
      field: 'verifier',
      headerName: 'Verifier',
      valueGetter: p => longSnParser(p.row.verifier.toString()),
      headerAlign: 'center',
      align:'center',      
      width: 218,
    },
    { 
      field: 'approveDate', 
      headerName: 'ApproveDate',
      valueGetter: p => dateParser(p.row.approveDate),
      headerAlign: 'center',
      align:'center',
      width: 180,
    },
    {
      field: 'idHash',
      headerName: 'IdentityHash',
      valueGetter: p => p.row.idHash,
      width: 218,
      headerAlign:'center',
      align: 'center',
      renderCell: ({value}) => (
        <CopyLongStrSpan title='Hash' src={value} />
      )
    },
    {
      field: 'state',
      headerName: 'State',
      valueGetter: p => p.row.state,
      width: 218,
      headerAlign:'center',
      align: 'center',
      renderCell: ({ value }) => (
        <Chip 
          variant='filled'
          label={statesOfInvestor[value]} 
          sx={{width: 128}}
          color={
            value == 2
              ? 'warning'
              : value == 1
                ? 'success'
                : 'info'
          }
        />)
    }
  ];

  const handleRowClick: GridEventListener<'rowClick'> = (p) => {
    setAcct(p.row.userNo);
  }

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >

      <Stack direction={'row'} sx={{ alignItems:'center' }} >
        <Toolbar sx={{ textDecoration:'underline' }}>
          <h3>Investors List</h3>
        </Toolbar>

      </Stack>
      {/* <SearchPledge setPld={setPledge} setOpen={setOpen} /> */}

      <DataGrid 
        initialState={{pagination:{paginationModel:{pageSize: 5}}}} 
        pageSizeOptions={[5, 10, 15, 20]} 
        getRowId={ row => row.userNo } 
        rows={ list } 
        columns={ columns }
        disableRowSelectionOnClick
        onRowClick={ handleRowClick }
      />    

    </Paper>
  );
}