import { createConfig, configureChains } from 'wagmi'

import { mainnet, hardhat, sepolia } from 'wagmi/chains'

import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectLegacyConnector } from 'wagmi/connectors/walletConnectLegacy'

import { alchemyProvider } from '@wagmi/core/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [ mainnet,
    ...(process.env.NODE_ENV === 'development' 
      ? [sepolia] 
      : []), 
  ],
  [
    alchemyProvider({
      apiKey: process.env.NODE_ENV === 'development'
        ? 'vyxCJHabQX9OYFc6uVOLCY_aL4FJfgkc'
        : 'dmKNIrJbJnIPmnn1V7WD1x5MZfWKU0QY',
      // stallTimeout: 2_000,
    }),
    publicProvider(),
  ],
)

export const config = createConfig({
  autoConnect: false,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'comboox',
      },
    }),
    new WalletConnectLegacyConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
})
