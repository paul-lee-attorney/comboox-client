import { Stack } from "@mui/material"

import Image from "next/image"
import Logo from '/public/assets/ComBoox_FullSlogan.png';
import { CreateComp } from "./write/CreateComp";
import { GetComp } from "./write/GetComp";

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
      <h2>A Company Book-Entry System On Blockchain</h2>
      <CreateComp />
      <GetComp />
    </Stack>
  )
}

export default FrontPage
