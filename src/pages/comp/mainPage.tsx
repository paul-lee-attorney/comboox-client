import { Paper, Toolbar, TextField } from "@mui/material";

import { useComBooxContext } from "../../scripts/ComBooxContext";
import { 
  RegisteredCapital,
  PaidInCapital,
  RegNumTF,
  CompName,
  Controllor,
  VotesOfController,
  MembersEquityList,
  CompSymbolTf,
  CompAddrTf,
} from "../../components";


function MainPage() {
  const { boox } = useComBooxContext();

  return (
    <>
      <Paper 
        sx={{
          alignContent:'center', 
          justifyContent:'center', 
          p:1, m:1, border:1, 
          borderColor:'divider' 
        }} 
      >
        <Toolbar>
          <h3>General Info</h3>
        </Toolbar>

        <table width={1680} >
          <thead>

            <tr>        
              <td colSpan={4}>
                <CompName addr={ boox[0] } />
              </td>
            </tr>

            <tr>        
              <td >
                <RegNumTF addr={ boox[0] } />
              </td>

              <td >
                <CompSymbolTf addr={ boox[0] } />
              </td>

              <td colSpan={2} >
                <CompAddrTf addr={ boox[0] } />
              </td>
            </tr>
          </thead>
          
          <tbody>


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