import rss from '@astrojs/rss';
import { publishedPosts } from '../lib/content';
import { sitePath } from '../lib/paths';

export async function GET(context) {
  const posts = await publishedPosts();
  return rss({
    title: 'Arian Haghparast — Writing',
    description: 'Notes and essays on research, work, and life.',
    site: new URL(sitePath('/'), context.site),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary || `A ${post.data.kind} by Arian Haghparast.`,
      pubDate: post.data.date,
      link: sitePath(`/writing/${post.data.slug}/`)
    }))
  });
}
