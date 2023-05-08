
import { useComBooxContext } from "../../scripts/ComBooxContext";


function MainPage() {
  const { gk, setGK } = useComBooxContext();

  return (
    <>
      <br />
      <br />
      <br />
      <br />
      <br />
      
      <div>
        value of GK: {gk}
      </div>
    </>
  );
} 

export default MainPage;