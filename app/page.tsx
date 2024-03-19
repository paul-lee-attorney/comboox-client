import { Stack } from "@mui/material"

import Image from "next/image"
import Logo from '/public/assets/ComBoox_FullSlogan.png';

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
      <Image src={ Logo } alt='ComBoox Logo' />
      <br/>
      <br/>
      <h1>ComBoox</h1>
      <br/>
      <br/>      
      <h2>A Company Book-Entry System On Blockchain</h2>

    </Stack>
  )
}

export default FrontPage
