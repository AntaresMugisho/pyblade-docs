import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';

const baseUrl = 'https://docs.pyblade.com';

export default function sitemap(): MetadataRoute.Sitemap {
  return source.getPages().map((page) => ({
    url: `${baseUrl}${page.url === '/' ? '' : page.url}`,
    changeFrequency: 'weekly',
    priority: page.url === '/' ? 1 : 0.8,
  }));
}