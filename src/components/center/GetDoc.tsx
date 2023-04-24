import { useRegCenterGetDoc } from '../../generated';
import { AddrOfRegCenter } from '../../interfaces';
import Link from '../../scripts/Link';


type propsOfSN = {
  sn: string
}

export function GetDoc( { sn } : propsOfSN) {

  const {data, error, isError, isLoading, isSuccess} = useRegCenterGetDoc({
    address: AddrOfRegCenter,
    args: [`0x${sn}`]
  });
  
  return (
    <>
      {isSuccess && (
        <li>
          <Link
            
            href={{
              pathname: `/comp/${data?.head.typeOfDoc.toString()}/[version]`,
              query: {
                typeOfDoc: data?.head.typeOfDoc.toString(),
                version: data?.head.version.toString(),
                seqOfDoc: data?.head.seqOfDoc.toHexString(),
                body: data?.body.substring(2),
                creator: data?.head.creator.toString(16),
                createDate: data?.head.createDate.toString(),
              }
            }}
            
            as={`/comp/${
              data?.head.typeOfDoc.toString()
            }/${
              data?.head.version.toString()
            }/${
              data?.head.seqOfDoc.toNumber().toString(16)
            }`}

            variant='h5'

            underline='hover'
          >
            SN: { '0x' +
                  data?.head.typeOfDoc.toString(16).padStart(4, '0') +
                  data?.head.version.toString(16).padStart(4, '0') +
                  data?.head.seqOfDoc.toNumber().toString(16).padStart(16, '0')
                } <br />
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
