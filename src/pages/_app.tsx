import type { AppProps } from 'next/app'
import NextHead from 'next/head'
import * as React from 'react'
import { WagmiConfig } from 'wagmi'

import { client } from '../wagmi'

import { Connect } from '../components'

// import '@fontsource/roboto/300.css';
// import '@fontsource/roboto/400.css';
// import '@fontsource/roboto/500.css';
// import '@fontsource/roboto/700.css';



function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  return (
    <WagmiConfig client={client}>
      <NextHead>
        <title>ComBoox</title>
      </NextHead>

      <h1>ComBoox-A Blockchain-Based Company Statutory Books Keeping System</h1>
      <hr/>


      {mounted && (
        <>
          <Connect />
          <hr />

          <Component {...pageProps} />
        </>
      )}
    </WagmiConfig>
  )
}

export default App
