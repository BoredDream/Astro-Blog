#!/usr/bin/env node
/**
 * 用法: npm run new -- <slug>
 * 示例: npm run new -- my-new-post
 *       npm run new -- 2026-reading-notes
 */
import { writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const slug = process.argv[2];

if (!slug) {
  console.error('\n❌  请提供文章 slug：\n');
  console.error('   npm run new -- <slug>\n');
  console.error('   示例：npm run new -- my-new-post\n');
  process.exit(1);
}

if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
  console.error('\n❌  slug 只能包含小写字母、数字和连字符，且不能以连字符开头\n');
  process.exit(1);
}

const destPath = join(ROOT, 'src/content/blog', `${slug}.md`);
if (existsSync(destPath)) {
  console.error(`\n❌  文件已存在：src/content/blog/${slug}.md\n`);
  process.exit(1);
}

const now = new Date();
const pad = n => String(n).padStart(2, '0');
const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

const content = `---
title: ""
date: "${date}"
tags: []
cover: 1
coverLabel: "cover · "
excerpt: ""
# cover 可填 1–7（纯色占位），或图片路径如 "/images/posts/${slug}/cover.jpg"
# 推荐封面比例：3:2（列表）/ 16:9（文章详情页）
# excerpt 留空则自动取正文前 120 字

# draft: true          # 草稿：dev 可见、build 时排除
# pinned: true         # 置顶到列表最前
# updated: ""          # 更新日期 YYYY-MM-DD

# 音乐播放器（删除 # 启用）：
# audio:
#   title: ""
#   artist: ""
#   neteaseId: ""   # 从 https://music.163.com/song?id=XXXXXXX 复制数字 ID
#   lyrics: ""
#   cover: 1

# 文章末尾图（删除 # 启用）：
# endImage:
#   cover: 1
#   label: ""
---

<!-- 正文从这里开始，支持完整 Markdown 语法 -->
<!-- 行内图片：![描述](/images/posts/${slug}/photo.jpg) -->
`;

writeFileSync(destPath, content, 'utf8');
console.log(`\n✓  已创建：src/content/blog/${slug}.md\n`);
console.log(`   日期已自动填写：${date}`);
console.log(`   图片目录建议：public/images/posts/${slug}/\n`);
