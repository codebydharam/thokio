import { NextResponse } from 'next/server';
import { getCatalogProducts } from '@/lib/catalog-server';
import type { CatalogProduct } from '@/lib/catalog';

/** Keeps search useful in development and production when no local model is running. */
function keywordSearch(products: CatalogProduct[], query: string, category: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  return products
    .filter(product => category === 'All products' || product.category === category)
    .map(product => ({ product, score: terms.filter(term => `${product.title} ${product.cluster} ${product.category}`.toLowerCase().includes(term)).length }))
    .filter(result => terms.length === 0 || result.score > 0)
    .sort((left, right) => right.score - left.score)
    .map(result => result.product);
}

/** Ask Ollama for product IDs only; product details always come from our trusted catalog. */
async function localAiSearch(products: CatalogProduct[], query: string, category: string) {
  const endpoint = process.env.OLLAMA_URL ?? 'http://127.0.0.1:11434';
  const model = process.env.OLLAMA_MODEL ?? 'llama3.2:3b';
  const response = await fetch(`${endpoint}/api/generate`, {
    method: 'POST',
    signal: AbortSignal.timeout(1800),
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model,
      stream: false,
      format: 'json',
      prompt: `Match the buyer request to product ids. Return JSON only as {"ids":["..."]}. Request: ${query}. Category filter: ${category}. Products: ${JSON.stringify(products.map(product => ({ id: product.id, title: product.title, category: product.category, cluster: product.cluster })))}.`,
    }),
  });
  if (!response.ok) throw new Error('Local model unavailable');
  const result = await response.json() as { response?: string };
  const parsed = JSON.parse(result.response ?? '{"ids":[]}') as { ids?: string[] };
  const matches = new Set(parsed.ids ?? []);
  return products.filter(product => matches.has(product.id) && (category === 'All products' || product.category === category));
}

export async function GET(request: Request) {
  const products = await getCatalogProducts();
  const params = new URL(request.url).searchParams;
  const query = params.get('q')?.trim() ?? '';
  const category = params.get('category') ?? 'All products';
  if (!query) return NextResponse.json({ products: keywordSearch(products, '', category), aiUsed: false });

  try {
    const aiProducts = await localAiSearch(products, query, category);
    return NextResponse.json({ products: aiProducts.length ? aiProducts : keywordSearch(products, query, category), aiUsed: aiProducts.length > 0 });
  } catch {
    return NextResponse.json({ products: keywordSearch(products, query, category), aiUsed: false, provider: 'keyword-fallback' });
  }
}
