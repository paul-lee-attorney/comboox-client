import { 
  DocFinder,
  CreateComp 
} from '../../components'

import Link from '../../scripts/Link'

function RegCenterPage() {

  return (
    <>
      <h1>Registration Center</h1>
      <hr />

      <Link
        href='/comp/initSys/createComp'
        as='/comp/initSys/createComp'
        variant='h5'
        underline='hover'
      >
        Register My Company
      </Link>
      <hr />

      <DocFinder />
      <hr/>
    </>    
  )
}

export default RegCenterPage