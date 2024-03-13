import { Metadata } from 'next';
import Copyright from './app/write/app_bar/components/Copyright';

export const metadata: Metadata = {
  title: 'ComBoox',
  description: 'A Blockchain Based Statutory-Books-Entry Platform',
}

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main>{ children }</main>
        <Copyright />
      </body>
    </html>
  )
}