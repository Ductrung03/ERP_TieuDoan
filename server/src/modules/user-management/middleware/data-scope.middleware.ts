import { Response, NextFunction } from 'express';
import { logger } from '../../../core/logger';
import { AuthRequest } from './auth.middleware';
import { db } from '../../../core/database/connection';

/**
 * Data scope filter middleware
 * Automatically filters queries based on user's data scope
 * Attach allowedUnits to request for use in repositories
 */
export const applyDataScope = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next();
    }

    // Admin bypass - see all data
    if (req.user.maquyen === 'VT01') {
      logger.debug('Admin bypass data scope filter');
      return next();
    }

    // Get user's allowed unit IDs
    const allowedUnits = await getAllowedUnits(
      req.user.mataikhoan,
      req.user.madonvi
    );

    // Attach to request for use in repositories
    req.user.allowedUnits = allowedUnits;

    logger.debug(
      `Data scope applied for user ${req.user.tendn}: ${allowedUnits.length} units`
    );

    next();
  } catch (error) {
    logger.error('Data scope error:', error);
    next(error);
  }
};

/**
 * Get list of unit IDs that user can access
 */
async function getAllowedUnits(
  mataikhoan: string,
  userUnitId: string
): Promise<string[]> {

  // 1. Get user's data scope configuration
  const scopeQuery = `
    SELECT pv.loaiphamvi, pv.maphamvi
    FROM taikhoan_phamvi tp
    INNER JOIN phamvidulieu pv ON tp.maphamvi = pv.maphamvi
    WHERE tp.mataikhoan = $1 AND pv.trangthai = 'Active'
    LIMIT 1
  `;

  const scopeResult = await db.query(scopeQuery, [mataikhoan]);

  if (scopeResult.rows.length === 0) {
    // No scope configured, default to OWN_UNIT
    logger.debug(`No scope configured for user ${mataikhoan}, defaulting to OWN_UNIT`);
    return [userUnitId];
  }

  const scope = scopeResult.rows[0];

  switch (scope.loaiphamvi) {
    case 'ALL':
      // Return all units
      logger.debug(`Data scope ALL for user ${mataikhoan}`);
      const allUnits = await db.query('SELECT madonvi FROM donvi');
      return allUnits.rows.map((row: any) => row.madonvi);

    case 'OWN_UNIT':
      // Return only user's unit
      logger.debug(`Data scope OWN_UNIT for user ${mataikhoan}: ${userUnitId}`);
      return [userUnitId];

    case 'SUB_UNITS':
      // Return own unit + all sub units (recursive)
      logger.debug(`Data scope SUB_UNITS for user ${mataikhoan}`);
      const subUnitsQuery = `
        WITH RECURSIVE unit_tree AS (
          -- Anchor: bắt đầu từ đơn vị của user
          SELECT madonvi, madonvitren FROM donvi WHERE madonvi = $1
          UNION ALL
          -- Recursive: lấy tất cả các đơn vị con
          SELECT d.madonvi, d.madonvitren
          FROM donvi d
          INNER JOIN unit_tree ut ON d.madonvitren = ut.madonvi
        )
        SELECT madonvi FROM unit_tree
      `;
      const subUnits = await db.query(subUnitsQuery, [userUnitId]);
      const units = subUnits.rows.map((row: any) => row.madonvi);
      logger.debug(`SUB_UNITS resolved to: ${units.join(', ')}`);
      return units;

    case 'CUSTOM':
      // Return custom list of units
      logger.debug(`Data scope CUSTOM for user ${mataikhoan}`);
      const customUnitsQuery = `
        SELECT madonvi FROM phamvi_donvi WHERE maphamvi = $1
      `;
      const customUnits = await db.query(customUnitsQuery, [scope.maphamvi]);
      return customUnits.rows.map((row: any) => row.madonvi);

    default:
      // Unknown scope type, default to OWN_UNIT
      logger.warn(`Unknown scope type: ${scope.loaiphamvi}, defaulting to OWN_UNIT`);
      return [userUnitId];
  }
}

/**
 * Build SQL WHERE clause for data scope filtering
 * Usage in repository:
 *
 * const whereClause = buildDataScopeFilter(req.user?.allowedUnits, 'hv.madonvi');
 * const query = `SELECT * FROM hocvien hv WHERE ${whereClause}`;
 */
export function buildDataScopeFilter(
  allowedUnits: string[] | undefined,
  columnName: string = 'madonvi'
): string {
  if (!allowedUnits || allowedUnits.length === 0) {
    // No filter (should not happen in normal flow)
    return '1=1';
  }

  // Build IN clause
  const unitList = allowedUnits.map((unit) => `'${unit}'`).join(', ');
  return `${columnName} IN (${unitList})`;
}
