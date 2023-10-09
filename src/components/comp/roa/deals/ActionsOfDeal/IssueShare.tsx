import { Button, Paper, Stack } from "@mui/material";
import { useComBooxContext } from "../../../../../scripts/common/ComBooxContext";
import { defaultDeal } from "../../../../../scripts/comp/ia";
import { useGeneralKeeperIssueNewShare } from "../../../../../generated";
import { ActionsOfDealProps } from "../ActionsOfDeal";
import { RocketLaunch } from "@mui/icons-material";


export function IssueShare({ addr, deal, setOpen, setDeal, setTime}: ActionsOfDealProps ) {
  const {gk} = useComBooxContext();

  const {
    isLoading: issueNewShareLoading,
    write: issueNewShare
  } = useGeneralKeeperIssueNewShare({
    address: gk,
    args: [addr, BigInt(deal.head.seqOfDeal)],
    onSuccess() {
      setDeal(defaultDeal);
      setTime(Date.now());
      setOpen(false);    
    }
  });

  return (

    <Paper elevation={3} sx={{
      m:1, p:1, 
      border: 1, 
      borderColor:'divider' 
      }} 
    >
        {/* <Toolbar>
          <h4>Issue Share</h4>
        </Toolbar> */}

        <Stack direction={'row'} sx={{ alignItems:'center'}} >

        <Button 
          disabled = { issueNewShareLoading }

          sx={{ m: 1, minWidth: 218, height: 40 }} 
          variant="contained" 
          endIcon={<RocketLaunch />}
          onClick={()=> issueNewShare?.()}
          size='small'
        >
          Issue
        </Button>

        </Stack>

    </Paper>

  );  


}