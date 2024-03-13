
import React from 'react';
import WagmiProvider from './WagmiProvider';
import { ComBooxContextProvider } from './ComBooxContextProvider';

export type ProviderType = {
  children: React.ReactNode
}

const Providers = ({children}: ProviderType) => {
  return (
    <WagmiProvider>
      <ComBooxContextProvider>
        {children}
      </ComBooxContextProvider>
    </WagmiProvider>
  )
}

export default Providers