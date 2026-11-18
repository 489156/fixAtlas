import test from 'node:test';
import assert from 'node:assert/strict';
import { referrerSource } from '../../src/lib/referrer.ts';

test('AI search, portals and other sites are grouped; only the host is kept', () => {
  assert.deepEqual(referrerSource('https://chatgpt.com/c/abc?q=secret', 'fixatlas.kr'), { src: 'ai:chatgpt', cmp: 'chatgpt.com' });
  assert.deepEqual(referrerSource('https://www.perplexity.ai/search/x', 'fixatlas.kr'), { src: 'ai:perplexity', cmp: 'www.perplexity.ai' });
  assert.deepEqual(referrerSource('https://gemini.google.com/app', 'fixatlas.kr'), { src: 'ai:gemini', cmp: 'gemini.google.com' });
  assert.deepEqual(referrerSource('https://www.google.co.kr/', 'fixatlas.kr'), { src: 'google', cmp: 'www.google.co.kr' });
  assert.deepEqual(referrerSource('https://m.blog.naver.com/someone/123', 'fixatlas.kr'), { src: 'naver', cmp: 'm.blog.naver.com' });
  assert.deepEqual(referrerSource('https://cafe.example.org/post/1', 'fixatlas.kr'), { src: 'referral', cmp: 'cafe.example.org' });
});

test('direct visits, own-site navigation and malformed referrers are not attributed', () => {
  assert.equal(referrerSource('', 'fixatlas.kr'), null);
  assert.equal(referrerSource('https://fixatlas.kr/search', 'fixatlas.kr'), null);
  assert.equal(referrerSource('not a url', 'fixatlas.kr'), null);
});
