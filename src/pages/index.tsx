
import { Stack } from '@mui/material';
import { CreateComp } from '../components/center/regCenter/CreateComp';
import { GetComp } from '../components/center/regCenter/GetComp';

import Logo from '/assets/Logo_FullSlogan.png';
import Image from 'next/image';

function FrontPage() {

  return (
    <Stack 
      direction={'column'} 
      sx={{
        alignItems:'center', 
        width:'100%',
      }} 
    >
      <br/>
      {/* <h1>ComBoox</h1> */}
      <Image src={Logo} alt='ComBoox Logo' />
      <br/>
      <br/>
      <h3>A Blockchain-Based Company Book-Entry System</h3>            
      <CreateComp />
      <GetComp />
    </Stack>
  )
}

export default FrontPage
