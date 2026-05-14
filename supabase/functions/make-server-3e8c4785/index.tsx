import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

function mapProduct(row: Record<string, unknown>) {
  return {
    ...row,
    alternate_names: Array.isArray(row.alternate_names)
      ? row.alternate_names
      : (row.alternate_names as string[] | null) ?? [],
  };
}

async function getBearerUser(c: { req: { header: (n: string) => string | undefined } }) {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  if (!accessToken) return { user: null as { id: string } | null, error: 'no token' };
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user?.id) return { user: null, error: error?.message ?? 'unauthorized' };
  return { user: { id: user.id }, error: null as string | null };
}

async function getProfileRole(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();
  if (error || !data) return null;
  return data.role as string;
}

async function requireAdmin(c: { req: { header: (n: string) => string | undefined } }) {
  const { user, error } = await getBearerUser(c);
  if (!user?.id || error) return { ok: false as const, status: 401, message: 'Unauthorized' };
  const role = await getProfileRole(user.id);
  if (role !== 'admin' && role !== 'moderator') {
    return { ok: false as const, status: 403, message: 'Admin access required' };
  }
  return { ok: true as const, userId: user.id };
}

// Health
app.get(`/health`, (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Search
app.get(`/search`, async (c) => {
  const query = (c.req.query('q') ?? '').trim().toLowerCase();
  if (!query) return c.json({ products: [], symptoms: [] });

  try {
    const [{ data: productsRaw }, { data: symptomsRaw }] = await Promise.all([
      supabase.from('products').select('*'),
      supabase.from('symptoms').select('*'),
    ]);

    const products = (productsRaw ?? []).filter((p: Record<string, unknown>) => {
      const names = (p.alternate_names as string[]) ?? [];
      const blob = `${p.brand} ${p.model_name} ${p.description} ${names.join(' ')}`.toLowerCase();
      return blob.includes(query);
    }).slice(0, 10);

    const symptoms = (symptomsRaw ?? []).filter((s: Record<string, unknown>) => {
      const ko = String(s.name_ko ?? '');
      const en = String(s.name_en ?? '').toLowerCase();
      return ko.includes(query) || en.includes(query);
    }).slice(0, 5);

    return c.json({
      products: products.map(mapProduct),
      symptoms,
    });
  } catch (error) {
    console.log('Search error:', error);
    return c.json({ error: 'Search failed', details: String(error) }, 500);
  }
});

app.get(`/products`, async (c) => {
  try {
    const category = c.req.query('category');
    let q = supabase.from('products').select('*').order('brand');
    if (category) q = q.eq('category', category);
    const { data, error } = await q;
    if (error) throw error;
    return c.json({ products: (data ?? []).map(mapProduct) });
  } catch (error) {
    console.log('Get products error:', error);
    return c.json({ error: 'Failed to fetch products', details: String(error) }, 500);
  }
});

app.get(`/products/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const [{ data: product, error: pErr }, { data: reports }, { data: symptoms }, { data: selfCheck }] =
      await Promise.all([
        supabase.from('products').select('*').eq('id', id).maybeSingle(),
        supabase.from('repair_reports').select('*').eq('product_id', id).order('created_at', {
          ascending: false,
        }).limit(50),
        supabase.from('symptoms').select('*').order('name_ko'),
        supabase.from('self_check_cards').select('*').eq('product_id', id).order('sort_order'),
      ]);

    if (pErr) throw pErr;
    if (!product) return c.json({ error: 'Product not found' }, 404);

    return c.json({
      product: mapProduct(product as Record<string, unknown>),
      reports: reports ?? [],
      symptoms: symptoms ?? [],
      self_check_cards: selfCheck ?? [],
    });
  } catch (error) {
    console.log('Get product error:', error);
    return c.json({ error: 'Failed to fetch product', details: String(error) }, 500);
  }
});

app.get(`/symptoms`, async (c) => {
  try {
    const { data, error } = await supabase.from('symptoms').select('*').order('name_ko');
    if (error) throw error;
    return c.json({ symptoms: data ?? [] });
  } catch (error) {
    console.log('Get symptoms error:', error);
    return c.json({ error: 'Failed to fetch symptoms', details: String(error) }, 500);
  }
});

app.post(`/repair-reports`, async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken!);
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized - please log in to submit a report' }, 401);
    }

    const body = await c.req.json();
    const reportRow = {
      user_id: user.id,
      product_id: body.product_id,
      symptom_id: body.symptom_id,
      country: body.country,
      city: body.city || '',
      repair_channel: body.repair_channel,
      quoted_price: body.quoted_price || 0,
      paid_price: body.paid_price || 0,
      currency: body.currency,
      repair_item: body.repair_item || '',
      resolved_status: body.resolved_status,
      review_text: body.review_text || '',
      receipt_image_url: body.receipt_image_url || '',
      verified_status: 'reported',
    };

    const { data: report, error } = await supabase.from('repair_reports').insert(reportRow).select().single();
    if (error) throw error;

    return c.json({ success: true, report });
  } catch (error) {
    console.log('Submit repair report error:', error);
    return c.json({ error: 'Failed to submit report', details: String(error) }, 500);
  }
});

app.get(`/repair-reports`, async (c) => {
  try {
    const { data, error } = await supabase.from('repair_reports').select('*').order('created_at', {
      ascending: false,
    }).limit(200);
    if (error) throw error;
    return c.json({ reports: data ?? [] });
  } catch (error) {
    console.log('Get repair reports error:', error);
    return c.json({ error: 'Failed to fetch reports', details: String(error) }, 500);
  }
});

app.get(`/community`, async (c) => {
  try {
    const type = c.req.query('type');
    let q = supabase.from('community_posts').select('*').eq('hidden', false).order('created_at', {
      ascending: false,
    });
    if (type && type !== 'all') q = q.eq('type', type);
    const { data, error } = await q;
    if (error) throw error;
    return c.json({ posts: data ?? [] });
  } catch (error) {
    console.log('Get community posts error:', error);
    return c.json({ error: 'Failed to fetch posts', details: String(error) }, 500);
  }
});

app.get(`/community/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const { data: post, error: pErr } = await supabase.from('community_posts').select('*').eq('id', id).maybeSingle();
    if (pErr) throw pErr;
    if (!post || post.hidden) return c.json({ error: 'Post not found' }, 404);

    const { data: comments, error: cErr } = await supabase.from('comments').select('*').eq('post_id', id).order(
      'created_at',
      { ascending: true },
    );
    if (cErr) throw cErr;

    return c.json({ post, comments: comments ?? [] });
  } catch (error) {
    console.log('Get community post error:', error);
    return c.json({ error: 'Failed to fetch post', details: String(error) }, 500);
  }
});

