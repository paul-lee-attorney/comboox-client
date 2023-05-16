import { ComBooxAppBar } from "../center/ComBooxAppBar";

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