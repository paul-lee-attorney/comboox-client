import { Chip, Paper, Toolbar } from "@mui/material";
import { Pledge } from "../../../queries/bop";
import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import { dateParser, longDataParser, longSnParser } from "../../../scripts/toolsKit";
import { SearchPledge } from "./SearchPledge";



export const statesOfPld = [
  'Pending',
  'Issued',
  'Locked',
  'Released',
  'Executed',
  'Revoked'
]

interface PledgesListProps {
  list: readonly Pledge[],
  setPledge: (pledge:Pledge)=>void,
  setOpen: (flag:boolean)=>void,
}

export function PledgesList({list, setPledge, setOpen}:PledgesListProps) {

  const columns: GridColDef[] = [
    {
      field: 'seqOfShare',
      headerName: 'SeqOfShare',
      valueGetter: p => longSnParser(p.row.head.seqOfShare.toString()),
      headerAlign: 'left',
      align:'left',      
      width: 218,
    },
    {
      field: 'seqOfPld',
      headerName: 'SeqOfPledge',
      valueGetter: p => p.row.head.seqOfPld.toString(),
      headerAlign: 'center',
      align:'center',
      width: 100,
    },
    { 
      field: 'creditor', 
      headerName: 'Creditor',
      valueGetter: p => longSnParser(p.row.head.creditor.toString()),
      headerAlign: 'center',
      align:'center',
      width: 218,
    },
    { 
      field: 'createDate', 
      headerName: 'CreateDate',
      valueGetter: p => dateParser(p.row.head.createDate),
      headerAlign: 'center',
      align:'center',
      width: 180,
    },
    { 
      field: 'triggerDate', 
      headerName: 'TriggerDate',
      valueGetter: p => dateParser(p.row.head.createDate + p.row.head.daysToMaturity * 86400),
      headerAlign: 'center',
      align:'center',
      width: 180,
    },
    { 
      field: 'expireDate', 
      headerName: 'ExpireDate',
      valueGetter: p => dateParser(p.row.head.createDate + (p.row.head.daysToMaturity + p.row.head.guaranteeDays) * 86400),
      headerAlign: 'center',
      align:'center',
      width: 180,
    },
    { 
      field: 'pledgedPaid', 
      headerName: 'PledgedPaid',
      valueGetter: p => longDataParser(p.row.body.paid.toString()),
      headerAlign: 'right',
      align:'right',
      width: 330,
    },
    { 
      field: 'state', 
      headerName: 'State',
      valueGetter: p => p.row.head.state,
      renderCell: ({ value }) => (
        <Chip 
          label={ statesOfPld[ value ] } 
          variant='filled'
          sx={{ width:120 }} 
          color={
            value == 0
            ? 'default'
            : value == 1
              ? 'primary'
              : value == 2
                ? 'warning'
                : value == 3
                  ? 'success'
                  : value == 4
                    ? 'info'
                    : value == 5
                      ? 'error'
                      : 'default'
          } 
        />
      ),
      headerAlign: 'center',
      align: 'center',
      width: 180,  
    },
  ];

  const handleRowClick: GridEventListener<'rowClick'> = (p) => {
    setPledge({head: p.row.head, body: p.row.body, hashLock: p.row.hashLock});
    setOpen(true);
  }

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >
      <Toolbar sx={{ textDecoration:'underline' }}>
        <h4>Pledges List</h4>
      </Toolbar>
      
      <SearchPledge setPld={setPledge} setOpen={setOpen} />

      <DataGrid 
        initialState={{pagination:{paginationModel:{pageSize: 5}}}} 
        pageSizeOptions={[5, 10, 15, 20]} 
        getRowId={row => (longSnParser(row.head.seqOfShare.toString()) + '-' + row.head.seqOfPld.toString())} 
        rows={ list } 
        columns={ columns }
        disableRowSelectionOnClick
        onRowClick={ handleRowClick }
      />    

    </Paper>
  );
}