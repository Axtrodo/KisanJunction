import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
export const metadata: Metadata = { title: 'KisanJunction | Growing better connections', description: 'Connecting farmers, buyers and drivers across India.' };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><Nav/><main>{children}</main><Footer/></body></html>}
