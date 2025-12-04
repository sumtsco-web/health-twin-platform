import { Router } from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/user.controller';

const router = Router();

// Placeholder for auth middleware
// router.use(authMiddleware);

router.get('/me', getUserProfile);
router.patch('/me', updateUserProfile);

export default router;
