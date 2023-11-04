import { ComBooxAppBar } from "../../center/regCenter/ComBooxAppBar";

interface LayoutProps {
  children: any,
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <ComBooxAppBar>
        <main>{ children }</main>
      </ComBooxAppBar>
    </>
  );
}