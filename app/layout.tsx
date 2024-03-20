import { Metadata } from 'next';
import Copyright from './read/Copyright';

export const metadata: Metadata = {
  title: 'ComBoox',
  description: 'A Blockchain Based Company Book-Entry Platform',
}

type RootLayoutProps= {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <main>{ children }</main>
        <Copyright />
      </body>
    </html>
  )
}