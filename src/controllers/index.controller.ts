import DbService from '@/services/db.service';
import SupaBaseService from '@/services/supabase.service';
import { logger } from '@/utils/logger';
import { NextFunction, Request, Response } from 'express';

class IndexController {
  public dbService = new DbService();
  public supabase = new SupaBaseService();
  public index = (req: Request, res: Response, next: NextFunction): void => {
    try {
      this.supabase.processSupabaseQueries().then(() => {
        logger.info('done processing queries');
      });
      this.dbService.findAllRows().then(rows => {
        console.log('got them rows', rows);
        res.send(rows);
      });
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
