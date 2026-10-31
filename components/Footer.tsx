import Link from 'next/link';
import { Sprout } from 'lucide-react';
export default function Footer(){return <footer className="border-t border-[#e0e8dc] bg-[#f3f6ee]"><div className="wrap flex flex-col justify-between gap-5 py-9 sm:flex-row sm:items-center"><div><Link href="/" className="flex items-center gap-2 font-bold text-forest"><Sprout size={20}/> KisanJunction</Link><p className="mt-2 text-sm text-[#738273]">Growing stronger, together.</p></div><p className="text-xs text-[#899588]">Made for the people who feed India. © {new Date().getFullYear()} KisanJunction</p></div></footer>}
