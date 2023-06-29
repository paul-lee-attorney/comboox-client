
import { Stack } from '@mui/material';
import { CreateComp } from '../components/center/CreateComp';
import { GetComp } from '../components/center/GetComp';

function FrontPage() {

  return (
    <Stack 
      direction={'column'} 
      sx={{
        m:1, p:1, 
        alignItems:'center', 
        width:'100%',
      }} 
    >
      <h1>ComBoox</h1>
      <h3>A Blockchain-Based Company Statutory Books Keeping System</h3>            
      <CreateComp />
      <GetComp />
    </Stack>
  )
}

export default FrontPage
