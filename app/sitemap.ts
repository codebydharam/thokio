import type { MetadataRoute } from 'next';
import { getCatalogProducts } from '@/lib/catalog-server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const products = await getCatalogProducts();
  return [{ url: base, changeFrequency: 'daily', priority: 1 }, { url: `${base}/products`, changeFrequency: 'hourly', priority: .9 }, ...products.map(product => ({ url: `${base}/products/${product.id}`, changeFrequency: 'daily' as const, priority: .7 }))];
}
