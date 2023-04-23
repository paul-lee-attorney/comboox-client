import { useAccount } from 'wagmi'

import { NetworkSwitcher } from '../components'

function Page() {
  const { isConnected } = useAccount()

  return (
    <>
      {isConnected && (
        <>
          <hr />
          <NetworkSwitcher />
        </>
      )}
    </>
  )
}

export default Page
