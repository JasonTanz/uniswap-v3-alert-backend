import express from 'express';
import poolRoute from './pool.route';
import transactionRoute from './transaction.route';

export const router = express.Router();

const defaultRoutes = [
  {
    path: '/pools',
    route: poolRoute,
  },
  {
    path: '/transactions',
    route: transactionRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
