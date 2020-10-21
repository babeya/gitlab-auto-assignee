import fetch from 'node-fetch';

import config from '../config';

const getFullApiUrl = (path: string) =>
  `${config.gitlabUrl}/api/v4${path}?private_token=${config.token}`;

export const gitlabApiGet = <T = any>(path: string): Promise<T> =>
  fetch(getFullApiUrl(path)).then((res) => res.json());

export const gitlabApiPut = <Result, Body>(
  path: string,
  body: Body
): Promise<Result> =>
  fetch(getFullApiUrl(path), {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => res.json());

export const getRandomElementFromArray = <T>(
  array: T[],
  nbElement: number
): T[] => {
  if (!array || !array.length || nbElement <= 0) {
    return [];
  }

  const rdIndex = Math.floor(Math.random() * array.length);

  const nextArray = [...array];
  nextArray.splice(rdIndex, 1);

  return [
    array[rdIndex],
    ...getRandomElementFromArray(nextArray, nbElement - 1),
  ];
};
