import { NextRequest, NextResponse } from 'next/server';
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { docsContentRoute } from '@/lib/shared';

// The docs are served from the site root, so these patterns match every path.
const { rewrite: rewriteDocs } = rewritePath('/{*path}', `${docsContentRoute}{/*path}/content.md`);
const { rewrite: rewriteSuffix } = rewritePath('/{*path}.md', `${docsContentRoute}{/*path}/content.md`);

// Routes that live next to the docs and must never be rewritten to markdown.
const RESERVED = ['/api', '/og', '/llms', '/_next', 'sitemap', 'robots'];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (RESERVED.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`) || pathname.startsWith(`${prefix}.`))) {
    return NextResponse.next();
  }

  const result = rewriteSuffix(pathname);
  if (result) {
    return NextResponse.rewrite(new URL(result, request.nextUrl));
  }

  if (isMarkdownPreferred(request)) {
    const result = rewriteDocs(pathname);

    if (result) {
      return NextResponse.rewrite(new URL(result, request.nextUrl));
    }
  }

  return NextResponse.next();
}
