import { 
  Connect,
  DocFinder,
  GetMyUserNo, 
  GetMyUserInfo,
  RegUser,
  CreateComp 
} from '../../components'

function RegCenterPage() {

  return (
    <>
      <h1>Registration Center</h1>
      <hr />

      <CreateComp />
      <hr />

      <DocFinder />
      <hr/>
    </>    
  )
}

export default RegCenterPage