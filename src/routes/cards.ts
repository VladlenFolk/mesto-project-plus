import { Router } from 'express';
import {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  deleteLikeCard,
} from '../controllers/cards';

const router = Router();

router.get('/', getCards);
router.delete('/:cardId', deleteCard);
router.post('/', createCard);
router.put('/:cardId/likes', addLikeCard);
router.delete('/:cardId/likes', deleteLikeCard);
export default router;
