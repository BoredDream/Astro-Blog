// 友链数据 —— PC 端与移动端共用，新增 / 修改友链只需改这一处。
// 注意：下方部分 url 为占位地址（example.com），请替换为真实站点地址。
// variant 取值 1-7，对应卡片占位图的配色。

export const LINKS = [
  { id: 1, name: "少数派", desc: "数字生活消费指南", url: "https://sspai.com", variant: 1 },
  { id: 2, name: "阮一峰的网络日志", desc: "技术与人文的交汇", url: "https://www.ruanyifeng.com/blog/", variant: 3 },
  { id: 3, name: "牧云笔记", desc: "生活与思考的碎片", url: "https://example.com", variant: 5 },
  { id: 4, name: "一只特立独行的猫", desc: "独立开发者日志", url: "https://example.com", variant: 6 },
  { id: 5, name: "竹白", desc: "静谧写作空间", url: "https://zhubai.love", variant: 2 },
  { id: 6, name: "落日间", desc: "游戏与设计的边界", url: "https://example.com", variant: 4 },
];

// 从 url 提取用于展示的域名（去掉 www. 前缀）。url 非法时返回空串。
export function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
