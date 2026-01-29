import { MetadataRoute } from 'next'

const BASE_URL = 'https://ptnenglish.edu.vn'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static routes
    const routes = [
        '',
        '/about-us',
        '/blog',
        '/contact',
        '/courses',
        '/journey',
        '/student-corner',
        '/teachers',
        '/test',
    ].map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Fetch dynamic blog posts
    try {
        // We can fetch from our internal API if it exists or use a direct DB query if sitemap is server-side
        // For Next.js sitemap.ts, we can import models if we have a DB connection configured
        const postsRes = await fetch(`${BASE_URL}/api/posts`, { next: { revalidate: 3600 } }).catch(() => null);
        if (postsRes?.ok) {
            const posts = await postsRes.json();
            const blogRoutes = posts.map((post: any) => ({
                url: `${BASE_URL}/blog/${post.slug}`,
                lastModified: new Date(post.updatedAt || post.createdAt || new Date()),
                changeFrequency: 'monthly' as const,
                priority: 0.6,
            }));
            return [...routes, ...blogRoutes];
        }
    } catch (error) {
        console.error('Sitemap generation error:', error);
    }

    return routes;
}
