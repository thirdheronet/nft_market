"use client"

import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { WagmiProvider } from 'wagmi'
import { polygon, polygonAmoy } from 'wagmi/chains'
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient()
const projectId = import.meta.env.VITE_PUBLIC_WALLET_CONNECT_PROJECT_ID + "";

const metadata = {
    name: import.meta.env.VITE_DAPP_NAME,
    description: '',
    url: 'https://www.thirdhero.net',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [
    polygon,
    polygonAmoy
] as const;

export const wagmiConfig = defaultWagmiConfig({
    projectId,
    chains,
    metadata,
    enableCoinbase: false,
})

// 3. Create modal
createWeb3Modal({
    wagmiConfig: wagmiConfig,
    projectId,
    enableAnalytics: false,
    allowUnsupportedChain: true,
    tokens: {
        [import.meta.env.VITE_DAPP_CHAIN_ID]: {
            address: import.meta.env.VITE_PUBLIC_PAYMENT_TOKEN_CONTRACT_ADDRESS + "",
            image: 'https://thirdhero.net:9000/upload/public_asset/logo.png' //optional
        }
    },
    themeVariables: {
        '--w3m-accent': '#12254d',
        '--w3m-border-radius-master': '0',
    },
    defaultChain: polygon
})

interface Web3ProviderProps {
    children: ReactNode | ReactNode[];
}

export function Web3Provider({ children }: Web3ProviderProps) {
    return <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    </WagmiProvider>
}