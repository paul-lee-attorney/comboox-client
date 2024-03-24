'use client'

import { Box, Card, CardMedia, Paper, Stack, Typography, } from "@mui/material"

import { TitleBar } from "./components/TitleBar";

import Logo from "/public/assets/ComBoox_FullSlogan.png";
import Image from "next/image";

function FrontPage() {

  return (
    <Stack direction={'column'} sx={{alignItems:'center', width:'100%' }} >
      <TitleBar />

      <Stack direction='column' sx={{mt:10, mb:1}} >
        <Image src={Logo} alt='ComBoox Logo' />

        <Typography variant="h6" component="div" sx={{ flexGrow: 1, m:1, color:'GrayText' }}>
          ---- A Company Book-Entry System On Blockchain
        </Typography>
      </Stack>

      <Box sx={{ mt:2, width:'45%'}}>
        <Paper elevation={3} sx={{m:1, p:1, border:1, borderColor:'divider'}}>

          <Typography variant="h5" component="div" sx={{ flexGrow: 1, m:1 }}>
            <b>System Overview</b>
          </Typography>


          <Typography variant="body1" component="div" sx={{ flexGrow: 1, m:2 }} color='text.secondary'>
            <p><b>ComBoox</b> is a blockchain-based company book-entry platform designed for registering equity shares and corporate statutory books keeping, which is aimed to assist users to quickly establish a legal, secure, transparent and reliable smart contracts system, so as to enable investors, shareholders, executive officers, business partners to conduct legal acts around equity rights in a <b>self-service</b> mode, including share subscription, share transfer, share pledge, paying consideration, signing contracts, proposing, voting, nominating, inauguration and resignation etc.</p>

            <p><b>Different</b> from simple tokenization of equity certificates, ComBoox does <b>NOT</b> rely on legal documents to restrict off-chain behaviors so as to ensure the realization of rights and interests, instead, it uses smart contracts to fully control <b>ALL</b> activities of equity transactions and corporate governance, completely eliminating the possibilities of defaults or violations.</p>
            
            <p>Therefore, ComBoox can fundamentally solve the problems of <b>Insiders Control</b> or <b>Misleading Statements</b> that have plagued the capital markets for many years, and can completely realize:</p>
            
            <ol>
              <li>right holders may <b>directly</b> exercise rights;</li>
              <li>obligors have <b>no chance</b> to default; and</li>
              <li><b>real-time</b> information disclosure. </li>
            </ol>

            <p>By booking equity shares on-chain, investors may use <b>cryptocurrencies</b> to pay equitys consideration, which means effectively connecting the company’s equity shares to the trillion-dollar crypto markets, so that the companies may have an opportunity to have their equity value reevaluated and reconfirmed with the robust support of the huge liquidity.</p>
          </Typography>


        </Paper>
      </Box>

      <Box sx={{ mt:2, width:'45%'}}>
        <Paper elevation={3} sx={{m:1, p:1, border:1, borderColor:'divider'}}>
          {/* <Card>
            <CardMedia component='iframe' >
              <iframe width="100%" height="500" src="https://www.youtube.com/embed/FCEKZAFHKxU?si=yUHugdLv60IGlnsv" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </CardMedia>
          </Card> */}
          <iframe width="100%" height="500" src="https://www.youtube.com/embed/FCEKZAFHKxU?si=yUHugdLv60IGlnsv" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ></iframe>
        </Paper>
      </Box>


    </Stack>
  )
}

export default FrontPage
