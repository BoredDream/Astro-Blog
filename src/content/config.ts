import { defineCollection, z } from 'astro:content';

// cover 可以是 1–7 纯色占位符数字，也可以是图片路径/URL 字符串
const coverField = z.union([z.number().min(1).max(7), z.string()]);

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    tags: z.array(z.string()),
    cover: coverField,
    coverLabel: z.string(),
    views: z.number().default(0),
    likes: z.number().default(0),
    comments: z.number().default(0),
    relTime: z.string().optional(),
    excerpt: z.string().optional(),
    draft: z.boolean().default(false),    // true = 草稿，仅 dev 可见，build 时排除
    pinned: z.boolean().default(false),   // true = 置顶到列表最前
    updated: z.string().optional(),       // 更新日期，留空则不显示
    audio: z.object({
      title: z.string(),
      artist: z.string(),
      lyricist: z.string().optional(),
      composer: z.string().optional(),
      lyrics: z.string().optional(),
      cover: coverField,
      neteaseId: z.string().optional(),  // 网易云歌曲 ID（URL 中的 id 参数）
      audioUrl: z.string().optional(),   // 直接 mp3/音频 URL（静态部署时使用）
    }).optional(),
    endImage: z.object({ cover: coverField, label: z.string() }).optional(),
  }),
});

export const collections = { blog };
