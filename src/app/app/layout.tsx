"use client"

import React, { useState, useEffect } from 'react';

import Providers from './_providers/Providers';
import { ComBooxAppBar } from './write/app_bar/ComBooxAppBar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const [mounted, setMounted] = useState(false)
  useEffect(()=>{
    setMounted(true);
  }, []);

  return (
    <>
      {mounted && (
        <Providers>
          <ComBooxAppBar>
            { children }
          </ComBooxAppBar>
        </Providers>
      )}
    </>
  )
}