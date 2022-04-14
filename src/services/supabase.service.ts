import { SUPABASE_BU_ID, SUPABASE_HOST, SUPABASE_PUBLIC_KEY } from '@/config';
import { createClient } from '@supabase/supabase-js';
import DbService from './db.service';

class SupaBaseService {
  db = new DbService();
  supabase = createClient(SUPABASE_HOST, SUPABASE_PUBLIC_KEY);

  public async processSupabaseQueries(): Promise<void> {
    const response = await this.supabase
      .from<any>('agent_query')
      .select('*')
      .match({ business_unit_id: parseInt(SUPABASE_BU_ID, 10) });
    console.log('svi supabase queryji', response);
    for (const d of response.data) {
      if (d.executed_at !== null) {
        console.log('odustajem jer je izvršen');
        return;
      }
      if (d.request.type !== 'sql-query') {
        console.log('odustajem jer nije sql');
        return;
      }
      const result = await this.db.rawQuery(d.request.query);
      console.log('izvršen query', d.request.query);
      console.log('rezultat', result);
      await this.supabase.from('agent_query').update({ response: result, executed_at: new Date() }).match({ id: d.id });
      console.log('izvršen update');
    }
    console.log('završio procesiranje supabase');
  }
}

export default SupaBaseService;
