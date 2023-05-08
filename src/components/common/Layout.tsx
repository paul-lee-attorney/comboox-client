import { ComBooxAppBar } from "./ComBooxAppBar";

export function Layout({ children }) {
  return (
    <>
      <ComBooxAppBar>
        <main>{ children }</main>
      </ComBooxAppBar>
    </>
  );
}