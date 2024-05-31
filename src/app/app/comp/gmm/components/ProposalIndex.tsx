import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { HexType } from "../../../common";
import { useEffect, useState } from "react";
import { longSnParser } from "../../../common/toolsKit";
import { getFileDownloadURL } from "../../../../api/getFileDownloadURL";
import { IconButton, Tooltip } from "@mui/material";
import Link from "next/link";
import { CloudDownloadOutlined } from "@mui/icons-material";
import { Motion } from "../meetingMinutes";

export interface ProposalIndexProps {
  motion: Motion,
}

function ProposalIndex({motion}: ProposalIndexProps) {

  const { compInfo } = useComBooxContext();

  const [url, setUrl] = useState<string>('');

  let filePath = '';

  let filename = '';

  filePath += compInfo && compInfo.regNum 
      ? longSnParser(compInfo.regNum.toString()) + '/'
      : '0000/'; 

  filePath += motion.votingRule.authority == 1
      ? 'GMM/'
      : 'BMM/';
    
  switch (motion.head.typeOfMotion) {
    case 1 || 2: 
      filePath += 'Officer/';
      filename = Number(motion.contents).toString().padStart(4,'0') + 
        longSnParser(motion.head.executor.toString());
      break;
    case 3:
      filePath += 'Doc/';
      filename = `0x${motion.contents.toString(16).padStart(64, '0')}` +
        motion.head.seqOfVR.toString().padStart(4, '0') +
        longSnParser(motion.head.executor.toString())
      break;
    case 4:
      filePath += 'Actions/';
      filename = 

      break;
    case 5: 
      filePath += 'TransferFund/';
      break;
    case 6:
      filePath += 'DistributeProfits/';
      break;
    case 7:
      filePath += 'DeprecateGK/';
    default:
      console.log('typeOfMotion Overflow');
  }
  
  filePath += longSnParser(motion.head.creator.toString()) + '/';


  filePath += addrOfFile.substring(2,7).toLowerCase() + addrOfFile.substring(37).toLowerCase();
  filePath += otherInfo ? '-' + otherInfo + '.pdf' : '.pdf';
    
  useEffect(()=>{
    const checkFile = async () => {
      let uri = await getFileDownloadURL(filePath);
      if (uri) setUrl(uri);
    }

    checkFile();
  }, [filePath]);

  return (
    <>
      {url && (
        <Tooltip title='Download File' placement="top" arrow >
          <Link href={ url }>
            <IconButton size="large" sx={{m:1}} color="primary">
              <CloudDownloadOutlined />
            </IconButton>
          </Link>
        </Tooltip>
      )}
    </>
  );

}

export default Bookmark;