// import { useAccount } from "wagmi";
import { 
  Connect, 
  GetMyUserNo, 
  GetMyUserInfo,
  RegUser,
  CreateComp 
} from '../../components'

function RegCenterPage() {
  // const { isConnected } = useAccount()

  return (
    <>
      <h1>Registration Center</h1>
      <hr/>

      <Connect />

        <>
          <hr />
            <GetMyUserNo />
          <hr />

          <hr />
            {/* <GetMyUserInfo /> */}
          <hr />

          <hr />
            <RegUser />
          <hr />
          
          <hr />
            {/* <CreateComp /> */}
          <hr />

        </>
    </>    
  )
}

export default RegCenterPage