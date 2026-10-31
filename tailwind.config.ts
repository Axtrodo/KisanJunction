import type { Config } from 'tailwindcss';
export default { content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'], theme: { extend: { colors: { forest:'#173e2b', leaf:'#347654', cream:'#f7f8f2', amberish:'#e9aa44' }, fontFamily:{ sans:['Arial','sans-serif'], serif:['Georgia','serif'] } } }, plugins: [] } satisfies Config;
