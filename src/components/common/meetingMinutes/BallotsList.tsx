import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Chip } from "@mui/material";
import { LinearProgress, Typography } from "@mui/joy";

import { BigNumber } from "ethers";
import { dateParser, longDataParser, longSnParser, toPercent } from "../../../scripts/toolsKit";
import { Bytes32Zero, HexType } from "../../../interfaces";
import { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Ballot, VoteCase, getBallotsList } from "../../../queries/meetingMinutes";

const columns: GridColDef[] = [
  { 
    field: 'acct', 
    headerName: 'UserNo.',
    valueGetter: p => longSnParser(p.row.acct.toString()),
    width: 180,
  },
  { 
    field: 'head', 
    headerName: 'Head',
    valueGetter: p => p.row.head,
    renderCell: ({ value }) => (<Chip label={value} />),
    headerAlign:'center',
    align: 'center',
    width: 120,
  },
  { 
    field: 'weight', 
    headerName: 'Weight',
    valueGetter: p =>  longDataParser(p.row.weight.toString()),
    headerAlign: 'right',
    align:'right',
    width: 180,
  },
  { 
    field: 'sigDate', 
    headerName: 'SigDate',
    valueGetter: p => dateParser(p.row.sigDate),
    headerAlign: 'center',
    align: 'center',
    width: 180,
  },
  { 
    field: 'blocknumber', 
    headerName: 'BlockNumber',
    valueGetter: p => longDataParser(p.row.blocknumber.toString()),
    headerAlign: 'right',
    align:'right',
    width: 180,
  },
  { 
    field: 'sigHash', 
    headerName: 'SigHash',
    valueGetter: p => p.row.sigHash == Bytes32Zero ? '---' : p.row.sigHash ,
    headerAlign: 'center',
    align:'center',
    width: 580,
  },
];


interface BallotsListProps {
  addr: HexType;
  seqOfMotion: BigNumber;
  allVote: VoteCase;
  attitude: number;
  voteCase: VoteCase;
}

interface Attitude  {
  id: number;
  name: string;
  colorMaterial: string;
  colorJoy: string;
}

const attitudes:Attitude[] = [
  {id: 1, name: 'Support', colorMaterial: 'primary', colorJoy: 'primary'},
  {id: 2, name: 'Against', colorMaterial: 'error', colorJoy: 'danger'},
  {id: 3, name: 'Abstain', colorMaterial: 'success', colorJoy: 'success'}
]

export function BallotsList({ addr, seqOfMotion, allVote, attitude, voteCase }: BallotsListProps) {

  const [ list, setList ] = useState<Ballot[]>();
  const [ open, setOpen ] = useState(false);

  const handleClick = async () => {
    let ls = await getBallotsList(addr, seqOfMotion, voteCase.voters);
    if (ls) {
      setList(ls);
      setOpen(true);
    }
    
  }

  return (
    <>
      <LinearProgress
        determinate
        variant="outlined"
        color={ attitudes[attitude-1].colorJoy }
        size="sm"
        thickness={38}
        value={ !allVote.sumOfWeight.eq(0) 
          ? voteCase.sumOfWeight.mul(100).div(allVote.sumOfWeight).toNumber()
          : 0 }
        sx={{
          '--LinearProgress-radius': '0px',
          '--LinearProgress-progressThickness': '32px',
          boxShadow: 'sm',
          borderColor: 'neutral.500',
          width:'100%',
          mx:1, px:1,
        }}
      >
        <Button
          fullWidth
          onClick={ handleClick }
        >

          <Typography
            level="body3"
            fontWeight="xl"
            textColor="common.white"
            sx={{ mixBlendMode: 'difference' }}
          >
            {attitudes[attitude-1].name} Ratio: 
            ({voteCase.sumOfHead}/{allVote.sumOfHead}) 
            {` ${ !allVote.sumOfWeight.eq(0)
                ? Math.round(voteCase.sumOfWeight.mul(100).div(allVote.sumOfWeight).toNumber())
                : 0 
            }%`} 
          </Typography>            

        </Button>

      </LinearProgress>

      <Dialog
        maxWidth="xl"
        fullWidth
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="dialog-title"
        sx={{m:1, p:1}}
      >
        <DialogTitle id="dialog-title">
          {"Vote Case of Attitude"} - 
          { <Chip 
              variant="filled" 
              color={attitudes[attitude-1].colorMaterial} 
              label={
                attitudes[attitude-1].name + 
                ' (' + voteCase.sumOfHead.toString() + '/' + allVote.sumOfHead.toString() + ') ' + 
                `${ allVote.sumOfWeight.gt(0)
                  ? Math.round(voteCase.sumOfWeight.mul(100).div(allVote.sumOfWeight).toNumber())
                  : ''
                }%`              
              }
              sx={{mx:1}}
            /> 
          }
        </DialogTitle>

        <DialogContent>

          <Box sx={{minWidth: '1280' }}>
            {list && (
              <DataGrid 
                initialState={{pagination:{paginationModel:{pageSize: 5}}}} 
                pageSizeOptions={[5, 10, 15, 20]} 
                getRowId={row => row.acct} 
                rows={ list } 
                columns={ columns }
                disableRowSelectionOnClick
              />      
            )}
          </Box>

        </DialogContent>

        <DialogActions>
          <Button onClick={()=>setOpen(false)}>Close</Button>
        </DialogActions>

      </Dialog>

    </>
  )

}