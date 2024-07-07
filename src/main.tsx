import React from 'react'
import ReactDOM from 'react-dom/client'
import Market from './components/market/Market'
import { Provider } from 'react-redux'
import { Web3Provider } from './context/Web3Provider';
import Wallet from './components/wallet/Wallet';
import Inventory from './components/inventory/Inventory';
import Modal from './components/modal/Modal';
import store from './reducer/store';
import Filter from './components/filter/Filter';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Web3Provider>
        <Modal />

        <header className={"bg-gray-900 text-center flex justify-center border-b-2 border-gray-800 p-1"}>
          <div className={"max-w-screen-lg flex w-full justify-end max-lg:justify-center"}>
            <Wallet />
          </div>
        </header>

        <div className={"max-w-screen-lg m-auto mt-8 flex max-lg:flex-col gap-4 max-lg:m-2"}>
          <nav className={"bg-gray-900 lg:min-w-[200px] rounded-md border-gray-800 border-2"}>
            <div className={"flex flex-col justify-between h-full"}>

              <div className={"bg-gray-950"}>
                <Filter />
              </div>

              <div className={"text-center bg-green-700 p-4 w-full rounded-md"}>
                <Inventory />
              </div>
            </div>
          </nav>

          <main>
            <Market />
          </main>
        </div>
      </Web3Provider>
    </Provider>
  </React.StrictMode>,
)