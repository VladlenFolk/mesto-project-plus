import { Router } from 'express';

import usersRouter from './uesrs';
import cardsRouter from './cards';

const router = Router();

router.use('/cards', cardsRouter);
router.use('/users', usersRouter);

export default router;
