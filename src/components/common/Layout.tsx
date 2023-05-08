import { ComBooxAppBar } from "../center/ComBooxAppBar";

export function Layout({ children }) {
  return (
    <>
      <ComBooxAppBar>
        <main>{ children }</main>
      </ComBooxAppBar>
    </>
  );
}