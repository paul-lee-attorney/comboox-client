import { createConfig, configureChains, WagmiConfig } from 'wagmi';

import { mainnet, hardhat, sepolia, arbitrum } from 'wagmi/chains';

import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectLegacyConnector } from 'wagmi/connectors/walletConnectLegacy';

import { alchemyProvider } from '@wagmi/core/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';


type WagmiProviderType = {
  children: React.ReactNode
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [ arbitrum, sepolia, hardhat ],
  [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? '',
      // stallTimeout: 2_000,
    }),
    publicProvider(),
  ],
);

const config = createConfig({
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
});

const WagmiProvider = ({ children }: WagmiProviderType) => {
  return (
    <>
      <WagmiConfig config={config}>{children}</WagmiConfig>
    </>
  );
};

export default WagmiProvider;

