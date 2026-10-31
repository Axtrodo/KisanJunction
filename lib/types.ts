export type Listing = { id:string; crop_name:string; quantity_kg:number; price_per_kg:number; location:string; status:'available'|'sold'; created_at:string; users:{full_name:string;phone:string}|null };
export type Delivery = { id:string; pickup_location:string; drop_location:string|null; status:string; listings:{crop_name:string;quantity_kg:number;location:string}|null };
export const money = (n:number) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n);
export const configError = 'Supabase is not configured yet. Add your project URL and anon key to .env.local to connect the marketplace.';
