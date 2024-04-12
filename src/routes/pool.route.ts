import express from 'express';

import { getAllPools } from '../controllers/pool.controller';
const router = express.Router();

router.get('/getAll', getAllPools);

export default router;
