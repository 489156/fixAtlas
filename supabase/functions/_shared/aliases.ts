// Korean/English brand + category vocabulary used by the search parser.
// Keys are lower-cased `products.brand` values.
export const BRAND_ALIASES: Record<string, string[]> = {
  roborock: ['roborock', '로보락', '로보록'],
  dreame: ['dreame', '드리미', '드리메'],
  ecovacs: ['ecovacs', '에코백스', '에코벡스', 'deebot', '디봇', '데보트'],
  irobot: ['irobot', '아이로봇', 'roomba', '룸바'],
  samsung: ['samsung', '삼성', '삼성전자', '비스포크', 'bespoke'],
  lg: ['lg', '엘지', '엘쥐', 'lg전자', '코드제로', 'cordzero'],
  dyson: ['dyson', '다이슨', '다이손'],
};

export const CATEGORY_WORDS: Record<string, string[]> = {
  'robot-vacuum': ['로봇청소기', '로봇', '로청', 'robot', '로봇청소'],
  'cordless-vacuum': ['무선청소기', '무선', '스틱', '핸디', 'cordless', 'stick', '스틱청소기'],
};

// Words that carry no product/symptom signal.
export const STOPWORDS = new Set([
  '청소기', '수리비', '수리', '고장', '문제', '증상', '해결', '방법', '가격', '비용', '얼마', '전자',
  '후기', '제보', '교체', 'as', 'a', 's', 'vacuum', 'cleaner', 'repair', 'cost', 'price', 'fix',
  'broken', 'my', 'the', 'is', 'to', 'of', 'and',
]);
