import { Router } from 'express';
import chatRoutes from './chatRoutes';
import aiRoutes from './ai';

const router = Router();

router.use('/chat', chatRoutes);
router.use('/ai', aiRoutes);

export default router;
