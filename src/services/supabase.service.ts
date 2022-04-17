import { SUPABASE_BU_ID, SUPABASE_HOST, SUPABASE_PASSWORD, SUPABASE_PUBLIC_KEY, SUPABASE_USERNAME } from '@/config';
import { createClient, SupabaseRealtimePayload } from '@supabase/supabase-js';
import DbService from './db.service';
import { logger } from '@utils/logger';

class SupaBaseService {
  db = new DbService();
  supabase = createClient(SUPABASE_HOST, SUPABASE_PUBLIC_KEY);

  constructor() {
    this.supabase.auth.signIn({ email: SUPABASE_USERNAME, password: SUPABASE_PASSWORD }).then(
      res => {
        console.log('signed in! ', res);
      },
      err => {
        console.log('log in error', err);
      },
    );
    this.supabase
      .from('*')
      .on('*', payload => {
        if (payload.table === 'agent_query' && (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE')) {
          this.processSupabaseQuery(payload.new)
            .then(() => {
              logger.info('done processing realtime query', payload.new.id);
            })
            .catch(error => {
              logger.error('failed to process realtime query', error);
            });
        }
        logger.debug('supabase realtime payload', payload);
      })
      .subscribe();
  }

  public async processSupabaseQuery(query: any): Promise<void> {
    const promise = new Promise(resolve => {
      setTimeout(resolve, 3000);
    });
    await promise;
    if (query.executed_at !== null) {
      logger.info('skipping already executed query', query.id);
      return;
    }
    if (query.request.type !== 'sql-query') {
      logger.warn(`cannot handle ${query.request.type} query`, query.id);
      return;
    }
    let result: any = null;
    let status = 'success';
    let errorText: string = undefined;
    try {
      result = await this.db.rawQuery(query.request.query);
    } catch (err) {
      status = 'query failed';
      errorText = err.message;
      logger.error(err);
    }
    logger.info('executed query', { id: query.id, query: query.request.query, result });
    const response = await this.supabase
      .from('agent_query')
      .update({ result: { status, errorText, resultSet: result }, executed_at: new Date(), executed_by: 1 })
      .match({ id: query.id });
    if (response.error) {
      logger.error('failed to update query', response.error);
      console.log('failed update', response);
      return;
    }
    logger.info('updated query', { status: response.status, id: query.id, statusText: response.statusText });
  }
  public async processSupabaseQueries(): Promise<void> {
    const response = await this.supabase
      .from<any>('agent_query')
      .select('*')
      .match({ business_unit_id: parseInt(SUPABASE_BU_ID, 10) })
      .is('executed_at', null);
    logger.debug(`supabase response json: ${JSON.stringify(response)}`);
    for (const query of response.data) {
      await this.processSupabaseQuery(query);
    }
    logger.info('done processing queries');
  }
}

export default SupaBaseService;
