/**
 * @file Stack Router.
 * @author DUMONT Benoit <benoit.dum74@gmail.com>
 */

import express from 'express';
import HttpError from '../class/HttpError';

import { getAllStacks, getOneStack } from '../controllers/stack';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const stacks = await getAllStacks();
    return res.status(200).json(stacks);
  } catch (error) {
    if (error instanceof HttpError) {
      return res.status(error.code).json({ error: error.message });
    }
    return res
      .status(500)
      .json({ error: 'Cannot get Stacks. Please try again' });
  }
});

router.get('/:StackId', async (req, res) => {
  try {
    const { StackId } = req.params;
    const stack = await getOneStack(Number(StackId));
    return res.status(200).json(stack);
  } catch (error) {
    if (error instanceof HttpError) {
      return res.status(error.code).json({ error: error.message });
    }
    return res
      .status(500)
      .json({ error: 'Cannot get this Stack. Please try again' });
  }
});

export default router;
