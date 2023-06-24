import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { 
  Stack,
} from "@mui/material";

import {
  BigNumber
} from 'ethers';

import { HexType } from "../../../../interfaces";

import { readContract } from "@wagmi/core";

import { 
  SetGovernanceRule, 
  ShaNavi, 
  PositionAllocateRules,
  FirstRefusalRules,
  VotingRules,
  GroupUpdateOrders,
} from '../../../../components';

import { 
  investmentAgreementABI,
  useInvestmentAgreement,
  useInvestmentAgreementGetSeqList,
} from "../../../../generated";
import { AntiDilution } from "../../../../components/comp/boh/terms/antiDilution/AntiDilution";
import { LoadingButton } from "@mui/lab";
import { Send } from "@mui/icons-material";
import { Finalized } from "../../../../components/common/accessControl/Finalized";
import { Head } from "../../../../components/comp/boa/deals/SetDeal";
import { Deals } from "../../../../components/comp/boa/deals/Deals";

// export function dealSnParser(sn: HexType): Head {
//   let head: Head = {
//     typeOfDeal: parseInt(sn.substring(2, 4), 16),
//     seqOfDeal: parseInt(sn.substring(4, 8), 16),
//     preSeq: parseInt(sn.substring(8, 12), 16),
//     classOfShare: parseInt(sn.substring(12, 16), 16),
//     seqOfShare: parseInt(sn.substring(16, 24), 16), 
//     seller: parseInt(sn.substring(24, 34), 16),
//     priceOfPaid: parseInt(sn.substring(34, 42), 16),
//     priceOfPar: parseInt(sn.substring(42, 50), 16),
//     closingDate: parseInt(sn.substring(50, 62), 16),
//   }

//   return head;
// }

async function obtainSeqList(addr:HexType): Promise<number[]> {

  let ls:number[]=[];

  if (addr.length > 2) {

    let list = await readContract({
      address: addr,
      abi: investmentAgreementABI,
      functionName: 'getSeqList',
    });
  
    list.map(v => {
      let seq = v.toNumber();
      console.log('seq: ', seq);
      if (seq != 1) {
        ls.push(seq);
      }
    })
  
    console.log('ls in obtainSeqList: ', ls);
  
  } 

  return ls;
}


function BodyTerms() {
  const { query } = useRouter();

  const ia:HexType = `0x${query.addr?.toString().substring(2)}`;
 
  const snOfDoc:string = query?.snOfDoc?.toString() ?? '';

  const [ isFinalized, setFinalized ] = useState(false);

  const [ seqList, setSeqList ] = useState<number[]>();

  const{ 
    data: seqListData,
    refetch: getSeqList
  } = useInvestmentAgreementGetSeqList ({
    address: ia,
    onSuccess(data) {
      let list = [1];

      console.log('List before: ', list);

      data.map(v => {
        let seq = v.toNumber();
        if (!list.includes(seq))
          list.push(seq);
      });

      setSeqList(list);      
      console.log('List after: ', list);

    }
  })


  // useEffect(()=>{
  //     console.log('ia: ', ia);
  //     obtainSeqList(ia).then(
  //       ls => {
  //         if (ls.length > 0)
  //           setSeqList(ls);
  //         console.log('ls: ', ls);
  //       }
  //     )
  // }, [ia])

  return (
    <Stack direction={'column'} sx={{ width: '100%', alignItems: 'center' }}>

      {ia != '0x' && snOfDoc && (
        <ShaNavi contractName={'Investment Agreement'} addr={ ia } snOfDoc={ snOfDoc } thisPath='./bodyTerms' />
      )}

      {ia != '0x' && (
        <Finalized addr={ ia } setFinalized={ setFinalized } />
      )}

      {!seqList && (
        <LoadingButton 
          loading={true} 
          loadingPosition='end' 
          endIcon={<Send/>} 
          sx={{p:1, m:1}} 
        >
          <span>Loading</span>
        </LoadingButton>
      )}

      {seqList && (
        <Deals ia={ ia } seqList={ seqList } isFinalized={ isFinalized } /> 
      )}

    </Stack>
  );
} 

export default BodyTerms;