import type { NextApiRequest, NextApiResponse } from 'next';

export default function availableEndpoint(
  _req: NextApiRequest,
  res: NextApiResponse
): void {
  res.status(200).json([{ name: 'Villa', placeType: { name: 'Supername' }, woeid: 1 }]);
}
