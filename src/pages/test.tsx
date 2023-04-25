import { useAccount } from 'wagmi'

import { BasedOnPar } from '../components/comp/rom/BasedOnPar'

function TestPage() {
  const { isConnected } = useAccount()

  return (
    <>
      {isConnected && (
        <BasedOnPar />        
      )}
    </>
  )
}

export default TestPage
