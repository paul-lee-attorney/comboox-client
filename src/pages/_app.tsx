import type { AppProps } from 'next/app'
import NextHead from 'next/head'
import * as React from 'react'
import { WagmiConfig } from 'wagmi'

import { client } from '../wagmi'

import { Layout } from '../components'

import { ComBooxWrapper } from '../scripts/ComBooxContext'

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
            <Component {...pageProps} />
          </Layout>
        </ComBooxWrapper>
      )}
    </WagmiConfig>
  )
}

export default App
