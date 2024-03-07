/**
 * @file Job Router.
 * @author DUMONT Benoit <benoit.dum74@gmail.com>
 */

import express from 'express';
import HttpError from '../class/HttpError';

import { getAllJobs, getOneJob, getAllJobs7Days } from '../controllers/job';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const page = Number(req.query?.page || 0);
    const items = Number(req.query?.items || 0);
    const keys = req.query?.keys || [];
    const jobs = await getAllJobs(page, items, keys);
    return res.status(200).json(jobs);
  } catch (error) {
    if (error instanceof HttpError) {
      return res.status(error.code).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Cannot get Jobs. Please try again' });
  }
});

router.get('/days/:daysNumber', async (req, res) => {
  try {
    const { daysNumber } = req.params;
    const page = Number(req.query?.page || 0);
    const items = Number(req.query?.items || 0);
    const keys = req.query?.keys || [];
    const jobs = await getAllJobs7Days(daysNumber, page, items, keys);
    return res.status(200).json(jobs);
  } catch (error) {
    if (error instanceof HttpError) {
      return res.status(error.code).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Cannot get Jobs. Please try again' });
  }
});

router.get('/:JobId', async (req, res) => {
  try {
    const { JobId } = req.params;
    const job = await getOneJob(Number(JobId));
    return res.status(200).json(job);
  } catch (error) {
    if (error instanceof HttpError) {
      return res.status(error.code).json({ error: error.message });
    }
    return res
      .status(500)
      .json({ error: 'Cannot get this Job. Please try again' });
  }
});

export default router;
