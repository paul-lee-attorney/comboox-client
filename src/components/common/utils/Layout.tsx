import Link from "next/link";
import { ComBooxAppBar } from "../../center/regCenter/ComBooxAppBar";
import Copyright from "./Copyright";

interface LayoutProps {
  children: any,
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <ComBooxAppBar>
        <main>{ children }</main>
        <Copyright/>
      </ComBooxAppBar>
    </>
  );
}