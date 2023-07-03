import { Box, Paper, Toolbar } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { dateParser, longDataParser, longSnParser } from "../../../scripts/toolsKit";
import { titleOfNominator, titleOfPositions } from "../boh/rules/SetPositionAllocateRule";
import { GetVotingRule } from "../boh/rules/GetVotingRule";
import { Position } from "../../../queries/bod";
import { GetPosition } from "./GetPosition";
import { GetFullPosInfoInHand } from "./GetFullPosInfoInHand";

interface GetPosInHandProps {
  list: readonly Position[];
}

export function GetPosInHand({ list }:GetPosInHandProps) {

  const columns: GridColDef[] = [
    {
      field: 'sn',
      headerName: 'Sn',
      valueGetter: p => p.row.seqOfPos,
      width: 60,    
    },
    {
      field: 'title',
      headerName: 'Title',
      valueGetter: p => titleOfPositions[p.row.title - 1],
      width: 218,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'nominator',
      headerName: 'Nominator',
      valueGetter: p => longSnParser(p.row.nominator.toString()),
      width: 218,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'titleOfNominator',
      headerName: 'TitleOfNominator',
      valueGetter: p => titleOfNominator[p.row.titleOfNominator - 1],
      width: 218,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'startDate',
      headerName: 'StartDate',
      valueGetter: p => p.row.startDate > 0
        ? dateParser(p.row.startDate)
        : '-',
      width: 218,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'endDate',
      headerName: 'EndDate',
      valueGetter: p => p.row.endDate > 0
          ? dateParser(p.row.endDate)
          : '-',
      width: 218,
      headerAlign: 'center',
      align: 'center',
    },
  ];
  
  // const handleRowClick: GridEventListener<'rowClick'> = (p) => {
  //   setMotion({head: p.row.head, body: p.row.body, votingRule: p.row.votingRule, contents: p.row.contents});
  //   setOpen(true);
  // }

  return (
    <Paper elevation={3} sx={{ m:1, p:1, color:'divider', border:1 }} >
      <DataGrid 
        initialState={{pagination:{paginationModel:{pageSize: 5}}}} 
        pageSizeOptions={[5, 10, 15, 20]} 
        rows={ list } 
        getRowId={(row:Position) => row.seqOfPos.toString() } 
        columns={ columns }
        disableRowSelectionOnClick
        // onRowClick={ handleRowClick }
      />      
    </Paper>
  );
}