import { Router } from 'express';
import { menu } from '../data/menu.js';

const router = Router();

// GET /api/menu -> lista completa de alimentos con precio y stock
router.get('/', (req, res) => {
  res.json(menu);
});

export default router;
