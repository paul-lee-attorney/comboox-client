import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function Connect() {
  const { address, connector, isConnected } = useAccount()
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()
  const { disconnect } = useDisconnect()

  return (
    <div>
      <div>
        {isConnected && (
          <>
            <div> connected Acct: {address?.toString()} </div>
            <button onClick={() => disconnect()}>
              Disconnect from {connector?.name}
            </button>
          </>
        )}

        {connectors
          .filter((x) => x.ready && x.id !== connector?.id)
          .map((x) => (
            <button key={x.id} onClick={() => connect({ connector: x })}>
              {x.name}
              {isLoading && x.id === pendingConnector?.id && ' (connecting)'}
            </button>
          ))}
      </div>

      {error && <div>{error.message}</div>}
    </div>
  )
}
