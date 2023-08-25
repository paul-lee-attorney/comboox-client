
import { 
  Stack,
  Checkbox,
  FormControlLabel,
  Button,
} from '@mui/material';

import { EditNote }  from '@mui/icons-material';

import { 
  useShareholdersAgreementAddRule,
} from '../../../../generated';

import { HexType } from '../../../../interfaces';

interface AddRuleProps {
  sha: HexType,
  rule: HexType,
  refreshRule: () => void,
  editable: boolean,
  setEditable: (flag: boolean) => void,
  isFinalized: boolean,
  getRules: () => void,
}

export function AddRule({ sha, rule, refreshRule, editable, setEditable, isFinalized, getRules }: AddRuleProps) {

  const {
    data,
    isLoading,
    write,
  } = useShareholdersAgreementAddRule({
    address: sha,
    args: [rule],
    onSuccess() {
      refreshRule();
      getRules();
    }
  });

  return (
    <>
      {!isFinalized && (
        <Stack direction='row' sx={{m:1, mr:5, p:1, alignItems:'center', justifyItems:'center'}}>
          
          <Button 
            disabled = { isLoading }

            sx={{ m: 1, minWidth: 120, height: 40 }} 
            variant="contained" 
            endIcon={<EditNote />}
            onClick={()=> write?.()}
            size='small'
          >
            Update
          </Button>

          <FormControlLabel 
            label='Edit'
            sx={{
              ml: 1,
            }}
            control={
              <Checkbox 
                sx={{
                  m: 1,
                  height: 64,
                }}
                onChange={e => setEditable(e.target.checked)}
                checked={ editable }
              />
            }
          />

        </Stack>
      )}
    </>
  )
}
