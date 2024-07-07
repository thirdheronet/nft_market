/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_DAPP_NAME: string
    readonly VITE_DAPP_VERSION: string
    readonly VITE_DAPP_CHAIN_ID: string
    readonly VITE_TOKEN_SHORTCUT: string
    readonly VITE_PUBLIC_ITEMS_CONTRACT_ADDRESS: string
    readonly VITE_PUBLIC_PAYMENT_TOKEN_CONTRACT_ADDRESS: string
    readonly VITE_PUBLIC_WALLET_CONNECT_PROJECT_ID: string
    readonly VITE_PUBLIC_PINATA_HTTP_GATEWAY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}