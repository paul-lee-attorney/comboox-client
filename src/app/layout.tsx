// 'use client'

import { Metadata } from 'next';
import Copyright from './components/Copyright';
// import { useEffect, useState } from 'react';
import Providers from './_providers/Providers';

export const metadata: Metadata = {
  title: 'ComBoox',
  description: 'A Blockchain Based Company Book-Entry Platform',
}

type RootLayoutProps= {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  
  // const [ mounted, setMounted ] =  useState(false);

  // useEffect(()=>{
  //   setMounted(true);
  // }, []);
  
  return (
    <html lang="en">
      {/* {mounted && ( */}
        <Providers>
          <body>
            <main>{ children }</main>
            <Copyright />
          </body>
        </Providers>
      {/* )} */}
    </html>
  )
}