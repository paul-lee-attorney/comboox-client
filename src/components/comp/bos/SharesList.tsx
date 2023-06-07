import { 
  Table, 
  TableBody, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TableCell, 
  Paper, 
  Toolbar, 
  Chip,
  Button,
  TableFooter,
  TablePagination,
  Box,
  IconButton
} from '@mui/material';

import {
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
} from '@mui/icons-material'

import dayjs from 'dayjs';
import { Share } from '../../../pages/comp/bos/bookOfShares';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';


interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPage /> : <FirstPage />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPage /> : <LastPage />}
      </IconButton>
    </Box>
  );
}

interface SharesListProps {
  list: Share[],
  setShare: (share:Share)=>void,
  setOpen: (flag:boolean)=>void,
}

export function SharesList({ list, setShare, setOpen }:SharesListProps ) {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - list.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper} sx={{m:1, p:1, border:1, borderColor:'divider'}} >
      <Toolbar>
        <h3>Shares List</h3>
      </Toolbar>
      <Table size="small" aria-label="a dense table">

        <TableHead>
          <TableRow>
            <TableCell >Sn</TableCell>
            <TableCell align="center">Class</TableCell>
            <TableCell align="center">IssueDate</TableCell>
            <TableCell align="center">Shareholder</TableCell>
            <TableCell align="center">Par</TableCell>
            <TableCell align="center">Paid</TableCell>
            <TableCell align="center">Clean</TableCell>
            <TableCell align="center">State</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>

          {(rowsPerPage > 0
            ? list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : list
            ).map((v) => (
            <TableRow
              key={v.head.seqOfShare}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Button
                  variant='text'
                  onClick={()=>{
                    setShare(v);
                    setOpen(true);
                  }}
                >
                  {v.head.seqOfShare.toString(16).padStart(8, '0')}
                </Button>
              </TableCell>

              <TableCell align="center"><Chip label={v.head.class} /></TableCell>
              <TableCell align="center">{ dayjs.unix(v.head.issueDate).format('YYYY-MM-DD HH:mm:ss') }</TableCell>
              <TableCell align="center">{ v.head.shareholder.toString(16).padStart(10, '0') }</TableCell>
              <TableCell align="center">{ v.body.par.toString() }</TableCell>
              <TableCell align="center">{ v.body.paid.toString() }</TableCell>
              <TableCell align="center">{ v.body.cleanPaid.toString() }</TableCell>
  
              <TableCell align="center"> 
                <Chip 
                  label={ v.body.state == 0 ? 'Normal' : 'Freezed' } 
                  variant='filled'
                  color={ 
                    v.body.state == 0 ? 
                      'success' : 'warning'
                  } 
                /> 
              </TableCell>

            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 49.5 * emptyRows }}>
              <TableCell colSpan={8} />
            </TableRow>
          )}

        </TableBody>

        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={8}
              count={list.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>

      </Table>
    </TableContainer>
  )
}



