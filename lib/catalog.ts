export type CatalogProduct = {
  id: string;
  title: string;
  cluster: string;
  category: string;
  price: string;
  moq: string;
  tone: string;
  source: string;
  image: string;
  description: string;
  hsn: string;
  gst: string;
  leadTime: string;
  supplier: string;
  rating: string;
};

export const catalogProducts: CatalogProduct[] = [
  { id: 'banarasi-silk-stoles', title: 'Banarasi silk stoles', cluster: 'Varanasi, UP', category: 'Handloom textiles', price: '₹680', moq: '25 units', tone: 'from-indigo-900 to-indigo-500', source: 'ThokIO verified', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85', description: 'Lightweight handloom silk stoles with zari accents for boutiques, festive edits, and gifting ranges.', hsn: '6214', gst: '5%', leadTime: '7-10 days', supplier: 'Kashi Weaves Collective', rating: '4.9' },
  { id: 'cotton-rugs', title: 'Hand-knotted cotton rugs', cluster: 'Bhadohi, UP', category: 'Rugs & mats', price: '₹1,240', moq: '20 pieces', tone: 'from-amber-800 to-orange-400', source: 'IndiaMART lead', image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=900&q=85', description: 'Washable flat-weave cotton rugs in warm neutrals, made for home, hospitality, and lifestyle retailers.', hsn: '5705', gst: '5%', leadTime: '12-15 days', supplier: 'Bhadohi Loom House', rating: '4.8' },
  { id: 'brass-serveware', title: 'Brass serveware collection', cluster: 'Moradabad, UP', category: 'Metal craft', price: '₹540', moq: '50 units', tone: 'from-slate-700 to-slate-400', source: 'ThokIO verified', image: 'https://images.unsplash.com/photo-1577083288073-40892c0860a4?auto=format&fit=crop&w=900&q=85', description: 'Hand-finished brass trays and bowls with a contemporary silhouette for premium homeware collections.', hsn: '7419', gst: '12%', leadTime: '10-14 days', supplier: 'Moradabad Craftworks', rating: '4.7' },
  { id: 'assam-tea', title: 'Assam orthodox tea, bulk', cluster: 'Guwahati, Assam', category: 'Agro-commodities', price: '₹310', moq: '100 kg', tone: 'from-emerald-900 to-emerald-500', source: 'TradeIndia lead', image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=900&q=85', description: 'Bold orthodox Assam tea with a malty profile, packed for cafes, private labels, and specialty stores.', hsn: '0902', gst: '5%', leadTime: '5-7 days', supplier: 'Brahmaputra Tea Estate', rating: '4.8' },
  { id: 'block-print-cottons', title: 'Jaipur block-print cottons', cluster: 'Jaipur, Rajasthan', category: 'Handloom textiles', price: '₹295', moq: '50 metres', tone: 'from-rose-900 to-orange-400', source: 'ThokIO verified', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=85', description: 'Breathable cotton fabric with hand-block floral motifs for apparel, home accents, and slow-fashion labels.', hsn: '5208', gst: '5%', leadTime: '8-12 days', supplier: 'Pink City Prints', rating: '4.9' },
  { id: 'terracotta-planters', title: 'Terracotta planters, set of 3', cluster: 'Khurja, UP', category: 'Home & lifestyle', price: '₹420', moq: '30 sets', tone: 'from-orange-950 to-orange-500', source: 'IndiaMART lead', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=85', description: 'Hand-thrown terracotta planters with matte mineral finishes for nurseries, decor stores, and gifting.', hsn: '6912', gst: '12%', leadTime: '10-15 days', supplier: 'Khurja Earth Studio', rating: '4.6' },
  { id: 'leather-tote-bags', title: 'Vegetable-tanned leather totes', cluster: 'Kanpur, UP', category: 'Fashion accessories', price: '₹890', moq: '25 units', tone: 'from-stone-900 to-stone-500', source: 'ThokIO verified', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85', description: 'Structured everyday totes in vegetable-tanned leather, finished for retail-ready private labels.', hsn: '4202', gst: '18%', leadTime: '15-20 days', supplier: 'Ganga Leather Studio', rating: '4.8' },
  { id: 'coconut-bowls', title: 'Coconut shell tableware', cluster: 'Kochi, Kerala', category: 'Home & lifestyle', price: '₹165', moq: '100 sets', tone: 'from-lime-950 to-emerald-500', source: 'TradeIndia lead', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=85', description: 'Upcycled coconut shell bowls and spoons for sustainable kitchen, gifting, and wellness brands.', hsn: '4602', gst: '5%', leadTime: '7-12 days', supplier: 'Malabar Earth Co.', rating: '4.7' },
];
