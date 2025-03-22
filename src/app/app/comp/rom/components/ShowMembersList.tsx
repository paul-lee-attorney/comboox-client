import { Dispatch, SetStateAction, } from 'react';
import { Paper, Box, TextField, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { History } from '@mui/icons-material';

import { baseToDollar, bigIntToStrNum, dateParser, 
  longDataParser, longSnParser, splitStrArr 
} from '../../../common/toolsKit';

import { MemberShareClip } from '../rom';


interface MembersEquityListProps{
  list: MemberShareClip[];
  setAcct: Dispatch<SetStateAction<number | undefined>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function ShowMembersList( {list, setAcct, setOpen}:MembersEquityListProps ) {

  const columns: GridColDef[] = [
    {
      field: 'usrNo',
      headerName: 'UserNo',
      valueGetter: (p) => longSnParser(p.row.acct.toString()),
      width: 168,    
    },
    {
      field: 'sharesInHand',
      headerName: 'SharesInHand',
      valueGetter: (p) => (p.row.sharesInHand.map((v:string) => longSnParser(v))),
      width: 168,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({value}) => (
        <TextField 
          variant='outlined'
          fullWidth
          inputProps={{readOnly: true}}
          size="small"
          multiline
          rows={ 1 }
          sx={{
            m:1,
          }}
          value={ splitStrArr(value) }
        />
      )
    },
    {
      field: 'lastUpdate',
      headerName: 'LastUpdate',
      valueGetter: (p) => dateParser(p.row.clip.timestamp.toString()),
      width: 168,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'votingPoints',
      headerName: 'VotingPoints',
      valueGetter: (p) => longDataParser(
        bigIntToStrNum((p.row.clip.points), 4)
      ),
      width: 218,
      headerAlign: 'center',
      align: 'center',
    },    
    {
      field: 'distrPoints',
      headerName: 'DistributionPoints',
      valueGetter: (p) => longDataParser(
        bigIntToStrNum((p.row.distr.points), 4)
      ),
      width: 218,
      headerAlign: 'center',
      align: 'center',
    },    
    {
      field: 'par',
      headerName: 'Par',
      valueGetter: (p) => baseToDollar(p.row.clip.par.toString()),
      width: 218,
      headerAlign: 'right',
      align: 'right',
    },
    {
      field: 'paid',
      headerName: 'Paid',
      valueGetter: (p) => baseToDollar(p.row.clip.paid.toString()),
      width: 218,
      headerAlign: 'right',
      align: 'right',
    },
    {
      field: 'invHistory',
      headerName: 'InvHistory',
      valueGetter: (p) => (parseInt(p.row.acct.toString())),
      width: 218,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({value}) => (
        <Button 
          variant='outlined'
          fullWidth
          size="small"
          sx={{
            m:1, height:40
          }}
          startIcon={
            <History />
          }
          onClick={ ()=>{
            setAcct(value);
            setOpen(true);
          }}
        >
          Inv History
        </Button>
      )
    },
  ]
  
  return (
    <Paper elevation={3} sx={{ m:1, p:1, color:'divider', border:1 }} >
      <Box sx={{width: '100%', color: 'black' }} >
        <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
          <b>Members List</b>
        </Typography>
        
          <DataGrid
            initialState={{pagination:{paginationModel:{pageSize: 5}}}}
            pageSizeOptions={[5, 10, 15, 20]}
            getRowId={row => row.acct.toString()}
            rows={ list }
            columns={ columns }
            disableRowSelectionOnClick
          />

      </Box>
    </Paper>
  )
}



