
import { 
  Table, 
  TableBody, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TableCell, 
  Paper, 
  Toolbar, 
  Chip
} from '@mui/material';

import Link from '../../../scripts/Link';

import { dateParser } from '../../../scripts/toolsKit';
import { InfoOfFile } from '../../../pages/comp/boh/bookOfSHA';

interface GetFilesListProps {
  list: InfoOfFile[],
  title: string,
  pathName: string,
  pathAs: string,
}

export function GetFilesList({ list, title, pathName, pathAs }:GetFilesListProps ) {

  const labState = ['ZeroPoint', 'Created', 'Circulated', 'Established', 
    'Proposed', 'Approved', 'Rejected', 'Executed', 'Revoked'];

  return (
    <TableContainer component={Paper} sx={{m:1, p:1, border:1, borderColor:'divider'}} >
      <Toolbar>
        <h3>{ title }</h3>
      </Toolbar>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell >Sn</TableCell>
            <TableCell align="center">Creator</TableCell>
            <TableCell align="center">CreateDate</TableCell>
            <TableCell align="center">Address</TableCell>
            <TableCell align="center">State</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>

          {list?.map((v) => (
            <TableRow
              key={v.sn}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Link
                  href={{
                    pathname: pathName,
                    query: {
                      addr: v.addr,
                      snOfDoc: v.sn.substring(6, 26),
                    }
                  }}
                  as={ pathAs }
                >                
                  {v.sn.substring(6, 26)}
                </Link>
              </TableCell>
              <TableCell align="center"><Chip label={v.sn.substring(26, 36)} /></TableCell>
              <TableCell align="center">{dateParser(parseInt(v.sn.substring(36, 48), 16))}</TableCell>
              <TableCell align="center">{v.addr}</TableCell>
              <TableCell align="center"> 
                <Chip 
                  label={ labState[v.head.state] } 
                  variant='filled'
                  color={ 
                    v.head.state == 7 ? 
                      'success' :
                      v.head.state == 8 ?
                        'warning' :
                        'default'
                  } 
                /> 
              </TableCell>
            </TableRow>
          ))}

        </TableBody>
      </Table>
    </TableContainer>
  )
}


