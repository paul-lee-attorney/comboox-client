
import { Stack } from '@mui/material';
import { CreateComp } from '../components/center/regCenter/CreateComp';
import { GetComp } from '../components/center/regCenter/GetComp';

function FrontPage() {

  return (
    <Stack 
      direction={'column'} 
      sx={{
        alignItems:'center', 
        width:'100%',
      }} 
    >
      <h1>ComBoox</h1>
      <h3>A Blockchain-Based Company Book-Entry System</h3>            
      <CreateComp />
      <GetComp />
    </Stack>
  )
}

export default FrontPage
