
import {
  Stack,
  Button,
  Toolbar,
} from '@mui/material';

import Link from '../../../../scripts/Link'
import { HexType } from '../../../../interfaces';

interface ShaNaviProps {
  contractName: string,
  addr: HexType,
  thisPath: string,
}

interface TabPanelProps {
  path: string,
  name: string,
}

export function ShaNavi(props: ShaNaviProps) {
  const { contractName, addr, thisPath } = props;

  const tabs:TabPanelProps[] = [
    {path: './bodyTerms', name: 'Body Terms'},
    {path: './accessControl', name: 'Access Control'},
    {path: './sigPage', name: 'Sig Page'},
    {path: './subSigPage', name: 'Sub Sig Page'},
    {path: './lifecycle', name: 'Lifecycle'}
  ]

  return (
    <>
      <Toolbar  >
        <h3>{contractName} <br /> (address: {addr})</h3>
      </Toolbar>      
      <Stack
        direction={'row'}
      >
        {tabs.map((v, i) => (
          <>
            <Link 
              key={ i }
              href={{
                pathname: v.path,
                query: {
                  addr: addr,
                }
              }}
              
              as={v.path}

              sx={{
                mb: 4,
                mt: 1,
                alignItems: 'center'
              }}
            >
              <Button
                disabled={ thisPath == v.path }
                variant="contained"
                sx={{
                  height: 40,
                  width: 218,
                  borderCollor: 'divider',
                  borderRadius: 0,              
                }}
              >
                {v.name}
              </Button>
                
            </Link>
          </>
        ))}
      </Stack>   
    </>
  )
}