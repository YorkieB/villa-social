import type { NextApiRequest, NextApiResponse } from 'next';
import type { TrendsResponse, ErrorResponse } from '@lib/types/place';

// Static Villa trending topics — replaces Twitter API
const VILLA_TRENDS = [
  { name: '#KMRecords', query: '%23KMRecords', tweet_volume: 4821, url: '/trends' },
  { name: '#TonightSingle', query: '%23TonightSingle', tweet_volume: 3204, url: '/trends' },
  { name: 'Kayleigh Merez', query: 'KayleighMerez', tweet_volume: 2918, url: '/trends' },
  { name: '#VillaRadio', query: '%23VillaRadio', tweet_volume: 2540, url: '/trends' },
  { name: '#BackInMyOwnName', query: '%23BackInMyOwnName', tweet_volume: 1876, url: '/trends' },
  { name: 'The Crash', query: 'TheCrash', tweet_volume: 1654, url: '/trends' },
  { name: '#IndieMusic', query: '%23IndieMusic', tweet_volume: 1421, url: '/trends' },
  { name: 'Leah Carter', query: 'LeahCarter', tweet_volume: 1203, url: '/trends' },
  { name: '#NewMusic', query: '%23NewMusic', tweet_volume: 987, url: '/trends' },
  { name: '#PenzanceScene', query: '%23PenzanceScene', tweet_volume: 654, url: '/trends' },
];

export default function placeIdEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<TrendsResponse | ErrorResponse>
): void {
  const { limit } = req.query as { id: string; limit?: string };

  const limitNum = limit ? parseInt(limit, 10) : null;
  const trends = limitNum ? VILLA_TRENDS.slice(0, limitNum) : VILLA_TRENDS;

  res.status(200).json({
    trends,
    location: 'Villa'
  });
}
