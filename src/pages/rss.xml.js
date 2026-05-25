import rss from '@astrojs/rss';
import { postUrl } from '../lib/urls.js';
import { config } from '../config.js';
import { getBlogEntries } from '../lib/posts.js';

export async function GET(context) {
  const blog = await getBlogEntries();
  const items = blog
    .map((post) => ({
      title: post.data.title,
      description: post.data.excerpt || post.data.title,
      pubDate: new Date(String(post.data.date).replace(' ', 'T')),
      link: postUrl({ date: post.data.date, id: post.slug }),
    }));

  return rss({
    title: config.site.name,
    description: config.site.description,
    site: context.site,
    items,
  });
}
