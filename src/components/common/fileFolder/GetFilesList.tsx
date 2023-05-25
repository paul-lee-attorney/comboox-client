import { useEffect, useState } from 'react';

import { 
  Table, 
  TableBody, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TableCell, 
  Paper, 
  Toolbar, 
  Box,
  Chip
} from '@mui/material';

import{ Send } from '@mui/icons-material';

import { LoadingButton } from '@mui/lab'

import Link from '../../../scripts/Link';

import { readContract } from '@wagmi/core';

import { DataList } from '../..';

import {
  filesFolderABI,
  useFilesFolderGetFilesList,
} from '../../../generated';

import { Bytes32Zero, ContractProps, HexType } from '../../../interfaces';

import { dateParser } from '../../../scripts/toolsKit';
import { BigNumber } from 'ethers';

interface HeadOfFile {
  circulateDate: number;
  signingDays: number;
  closingDays: number;
  seqOfVR: number;
  shaExecDays: number;
  reviewDays: number;
  proposeDate: number;
  reconsiderDays: number;
  votePrepareDays: number;
  votingDays: number;
  execDaysForPutOpt: number;
  seqOfMotion: BigNumber;
  state: number;
}

interface RefOfFile {
  docUrl: HexType;
  docHash: HexType;
}

interface InfoOfFile {
  addr: HexType;
  sn: HexType;
  head: HeadOfFile;
  ref: RefOfFile;
}

async function getFilesListWithInfo(folder: HexType, files: readonly HexType[]): Promise<InfoOfFile[]> {

  let list: InfoOfFile[] = [];
  let len: number = files.length;
  let i = len > 20 ? len-20 : 0;

  while(i < len) {
  
    let file = await readContract({
      address: folder,
      abi: filesFolderABI,
      functionName: 'getFile',
      args: [files[i]],
    });

    list[len - i] = file;

    i++;

  }

  return list;
}

interface GetFilesListProps {
  addr: HexType,
  title: string,
  pathName: string,
  pathAs: string,
}



export function GetFilesList({ addr, title, pathName, pathAs }:GetFilesListProps ) {
  const [fileInfoList, setFileInfoList] = useState<InfoOfFile[]>();
  const [ loading, setLoading ] = useState<boolean>();

  const labState = ['ZeroPoint', 'Created', 'Circulated', 'Established', 
    'Proposed', 'Approved', 'Rejected', 'Executed', 'Revoked'];

  useFilesFolderGetFilesList({
    address: addr,
    onSuccess(data) {
      if (data.length > 0) {
        setLoading(true);
        getFilesListWithInfo(addr, data).then(list => {
          setLoading(false);
          setFileInfoList(list);
        });
      }
    }
  })

  return (
    <TableContainer component={Paper} sx={{m:1, p:1, border:1, borderColor:'divider'}} >
      <Toolbar>
        <h3>{ title }</h3>
      </Toolbar>
      <Table sx={{ minWidth: 1680 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell >Sn</TableCell>
            <TableCell align="right">Creator</TableCell>
            <TableCell align="right">CreateDate</TableCell>
            <TableCell align="right">Address</TableCell>
            <TableCell align="right">State</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fileInfoList?.map((v) => (
            <TableRow
              key={v.sn}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Link
                  href={{
                    pathname: pathName,
                    query: {
                      addr: v.addr
                    }
                  }}
                  as={ pathAs }
                >                
                  {v.sn.substring(6, 26)}
                </Link>
              </TableCell>
              <TableCell align="right"><Chip label={v.sn.substring(26, 36)} /></TableCell>
              <TableCell align="right">{dateParser(parseInt(v.sn.substring(36, 48), 16))}</TableCell>
              <TableCell align="right">{v.addr}</TableCell>
              <TableCell align="right"> 
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
          {loading && (
            <LoadingButton 
              loading={ loading } 
              loadingPosition='end' 
              endIcon={<Send/>} 
              sx={{p:1, m:1}} 
            >
              <span>Loading</span>
            </LoadingButton>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}



