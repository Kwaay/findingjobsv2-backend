/**
 * @file Stack Controller.
 * @author DUMONT Benoit <benoit.dum74@gmail.com>
 *
 * @module Controllers/Stack
 */

import StackService from '../services/stack';
import HttpError from '../class/HttpError';

const getAllStacks = async () => {
  const stackResults = await StackService.getAll({ visibility: true });
  return stackResults;
};

const getOneStack = async (StackId) => {
  if (Number.isNaN(Number(StackId)) || Number(StackId) <= 0) {
    throw new HttpError({
      code: 400,
      message: 'The given StackId must be a positive integer',
    });
  }
  const jobResult = await StackService.getOne({ id: StackId });
  if (!jobResult) {
    throw new HttpError({
      code: 404,
      message: "This stack doesn't exist",
    });
  }
  return jobResult;
};

export { getAllStacks, getOneStack };