app.post(`/community`, async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken!);
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized - please log in to create a post' }, 401);
    }

    const body = await c.req.json();
    const postRow = {
      user_id: user.id,
      type: body.type,
      product_id: body.product_id || null,
      symptom_id: body.symptom_id || null,
      title: body.title,
      body: body.body,
      status: body.status || 'open',
      images: body.images ?? [],
      tags: body.tags ?? [],
    };

    const { data: post, error } = await supabase.from('community_posts').insert(postRow).select().single();
    if (error) throw error;

    return c.json({ success: true, post });
  } catch (error) {
    console.log('Create community post error:', error);
    return c.json({ error: 'Failed to create post', details: String(error) }, 500);
  }
});

app.post(`/comments`, async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken!);
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized - please log in to comment' }, 401);
    }

    const body = await c.req.json();
    const { data: comment, error } = await supabase.from('comments').insert({
      post_id: body.post_id,
      user_id: user.id,
      body: body.body,
    }).select().single();

    if (error) throw error;
    return c.json({ success: true, comment });
  } catch (error) {
    console.log('Create comment error:', error);
    return c.json({ error: 'Failed to create comment', details: String(error) }, 500);
  }
});

app.post(`/comments/:id/helpful`, async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken!);
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const id = c.req.param('id');
    const { data: updated, error } = await supabase.rpc('increment_comment_helpful', { cid: id });
    if (error) throw error;
    const rows = updated as Record<string, unknown>[] | null;
    const comment = Array.isArray(rows) ? rows[0] : rows;
    if (!comment) return c.json({ error: 'Comment not found' }, 404);
    return c.json({ success: true, comment });
  } catch (error) {
    console.log('Helpful error:', error);
    return c.json({ error: 'Failed to mark helpful', details: String(error) }, 500);
  }
});

app.get(`/user`, async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken!);
    if (!user?.id || authError) return c.json({ error: 'Unauthorized' }, 401);

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
    return c.json({ user: profile ?? { id: user.id, email: user.email } });
  } catch (error) {
    console.log('Get user error:', error);
    return c.json({ error: 'Failed to fetch user', details: String(error) }, 500);
  }
});

