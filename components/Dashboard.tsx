import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
export function Heading({eyebrow,title,description}:{eyebrow:string,title:string,description:string}){return <div className="mb-9"><Link href="/" className="mb-7 inline-flex items-center gap-2 text-sm text-[#758776] hover:text-forest"><ArrowLeft size={15}/> Back to home</Link><p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#789469]">{eyebrow}</p><h1 className="font-serif text-4xl tracking-tight sm:text-5xl">{title}</h1><p className="mt-3 max-w-2xl leading-7 text-[#778879]">{description}</p></div>}
export function Notice({children}:{children:React.ReactNode}){return <div role="status" className="mb-5 rounded-xl border border-[#e9d8a9] bg-[#fff9e8] px-4 py-3 text-sm leading-6 text-[#786032]">{children}</div>}
export function Empty({text}:{text:string}){return <div className="rounded-2xl border border-dashed border-[#cfddce] bg-white/60 px-6 py-14 text-center text-sm text-[#829182]">{text}</div>}
