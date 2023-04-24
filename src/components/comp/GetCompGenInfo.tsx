import { useContractReads } from 'wagmi'

import {
  generalKeeperABI,
  bookOfIaABI,
  bookOfDirectorsABI,
  bookOfSharesABI,
  registerOfMembersABI,
} from '../../generated';

type GetCompGenInfoProps = {
  gk: string,
  books: string[]
}

export function GetCompGenInfo( { gk, books } : GetCompGenInfoProps ) {
  
  const {data, isError, isLoading, refetch} = useContractReads({
    contracts: [
      {
        abi: generalKeeperABI,
        address: `0x${gk}`,
        functionName: 'regNumHash',
      },
      {
        abi: generalKeeperABI,
        address: `0x${gk}`,
        functionName: 'nameOfCompany',
      },
      {
        abi: generalKeeperABI,
        address: `0x${gk}`,
        functionName: 'symbolOfCompany',
      },
      {
        abi: bookOfIaABI,
        address: `0x${books[0]}`,
        functionName: 'qtyOfFiles',
      },
      // {
      //   abi: bookOfIaABI,
      //   address: `0x${books[0]}`,
      //   functionName: 'getFilesList',
      // },
      // {
      //   address: `0x${books[1]}`,
      //   abi: bookOfDirectorsABI,
      //   functionName: 'getPosList',
      // },
      // {
      //   address: `0x${books[1]}`,
      //   abi: bookOfDirectorsABI,
      //   functionName: 'getFullPosInfo',
      // },
      // {
      //   address: `0x${books[1]}`,
      //   abi: bookOfDirectorsABI,
      //   functionName: 'getOffList',
      // },
      // {
      //   address: `0x${books[1]}`,
      //   abi: bookOfDirectorsABI,
      //   functionName: 'getNumOfOfficers',
      // },
      // {
      //   address: `0x${books[1]}`,
      //   abi: bookOfDirectorsABI,
      //   functionName: 'getNumOfDirectors',
      // },
      // {
      //   address: `0x${books[1]}`,
      //   abi: bookOfDirectorsABI,
      //   functionName: 'getDirectorsList',
      // },
      // {
      //   address: `0x${books[6]}`,
      //   abi: bookOfSharesABI,
      //   functionName: 'counterOfShares',
      // },
      // {
      //   address: `0x${books[6]}`,
      //   abi: bookOfSharesABI,
      //   functionName: 'counterOfClasses',
      // },
      // {
      //   address: `0x${books[7]}`,
      //   abi: registerOfMembersABI,
      //   functionName: 'basedOnPar',
      // },
      // {
      //   address: `0x${books[7]}`,
      //   abi: registerOfMembersABI,
      //   functionName: 'maxQtyOfMembers',
      // },
      // {
      //   address: `0x${books[7]}`,
      //   abi: registerOfMembersABI,
      //   functionName: 'ownersEquity',
      // },
      // {
      //   address: `0x${books[7]}`,
      //   abi: registerOfMembersABI,
      //   functionName: 'totalVotes',
      // },
      // {
      //   address: `0x${books[7]}`,
      //   abi: registerOfMembersABI,
      //   functionName: 'sharesList',
      // },
      // {
      //   address: `0x${books[7]}`,
      //   abi: registerOfMembersABI,
      //   functionName: 'getNumOfMembers',
      // },
      // {
      //   address: `0x${books[7]}`,
      //   abi: registerOfMembersABI,
      //   functionName: 'membersList',
      // },
      // {
      //   address: `0x${books[7]}`,
      //   abi: registerOfMembersABI,
      //   functionName: 'qtyOfGroups',
      // },
      // {
      //   address: `0x${books[7]}`,
      //   abi: registerOfMembersABI,
      //   functionName: 'controllor',
      // },
      // {
      //   address: `0x${books[7]}`,
      //   abi: registerOfMembersABI,
      //   functionName: 'votesOfController',
      // },
    ],
  });

  return (
    <>
      {data && (
        <div>
          <div>
            RegNumHash: { data[0]?.toString() }
          </div>

          <div>
            NameOfCompany: { data[1]?.toString() }
          </div>

          <div>
            SymbolOfCompany: { data[2]?.toString() }
          </div>

          <div>
            QtyOfFiles: { data[3]?.toString() }
          </div>

        </div>
      )}

    </>
  )
}

