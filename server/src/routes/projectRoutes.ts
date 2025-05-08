import { Router } from 'express';
import { getProjects } from '../controllers/projectController';


const router = Router();

router.get('/projects', getProjects);

export default router;