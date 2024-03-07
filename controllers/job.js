/**
 * @file Job Controller.
 * @author DUMONT Benoit <benoit.dum74@gmail.com>
 *
 * @module Controllers/Job
 */
import { Op } from '@sequelize/core';

import JobService from '../services/job';
import HttpError from '../class/HttpError';

const getAllJobs = async (page, items, keys) => {
  const jobResults = await JobService.getAll({
    attributes: keys.length > 1 ? JSON.parse(keys) : undefined,
    offset: page * items - (items - 1),
    limit: items + 1,
  });
  if (page !== undefined && items !== undefined) {
    return {
      jobs: jobResults.slice(0, items - 1),
      nextUrl:
        jobResults.length === items + 1
          ? `http://localhost:3000/api/job/?page=${
              page + 1
            }&items=${items}&keys=${keys}`
          : undefined,
    };
  }
  return jobResults;
};

const getAllJobs7Days = async (daysNumber, page, items, keys) => {
  const datetime = new Date();
  datetime.setDate(datetime.getDate() - Number(daysNumber));
  const format = datetime
    .toISOString()
    .replace('Z', '')
    .replace('T', ' ')
    .slice(0, 19);
  const jobResults = await JobService.getAll({
    createdAt: {
      [Op.gt]: format,
    },
    attributes: keys.length > 1 ? JSON.parse(keys) : undefined,
    offset: page * items - (items - 1),
    limit: items + 1,
  });

  return jobResults;
};

const getOneJob = async (JobId) => {
  if (Number.isNaN(Number(JobId)) || Number(JobId) <= 0) {
    throw new HttpError({
      code: 400,
      message: 'The given JobId must be a positive integer',
    });
  }
  const jobResult = await JobService.getOne(
    { id: JobId },
    {
      include: { all: true },
    },
  );
  if (!jobResult) {
    throw new HttpError({
      code: 404,
      message: "This job doesn't exist",
    });
  }
  return jobResult;
};

export { getAllJobs, getAllJobs7Days, getOneJob };
