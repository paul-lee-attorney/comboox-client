import { Box, Chip, Paper, Toolbar } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Motion } from "../../../pages/comp/bog/bookOfGM";
import dayjs from "dayjs";

const type = ['zeroPoint', 'ElectOfficer', 'RemoveOfficer', 'ApproveDoc', 'ApproveAction'];

const state = ['ZeroPoint', 'Created', 'Proposed', 'Passed', 'Rejected', 'Rejected_NotToBuy', 'Rejected_ToBuy', 'Executed'];

const columns: GridColDef[] = [
  {
    field: 'sn',
    headerName: 'Sn',
    valueGetter: (p) => (p.row.head.seqOfMotion),
    width: 120,    
  },
  {
    field: 'typeOfMotion',
    headerName: 'TypeOfMotion',
    valueGetter: (p) => (type[p.row.head.typeOfMotion]),
    width: 120,
    headerAlign: 'center',
    align: 'center',
  },
  {
    field: 'seqOfVR',
    headerName: 'SeqOfVR',
    valueGetter: (p) => (p.row.head.seqOfVR),
    width: 120,
    headerAlign: 'center',
    align: 'center',
  },
  {
    field: 'creator',
    headerName: 'Creator',
    valueGetter: (p) => (p.row.head.creator.toString(16).padStart(10, '0')),
    width: 160,
    headerAlign: 'center',
    align: 'center',
  },
  {
    field: 'createDate',
    headerName: 'CreateDate',
    valueGetter: (p) => (dayjs.unix(p.row.head.createDate).format('YYYY-MM-DD HH:mm:ss')),
    width: 180,
    headerAlign: 'center',
    align: 'center',
  },
  {
    field: 'state',
    headerName: 'State',
    valueGetter: (p) => (state[p.row.body.state]),
    renderCell: ({ value }) => (
      <Chip 
        label={ value }
        variant="filled"
        color={
          value == 'Passed' 
              ? 'success'
              : value == 'Rejected' || value == 'Rejected_NotToBuy' 
              ? 'default'
              : value == 'Created'
              ? 'primary'
              : value == 'Proposed'
              ? 'info'
              : value == 'Rejected_ToBuy'
              ? 'warning'
              : value == 'Executed'
              ? 'error'
              : 'default'
        }
      />
    ),
    width: 120,
    headerAlign: 'center',
    align: 'center',
  },
]

interface GetMotionsListProps {
  list: Motion[],
  title: string,
}

export function GetMotionsList({ list, title }:GetMotionsListProps) {

  return (
    <Paper sx={{ m:1, p:1, color:'divider', border:1 }} >
      <Box sx={{width: '100%', color: 'black' }} >
        <Toolbar>
          <h3>{ title }</h3>
        </Toolbar>
        <DataGrid 
          initialState={{pagination:{paginationModel:{pageSize: 5}}}} 
          pageSizeOptions={[5, 10, 15, 20]} 
          getRowId={row => row.head.seqOfMotion } 
          rows={ list } 
          columns={ columns }
          disableRowSelectionOnClick
        />      
      </Box>
    </Paper>
  );
}