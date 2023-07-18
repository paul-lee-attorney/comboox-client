import { Chip, Paper, Toolbar } from "@mui/material";
import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import { dateParser, longDataParser, longSnParser } from "../../../scripts/toolsKit";
import { Option, typeOfOpts } from "../boc/terms/Options/Options";
import { Dispatch, SetStateAction } from "react";
import { optStates } from "../boc/terms/Options/ContentOfOpt";
import { SearchOption } from "./SearchOption";



interface OptionsListProps {
  list: readonly Option[],
  setOpt: Dispatch<SetStateAction<Option>>,
  setOpen: Dispatch<SetStateAction<boolean>>,
}

export function OptionsList({list, setOpt, setOpen}:OptionsListProps) {

  const columns: GridColDef[] = [
    {
      field: 'seqOfOpt',
      headerName: 'SeqOfOption',
      valueGetter: p => longSnParser(p.row.head.seqOfOpt.toString()),
      headerAlign: 'left',
      align:'left',      
      width: 218,
    },
    {
      field: 'typeOfOpt',
      headerName: 'typeOfOpt',
      valueGetter: p => typeOfOpts[p.row.head.typeOfOpt],
      headerAlign: 'center',
      align:'center',
      width: 100,
    },
    { 
      field: 'classOfShare', 
      headerName: 'ClassOfShare',
      valueGetter: p => p.row.head.classOfShare.toString(),
      headerAlign: 'center',
      align:'center',
      width: 80,
    },
    { 
      field: 'Rightholder', 
      headerName: 'Rightholder',
      valueGetter: p => longSnParser(p.row.body.rightholder.toString()),
      headerAlign: 'center',
      align:'center',
      width: 128,
    },
    { 
      field: 'triggerDate', 
      headerName: 'TriggerDate',
      valueGetter: p => dateParser(p.row.head.triggerDate),
      headerAlign: 'center',
      align:'center',
      width: 180,
    },
    { 
      field: 'execDeadline', 
      headerName: 'ExecDeadline',
      valueGetter: p => dateParser(p.row.head.triggerDate + p.row.head.execDays * 86400),
      headerAlign: 'center',
      align:'center',
      width: 180,
    },
    { 
      field: 'closingDeadline', 
      headerName: 'ClosingDeadline',
      valueGetter: p => dateParser(p.row.body.closingDeadline),
      headerAlign: 'center',
      align:'center',
      width: 180,
    },
    { 
      field: 'paid', 
      headerName: 'Paid',
      valueGetter: p => longDataParser(p.row.body.paid.toString()),
      headerAlign: 'right',
      align:'right',
      width: 330,
    },
    { 
      field: 'state', 
      headerName: 'State',
      valueGetter: p => p.row.body.state,
      renderCell: ({ value }) => (
        <Chip 
          label={ optStates[value] } 
          variant='filled'
          sx={{ width:120 }} 
          color={
            value == 0
            ? 'default'
            : value == 1
              ? 'info'
              : value == 2
                ? 'primary'
                : 'success'
          } 
        />
      ),
      headerAlign: 'center',
      align: 'center',
      width: 180,  
    },
  ];

  const handleRowClick: GridEventListener<'rowClick'> = (p) => {
    setOpt({
      head: p.row.head, 
      cond: p.row.cond,
      body: p.row.body,
      obligors: p.row.obligors, 
    });
    setOpen(true);
  }

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >
      <Toolbar sx={{ textDecoration:'underline' }}>
        <h4>Options List</h4>
      </Toolbar>
      
      <SearchOption setOpt={setOpt} setOpen={setOpen} />

      <DataGrid 
        initialState={{pagination:{paginationModel:{pageSize: 5}}}} 
        pageSizeOptions={[5, 10, 15, 20]} 
        getRowId={row => (longSnParser(row.head.seqOfOpt.toString()))} 
        rows={ list } 
        columns={ columns }
        disableRowSelectionOnClick
        onRowClick={ handleRowClick }
      /> 

    </Paper>
  );
}