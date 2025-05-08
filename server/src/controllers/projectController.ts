import { Request, Response } from 'express';
import pgsqldb from '../config/db';
import { Project } from '../models/project';

export const getProjects = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string || '';
  const offset = (page - 1) * limit;

  try {
    let projectQuery = 'SELECT id, name, description FROM projects';
    let countQuery = 'SELECT COUNT(*) FROM projects';
    const queryParams: any[] = [];
    
    if (search) {
      projectQuery += ' WHERE name ILIKE $3';
      countQuery += ' WHERE name ILIKE $1';
      queryParams.push(`%${search}%`);
    }

    projectQuery += ' ORDER BY id LIMIT $1 OFFSET $2';

    const [projectResult, countResult] = await Promise.all([
      pgsqldb.query(
        projectQuery,
        [limit, offset, ...(search ? [queryParams[0]] : [])]
      ),
      pgsqldb.query(countQuery, search ? [queryParams[0]] : [])
    ]);

    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      data: projectResult.rows as Project[],
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error while fetching projects.' });
  }
};