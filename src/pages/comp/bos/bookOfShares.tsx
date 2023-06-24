import { useState } from "react";

import { 
  Button, 
  Paper, 
  Toolbar,
  TextField,
  Stack,
} from "@mui/material";

import { useComBooxContext } from "../../../scripts/ComBooxContext";

import { Search, Send } from "@mui/icons-material";
import { HexType } from "../../../interfaces";

import { readContract } from "@wagmi/core";

import { 
  bookOfSharesABI,
  useBookOfSharesGetShare,
  useRegisterOfMembersSharesList,
} from "../../../generated";
import { BigNumber } from "ethers";
import { LoadingButton } from "@mui/lab";
import { SharesList } from "../../../components/comp/bos/SharesList";
import { CertificateOfContribution } from "../../../components/comp/bos/CertificateOfContribution";

export interface Head {
  seqOfShare: number; // 股票序列号
  preSeq: number; // 前序股票序列号（股转时原标的股序列号）
  class: number; // 股票类别/轮次编号
  issueDate: number; // 股票签发日期（秒时间戳）
  shareholder: number; // 股东代码
  priceOfPaid: number; // 发行价格（实缴出资价）
  priceOfPar: number; // 发行价格（认缴出资价）
}

export interface Body {
  payInDeadline: number; // 出资期限（秒时间戳）
  paid: BigNumber; // 实缴出资
  par: BigNumber; // 认缴出资（注册资本面值）
  cleanPaid: BigNumber; // 清洁实缴出资（扣除出质、远期、销售要约金额）
  state: number;
}

export interface Share {
  sn: HexType;
  head: Head;
  body: Body;
}

export function codifyHeadOfShare(head: Head): HexType {
  let sn: HexType = `0x${
    head.seqOfShare.toString(16).padStart(8, '0') +
    head.preSeq.toString(16).padStart(8, '0') +
    head.class.toString(16).padStart(4, '0') +
    head.issueDate.toString(16).padStart(12, '0') +
    head.shareholder.toString(16).padStart(10, '0') +
    head.priceOfPaid.toString(16).padStart(8, '0') +
    head.priceOfPar.toString(16).padStart(8, '0') +
    '0'.padStart(6, '0')
  }`;
  return sn;
}

export function parseSnOfShare(sn: HexType): Head {
  let head: Head = {
    seqOfShare: parseInt(sn.substring(2, 10), 16),
    preSeq: parseInt(sn.substring(10, 18), 16),
    class: parseInt(sn.substring(18, 22), 16),
    issueDate: parseInt(sn.substring(22, 34), 16),
    shareholder: parseInt(sn.substring(34, 44), 16),
    priceOfPaid: parseInt(sn.substring(44, 52), 16),
    priceOfPar: parseInt(sn.substring(52, 60), 16),
  };

  return head
}

export async function getShare(bos: HexType, seq: number): Promise<Share> {

  let share = await readContract({
    address: bos,
    abi: bookOfSharesABI,
    functionName: 'getShare',
    args: [BigNumber.from(seq)],
  });

  let shareWrap:Share = {
    sn: codifyHeadOfShare(share.head),
    head: share.head,
    body: share.body,
  } 

  return shareWrap;
}

export async function getSharesList(bos: HexType, snList: readonly HexType[]): Promise<Share[]> {

  let list: Share[] = [];
  let len: number = snList.length;
  let i = 0;

  while(i < len) {

    let seq: number = parseSnOfShare(snList[i]).seqOfShare;

    list[i] = await getShare(bos, seq);
    i++;
  }

  return list;
}

function BookOfShares() {
  const { boox } = useComBooxContext();

  const [ loading, setLoading ] = useState<boolean>();

  const [ sharesList, setSharesList ] = useState<Share[]>();

  const {
    refetch: obtainSharesList,
  } = useRegisterOfMembersSharesList ({
    address: boox[8],
    onSuccess(data) {
      if (data.length > 0) {
        setLoading(true);
        getSharesList(boox[7], data).then(list => {
          setLoading(false);
          setSharesList(list);
        });
      }
    }
  })

  const [ seqOfShare, setSeqOfShare ] = useState<string>();
  const [ bnSeqOfShare, setBnSeqOfShare ] = useState<BigNumber>();

  const [ open, setOpen ] = useState<boolean>(false);
  const [ share, setShare ] = useState<Share>();

  const { 
    refetch: getShareFunc, 
  } = useBookOfSharesGetShare({
    address: boox[7],
    args: bnSeqOfShare ? [bnSeqOfShare] : undefined,
    onSuccess(data) {
      let share:Share = {
        sn: codifyHeadOfShare(data.head),
        head: data.head,
        body: data.body,        
      }
      setShare(share);
      setOpen(true);
    }
  });

  const searchShare = () => {
    if (seqOfShare) {
      setBnSeqOfShare(BigNumber.from(seqOfShare));
      getShareFunc();
    }
  }

  return (
    <>
      <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >
        <Toolbar>
          <h3>BOS - Book Of Shares</h3>
        </Toolbar>

        <table width={1680} >
          <thead />
          
          <tbody>

            <tr>        
              <td colSpan={2}>
                <Stack 
                    direction={'row'}
                  >
                    <TextField 
                      sx={{ m: 1, minWidth: 120 }} 
                      id="tfSeqOfShare" 
                      label="seqOfShare" 
                      variant="outlined"
                      helperText="Number <= 2^32 (e.g. '123')"
                      onChange={(e) => 
                        setSeqOfShare(e.target.value)
                      }
                      value = { seqOfShare }
                      size='small'
                    />

                    <Button 
                      disabled={ !seqOfShare }
                      sx={{ m: 1, minWidth: 120, height: 40 }} 
                      variant="contained" 
                      endIcon={ <Search /> }
                      onClick={ searchShare }
                      size='small'
                    >
                      Search
                    </Button>

                    {loading && (
                      <LoadingButton 
                        loading={ loading } 
                        loadingPosition='end' 
                        endIcon={<Send/>} 
                        sx={{p:1, m:1, ml:5}} 
                      >
                        <span>Loading</span>
                      </LoadingButton>
                    )}

                </Stack>
              </td>
              <td colSpan={2} >
              </td>
            </tr>

            <tr>
              <td colSpan={4}>

                {sharesList && (
                  <SharesList 
                    list={ sharesList }  
                    setShare={ setShare }
                    setOpen={ setOpen }
                  />
                )}

              </td>
            </tr>
          </tbody>

        </table>
        
        {share && (
          <CertificateOfContribution open={open} share={share} setOpen={setOpen} obtainSharesList={obtainSharesList} />
        )}

      </Paper>
    </>
  );
} 

export default BookOfShares;