app.post(`/admin/seed`, async (c) => {
  const gate = await requireAdmin(c);
  if (!gate.ok) return c.json({ error: gate.message }, gate.status);

  try {
    const symptoms = [
      { id: 'sym-1', code: 'not_charging', name_ko: '충전 안 됨', name_en: 'Not charging', name_zh: '无法充电', risk_level: 'caution', self_check_allowed: true },
      { id: 'sym-2', code: 'weak_suction', name_ko: '흡입력 약함', name_en: 'Weak suction', name_zh: '吸力弱', risk_level: 'safe', self_check_allowed: true },
      { id: 'sym-3', code: 'battery_drain', name_ko: '배터리 빨리 닳음', name_en: 'Battery drains quickly', name_zh: '电池快速耗尽', risk_level: 'caution', self_check_allowed: true },
      { id: 'sym-4', code: 'dock_error', name_ko: '도크 오류', name_en: 'Dock error', name_zh: '底座错误', risk_level: 'caution', self_check_allowed: false },
      { id: 'sym-5', code: 'sensor_error', name_ko: '센서 오류', name_en: 'Sensor error', name_zh: '传感器错误', risk_level: 'expert', self_check_allowed: false },
      { id: 'sym-6', code: 'brush_not_rotating', name_ko: '브러시 회전 안 됨', name_en: 'Brush not rotating', name_zh: '刷子不旋转', risk_level: 'safe', self_check_allowed: true },
      { id: 'sym-7', code: 'loud_noise', name_ko: '소음 큼', name_en: 'Loud noise', name_zh: '噪音大', risk_level: 'caution', self_check_allowed: false },
      { id: 'sym-8', code: 'mop_not_working', name_ko: '물걸레 작동 안 됨', name_en: 'Mop not working', name_zh: '拖把不工作', risk_level: 'safe', self_check_allowed: true },
      { id: 'sym-9', code: 'app_connection', name_ko: '앱 연결 안 됨', name_en: 'App not connecting', name_zh: '应用无法连接', risk_level: 'safe', self_check_allowed: true },
      { id: 'sym-10', code: 'error_code', name_ko: '에러코드 발생', name_en: 'Error code', name_zh: '错误代码', risk_level: 'expert', self_check_allowed: false },
    ];

    const { error: sErr } = await supabase.from('symptoms').upsert(symptoms, { onConflict: 'id' });
    if (sErr) throw sErr;

    const robotVacuums = [
      { id: 'prod-1', category: 'robot-vacuum', brand: 'Roborock', model_name: 'S8 Pro Ultra', alternate_names: ['S8 Pro', 'S8'], release_year: 2023, image_url: '', description: 'Premium robot vacuum with auto-empty dock' },
      { id: 'prod-2', category: 'robot-vacuum', brand: 'Roborock', model_name: 'Q Revo', alternate_names: ['Q7'], release_year: 2023, image_url: '', description: 'Mid-range robot vacuum with mop' },
      { id: 'prod-3', category: 'robot-vacuum', brand: 'Dreame', model_name: 'L10s Ultra', alternate_names: ['L10'], release_year: 2023, image_url: '', description: 'Auto-empty robot vacuum' },
      { id: 'prod-4', category: 'robot-vacuum', brand: 'Ecovacs', model_name: 'Deebot X2 Omni', alternate_names: ['X2'], release_year: 2023, image_url: '', description: 'Square-shaped premium robot vacuum' },
      { id: 'prod-5', category: 'robot-vacuum', brand: 'iRobot', model_name: 'Roomba j7+', alternate_names: ['j7'], release_year: 2021, image_url: '', description: 'Smart robot vacuum with obstacle avoidance' },
      { id: 'prod-6', category: 'robot-vacuum', brand: 'Samsung', model_name: 'Jet Bot AI+', alternate_names: ['Jet Bot'], release_year: 2021, image_url: '', description: 'Robot vacuum with AI object recognition' },
      { id: 'prod-7', category: 'robot-vacuum', brand: 'LG', model_name: 'CordZero R9', alternate_names: ['R9'], release_year: 2022, image_url: '', description: 'LG robot vacuum with auto-empty' },
    ];

    const cordlessVacuums = [
      { id: 'prod-8', category: 'cordless-vacuum', brand: 'Dyson', model_name: 'V15 Detect', alternate_names: ['V15'], release_year: 2021, image_url: '', description: 'Premium cordless vacuum with laser detection' },
      { id: 'prod-9', category: 'cordless-vacuum', brand: 'Dyson', model_name: 'V12 Slim', alternate_names: ['V12'], release_year: 2021, image_url: '', description: 'Lightweight cordless vacuum' },
      { id: 'prod-10', category: 'cordless-vacuum', brand: 'Samsung', model_name: 'Bespoke Jet', alternate_names: ['Jet'], release_year: 2021, image_url: '', description: 'Premium cordless stick vacuum' },
      { id: 'prod-11', category: 'cordless-vacuum', brand: 'LG', model_name: 'CordZero A9', alternate_names: ['A9'], release_year: 2020, image_url: '', description: 'Dual battery cordless vacuum' },
      { id: 'prod-12', category: 'cordless-vacuum', brand: 'Dreame', model_name: 'T30', alternate_names: [], release_year: 2022, image_url: '', description: 'High-performance cordless vacuum' },
    ];

    const allProducts = [...robotVacuums, ...cordlessVacuums].map((p) => ({
      ...p,
      alternate_names: p.alternate_names as unknown as string[],
    }));

    const { error: pErr } = await supabase.from('products').upsert(
      allProducts.map((p) => ({ ...p, alternate_names: p.alternate_names })),
      { onConflict: 'id' },
    );
    if (pErr) throw pErr;

    const productIds = allProducts.map((p) => p.id);
    await supabase.from('self_check_cards').delete().in('product_id', productIds);

    const cards: Record<string, unknown>[] = [];
    for (const p of allProducts) {
      cards.push({
        product_id: p.id,
        symptom_id: 'sym-1',
        title_ko: '전원·충전 기본 점검',
        body_ko: '콘센트 전원, 어댑터 연결, 케이블 손상 여부를 확인하세요. (TODO: 제품 매뉴얼 기준으로 내부 검수 후 문구 확정)',
        sort_order: 0,
      });
      cards.push({
        product_id: p.id,
        symptom_id: null,
        title_ko: '필터·먼지통 점검',
        body_ko: '필터 막힘과 먼지통 과적재는 증상과 유사하게 보일 수 있습니다. (내부 검수 TODO)',
        sort_order: 1,
      });
    }
    const { error: cErr } = await supabase.from('self_check_cards').insert(cards);
    if (cErr) throw cErr;

    return c.json({ success: true, message: 'Seed data initialized' });
  } catch (error) {
    console.log('Seed data error:', error);
    return c.json({ error: 'Failed to seed data', details: String(error) }, 500);
  }
});

