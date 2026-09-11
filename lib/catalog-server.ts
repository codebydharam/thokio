import { catalogProducts, type CatalogProduct } from '@/lib/catalog';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

type ProductRow = {
  id: string;
  slug: string | null;
  title: string;
  description: string;
  category: string;
  hsn_code: string | null;
  images: string[];
  tier_pricing: Array<{ min_qty?: number; unit_price?: number }>;
  cluster: string;
  moq: number;
  base_price: number;
  gst_rate: number;
  lead_time: string;
  catalog_source: string;
  rating: number;
  supplier: { company_name: string | null }[] | { company_name: string | null } | null;
};

function formatPrice(value: number) {
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

function mapProduct(row: ProductRow): CatalogProduct {
  const firstTier = row.tier_pricing?.[0];
  const unitPrice = firstTier?.unit_price ?? row.base_price;
  const supplier = Array.isArray(row.supplier) ? row.supplier[0] : row.supplier;
  return {
    id: row.slug ?? row.id,
    title: row.title,
    cluster: row.cluster,
    category: row.category,
    price: formatPrice(unitPrice),
    moq: `${row.moq} units`,
    tone: 'from-indigo-900 to-indigo-500',
    source: row.catalog_source,
    image: row.images[0] ?? '',
    description: row.description,
    hsn: row.hsn_code ?? 'Not listed',
    gst: `${row.gst_rate}%`,
    leadTime: row.lead_time,
    supplier: supplier?.company_name ?? 'Verified cluster supplier',
    rating: row.rating.toFixed(1),
  };
}

/** Reads published catalog rows from Supabase and maps them to the UI contract. */
export async function getCatalogProducts(): Promise<CatalogProduct[]> {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !serviceRoleKey || serviceRoleKey.startsWith('your_')) return catalogProducts;

  const admin = getSupabaseAdmin();
  try {
    const { data, error } = await admin
      .from('products')
      .select('id,slug,title,description,category,hsn_code,images,tier_pricing,cluster,moq,base_price,gst_rate,lead_time,catalog_source,rating,supplier:profiles(company_name)')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data as ProductRow[]).map(mapProduct);
  } catch (error) {
    console.error('Catalog query failed:', error);
    // Keep the storefront available while a new Supabase project is being migrated.
    return catalogProducts;
  }
}

export async function getCatalogProduct(slug: string) {
  const products = await getCatalogProducts();
  return products.find(product => product.id === slug);
}
