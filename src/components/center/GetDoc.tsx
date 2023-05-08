import { useRegCenterGetDoc } from '../../generated';
import { AddrOfRegCenter, HexType } from '../../interfaces';
import Link from '../../scripts/Link';

import { useComBooxContext } from '../../scripts/ComBooxContext';

type GetDocType = {
  sn: HexType
}

export function GetDoc( { sn } : GetDocType) {

  const {gk, setGK} = useComBooxContext();

  const {data, error, isError, isLoading, isSuccess} = useRegCenterGetDoc({
    address: AddrOfRegCenter,
    args: [ sn ]
  });
  
  return (
    <>
      {isSuccess && (
        <li>
          <Link
            
            href={{
              pathname: `/comp/mainPage`,
              query: {
                typeOfDoc: data?.head.typeOfDoc.toString(),
                version: data?.head.version.toString(),
                seqOfDoc: data?.head.seqOfDoc.toHexString(),
                body: data?.body.substring(2),
                creator: data?.head.creator.toString(16),
                createDate: data?.head.createDate.toString(),
              }
            }}
           
            onClick={() => {
              if (data?.body) setGK(data?.body);            
            }}

            as={`/comp/mainPage`}

            variant='h5'

            underline='hover'
          >
            SN: { '0x' +
                  data?.head.version.toString(16).padStart(4, '0') +
                  data?.head.seqOfDoc.toHexString().substring(2).padStart(16, '0')
                }
          </Link>
        </li>
      )}

      {isError && (
        <div>
          Error: {error?.message}
        </div>
      )}
      
      {isLoading && (
        <div>
          Loading ...
        </div>
      )}
  
    </>
  )
}
