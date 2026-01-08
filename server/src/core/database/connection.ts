import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { environment } from '../../config/environment';
import { logger } from '../logger/index';

class Database {
  private pool: Pool;
  private static instance: Database;

  private constructor() {
    this.pool = new Pool({
      host: environment.database.host,
      port: environment.database.port,
      database: environment.database.name,
      user: environment.database.user,
      password: environment.database.password,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.pool.on('error', (err) => {
      logger.error('Unexpected error on idle client', err);
    });

    this.pool.on('connect', () => {
      logger.debug('New client connected to PostgreSQL');
    });
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async query<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    const start = Date.now();
    try {
      const result = await this.pool.query<T>(text, params);
      const duration = Date.now() - start;
      logger.debug(`Executed query: ${text.substring(0, 100)} - Duration: ${duration}ms - Rows: ${result.rowCount}`);
      return result;
    } catch (error) {
      logger.error(`Query error: ${text}`, error);
      throw error;
    }
  }

  async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const result = await this.query('SELECT NOW()');
      logger.info(`Database connected successfully at ${result.rows[0].now}`);
      return true;
    } catch (error) {
      logger.error('Database connection failed', error);
      return false;
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
    logger.info('Database pool closed');
  }
}

export const db = Database.getInstance();
