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
  Box
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

export function FilesList({ addr }:ContractProps ) {
  const [filesList, setFilesList] = useState<string[]>();

  useFilesFolderGetFilesList({
    address: addr,
    onSuccess(data) {
      let temp:HexType[] = [];
      data.map(v => temp.push(v));

      setFilesList(temp);
    }
  })

  return (
    <>
      {filesList && filesList.length > 0 && (<DataList isOrdered={true} data={filesList} />)}
    </>
  )
}

interface HeadOfFile {
  signingDeadline: number;
  shaExecDeadline: number;
  proposeDeadline: number;
  votingDeadline: number;
  closingDeadline: number;
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
  
    let sn = await readContract({
      address: folder,
      abi: filesFolderABI,
      functionName: 'getSNOfFile',
      args: [files[i]],
    });

    let head = await readContract({
      address: folder,
      abi: filesFolderABI,
      functionName: 'getHeadOfFile',
      args: [files[i]],
    });

    let ref = await readContract({
      address: folder,
      abi: filesFolderABI,
      functionName: 'getRefOfFile',
      args: [files[i]],
    });

    

    list[len - i] = {
      addr: files[i],
      sn: sn,
      head: head,
      ref: ref,
    }

    i++;

  }

  return list;
}

export function FilesListWithInfo({ addr }:ContractProps ) {
  const [fileInfoList, setFileInfoList] = useState<InfoOfFile[]>();
  const [ loading, setLoading ] = useState<boolean>();


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
        <h3>Files List</h3>
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
                    pathname: '/comp/boh/sha/bodyTerms',
                    query: {
                      addr: v.addr,
                      sn: v.sn,
                      signingDeadline: v.head.signingDeadline,
                      shaExecDeadline: v.head.shaExecDeadline,
                      proposeDeadline: v.head.proposeDeadline,
                      votingDeadline: v.head.votingDeadline,
                      closingDeadline: v.head.closingDeadline,
                      state: v.head.state,
                      url: v.ref.docUrl,
                      hash: v.ref.docHash,
                    }
                  }}
                  as={'/comp/boh/sha'}
                >                
                  {v.sn.substring(6, 26)}
                </Link>
              </TableCell>
              <TableCell align="right">{parseInt(v.sn.substring(26, 36), 16)}</TableCell>
              <TableCell align="right">{dateParser(parseInt(v.sn.substring(36, 48), 16))}</TableCell>
              <TableCell align="right">{v.addr}</TableCell>
              <TableCell align="right">{v.head.state}</TableCell>
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



