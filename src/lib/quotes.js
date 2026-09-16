// 每日格言：按一年中的第几天在 config.quotes 里轮换。
// PC 右栏与移动端抽屉共用，保证两端当天显示同一条。
// 注意：日期固定为构建时刻，静态站点跨天后需重新构建才会换新。
import { config } from '../config.js';

export function getDailyQuote() {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const index = dayOfYear % config.quotes.length;
  return { quote: config.quotes[index], index };
}
