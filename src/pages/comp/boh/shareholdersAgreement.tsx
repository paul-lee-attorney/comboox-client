import { Paper, Toolbar } from "@mui/material";

import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { 
  RegisteredCapital,
  PaidInCapital,
  RegNumHash,
  CompName,
  Controllor,
  VotesOfController,
  MembersEquityList,
  CompSymbolTf,
  CompAddrTf,
  RulesList,
} from "../../../components";

import { ContractProps } from "../../../interfaces";

function ShareholdersAgreement({ addr }: ContractProps) {
  const { gk, boox } = useComBooxContext();

  

  return (
    <>
      <Paper sx={{alignContent:'center', justifyContent:'center', p:1, m:1 }} >
        <Toolbar>
          <h3>Shareholders Agreement</h3>
        </Toolbar>

        <table width={1500} >
          <thead>
            <tr>        
              <td colSpan={2}>
              </td>
              <td colSpan={2} >
              </td>
            </tr>
          </thead>
          
          <tbody>

            <tr>        
              <td colSpan={2}>
              </td>
              <td colSpan={2} >
              </td>
            </tr>

            <tr>
              <td>
              </td>
              <td>
              </td>
              <td>
              </td>
              <td>
              </td>
            </tr>

            <tr>
              <td colSpan={4}>
                <RulesList addr={ addr } />
              </td>
            </tr>
          </tbody>
        </table>
      </Paper>
    </>
  );
} 

export default ShareholdersAgreement;