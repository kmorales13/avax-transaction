import SendTransaction from "./features/send/SendTransaction"
import { WagmiProvider } from "wagmi"
import { config } from "./lib/wagmiConfig"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Header from "./components/Header"

import "./App.styles.css"

const queryClient = new QueryClient()

function App() {
  return (
    <div className="w-screen h-screen bg-gray-950 flex flex-col justify-center items-center overflow-y-auto">
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <Header />

          <div className="mockup-browser border bg-base-300 w-full max-w-md">
            <div className="mockup-browser-toolbar">
              <div className="input text-sm pt-1 max-w-full">
                https://www.avax.network/
              </div>
            </div>
            <div className="flex justify-center p-12 bg-base-200">
              <SendTransaction />
            </div>
          </div>
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  )
}

export default App