app.get(`/admin/data`, async (c) => {
  const gate = await requireAdmin(c);
  if (!gate.ok) return c.json({ error: gate.message }, gate.status);

  try {
    const [{ data: products }, { data: symptoms }, { data: reports }, { data: posts }, { data: users }] =
      await Promise.all([
        supabase.from('products').select('*').order('brand'),
        supabase.from('symptoms').select('*').order('name_ko'),
        supabase.from('repair_reports').select('*').order('created_at', { ascending: false }).limit(200),
        supabase.from('community_posts').select('*').order('created_at', { ascending: false }).limit(200),
        supabase.from('profiles').select('id, email, nickname, country, role, created_at').order('created_at', {
          ascending: false,
        }).limit(500),
      ]);

    return c.json({
      products: (products ?? []).map(mapProduct),
      symptoms: symptoms ?? [],
      reports: reports ?? [],
      posts: posts ?? [],
      users: users ?? [],
    });
  } catch (error) {
    console.log('Get admin data error:', error);
    return c.json({ error: 'Failed to fetch data', details: String(error) }, 500);
  }
});

app.patch(`/admin/posts/:id`, async (c) => {
  const gate = await requireAdmin(c);
  if (!gate.ok) return c.json({ error: gate.message }, gate.status);

  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const patch: Record<string, unknown> = {};
    if (typeof body.hidden === 'boolean') patch.hidden = body.hidden;
    if (typeof body.verified === 'boolean') patch.verified = body.verified;

    const { data: post, error } = await supabase.from('community_posts').update(patch).eq('id', id).select().single();
    if (error) throw error;
    if (!post) return c.json({ error: 'Post not found' }, 404);
    return c.json({ success: true, post });
  } catch (error) {
    console.log('Admin patch post error:', error);
    return c.json({ error: 'Failed to update post', details: String(error) }, 500);
  }
});

const main = new Hono();
main.route('/', app);
main.route('/make-server-3e8c4785', app);

Deno.serve(main.fetch);
