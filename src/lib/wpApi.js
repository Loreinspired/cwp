/**
 * wpApi.js — Clearwater Partners
 * WordPress Headless CMS integration via REST API
 *
 * SETUP:
 *   1. Add VITE_WP_API_URL to your .env file:
 *      VITE_WP_API_URL=https://your-wordpress-install.com/wp-json
 *
 *   2. In WordPress, install and activate:
 *      - Yoast SEO (for meta descriptions, schema markup)
 *      - WP REST API Controller (optional — for custom post fields)
 *
 *   3. Publish articles normally in the WP admin dashboard.
 *      They will appear automatically on the CWP site.
 *
 * CATEGORIES (create these in WordPress Dashboard → Posts → Categories):
 *   Corporate · Capital Markets · M&A · Disputes · Network
 *
 * PERSONA TAGS (create these in WordPress Dashboard → Posts → Tags):
 *   founder · investor · executive · individual
 */

const BASE = import.meta.env.VITE_WP_API_URL || 'https://cwplegal.africa/wp-json';
const WP_V2 = `${BASE}/wp/v2`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Strip HTML tags from WP rendered content */
function stripHtml(html = '') {
    return html.replace(/<[^>]+>/g, '').trim();
}

/** Map a raw WP post object to our internal article shape */
function mapPost(post) {
    return {
        id: post.id,
        slug: post.slug,
        title: post.title?.rendered ? stripHtml(post.title.rendered) : 'Untitled',
        excerpt: post.excerpt?.rendered ? stripHtml(post.excerpt.rendered) : '',
        content: post.content?.rendered || '',
        date: post.date ? new Date(post.date).toLocaleDateString('en-GB', {
            year: 'numeric', month: 'long', day: 'numeric',
        }) : '',
        rawDate: post.date || '',
        // Yoast SEO meta (if plugin is installed)
        seoTitle: post.yoast_head_json?.title || null,
        metaDescription: post.yoast_head_json?.description || null,
        // Image
        featuredImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
        // Category name (first one)
        category: post._embedded?.['wp:term']?.[0]?.[0]?.name || 'General',
        // Persona via first tag
        persona: post._embedded?.['wp:term']?.[1]?.[0]?.slug || null,
        // Read time estimate
        readTime: estimateReadTime(post.content?.rendered || ''),
    };
}

function estimateReadTime(html) {
    const wordCount = stripHtml(html).split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(wordCount / 200));
    return `${minutes} min read`;
}

// ─── API Functions ────────────────────────────────────────────────────────────

/**
 * Fetch a list of published posts.
 * @param {Object} opts
 * @param {number} opts.perPage   - Results per page (default 12)
 * @param {number} opts.page      - Page number (default 1)
 * @param {string} opts.category  - Category slug to filter by (optional)
 * @param {string} opts.tag       - Tag slug (persona) to filter by (optional)
 * @param {string} opts.search    - Search query (optional)
 */
export async function fetchPosts({ perPage = 12, page = 1, category, tag, search } = {}) {
    const params = new URLSearchParams({
        per_page: perPage,
        page,
        _embed: 1,        // embeds featured image + terms
        status: 'publish',
    });

    if (category) params.set('categories_name', category);
    if (tag) params.set('tags_slug', tag);
    if (search) params.set('search', search);

    const res = await fetch(`${WP_V2}/posts?${params}`);
    if (!res.ok) {
        throw new Error(`WP API error: ${res.status} ${res.statusText}`);
    }

    const total = parseInt(res.headers.get('X-WP-Total') || '0', 10);
    const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
    const data = await res.json();

    return {
        articles: data.map(mapPost),
        total,
        totalPages,
        page,
    };
}

/**
 * Fetch a single post by its slug.
 * @param {string} slug  - The post slug (from the URL)
 */
export async function fetchPostBySlug(slug) {
    const params = new URLSearchParams({ slug, _embed: 1, status: 'publish' });
    const res = await fetch(`${WP_V2}/posts?${params}`);
    if (!res.ok) throw new Error(`WP API error: ${res.status}`);

    const data = await res.json();
    if (!data.length) return null;
    return mapPost(data[0]);
}

/**
 * Fetch the 3 most recent posts for the home page teaser.
 */
export async function fetchRecentPosts(count = 3) {
    const { articles } = await fetchPosts({ perPage: count });
    return articles;
}
