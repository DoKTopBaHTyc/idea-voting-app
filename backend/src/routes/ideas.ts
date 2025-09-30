import express from 'express';
import { listIdeas, voteIdea } from '../controllers/ideasController';
const router = express.Router();

router.get('/', listIdeas);
router.post('/:id/vote', voteIdea);

export default router;
