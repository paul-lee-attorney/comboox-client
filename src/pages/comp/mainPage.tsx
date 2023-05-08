import { Paper, Toolbar } from "@mui/material";

import { useComBooxContext } from "../../scripts/ComBooxContext";
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
} from "../../components";


function MainPage() {
  const { gk, boox } = useComBooxContext();

  return (
    <>
      <Paper sx={{alignContent:'center', justifyContent:'center', p:1, m:1 }} >
        <Toolbar>
          <h3>General Info</h3>
        </Toolbar>

        <table width={1500} >
          <thead>
            <tr>        
              <td colSpan={2}>
                <CompSymbolTf addr={ boox[0] } />
              </td>
              <td colSpan={2} >
                <CompAddrTf addr={ boox[0] } />
              </td>
            </tr>
          </thead>
          
          <tbody>

            <tr>        
              <td colSpan={2}>
                <CompName addr={ boox[0] } />
              </td>
              <td colSpan={2} >
                <RegNumHash addr={ boox[0] } />
              </td>
            </tr>

            <tr>
              <td>
                <Controllor addr={ boox[8] } />
              </td>
              <td>
                <VotesOfController addr={ boox[8] } />
              </td>
              <td>
                <RegisteredCapital addr={ boox[8] } />
              </td>
              <td>
                <PaidInCapital addr={ boox[8] } />
              </td>
            </tr>

            <tr>
              <td colSpan={4}>
                <MembersEquityList addr={ boox[8] } />
              </td>
            </tr>
          </tbody>
        </table>
      </Paper>
    </>
  );
} 

export default MainPage;