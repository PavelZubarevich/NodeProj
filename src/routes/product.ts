import { Router, Response, Request } from 'express';
import { Product } from '../models';

const productRouter = Router();

productRouter.get('/', async (req: Request, res: Response) => {
  const products = await Product.find();

  if (products) {
    res.send(products);
  } else {
    res.sendStatus(500);
  }
});

export default productRouter;
