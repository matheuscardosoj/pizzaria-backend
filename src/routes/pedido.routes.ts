import { Router } from 'express';
import PedidoController from './../controllers/pedido.controller';

const pedidoController = new PedidoController();
const router = Router();

router.get('/', pedidoController.list);
router.get('/:id', pedidoController.show);
router.post('/', pedidoController.create);
router.put('/status/:id', pedidoController.updateStatus);
router.delete('/:id', pedidoController.delete);

export default router;
