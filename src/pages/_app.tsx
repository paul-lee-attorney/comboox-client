import type { AppProps } from 'next/app'
import NextHead from 'next/head'
import * as React from 'react'
import { WagmiConfig } from 'wagmi'

import { client } from '../wagmi'

import { Layout } from '../components'

import { ComBooxWrapper } from '../scripts/ComBooxContext'

import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  return (
    <WagmiConfig client={client}>
      <NextHead>
        <title>ComBoox</title>
      </NextHead>
       
      {mounted && (
        <ComBooxWrapper>
          <Layout>
            <LocalizationProvider dateAdapter={AdapterDayjs} >
              <Component {...pageProps} />
            </LocalizationProvider>
          </Layout>
        </ComBooxWrapper>
      )}
    </WagmiConfig>
  )
}

export default App
