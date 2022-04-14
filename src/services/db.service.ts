import Knex from 'databases';
import { Test } from '../models/test.model';
class DbService {
  public async findAllRows(): Promise<Test[]> {
    // const rows: Test[] = await Knex<Test>('test_table').select('*');
    const rows: Test[] = await Knex.raw('select * from test_table');
    return rows;
  }
  public async rawQuery(query: string): Promise<any> {
    return await Knex.raw(query);
  }
}

export default DbService;
