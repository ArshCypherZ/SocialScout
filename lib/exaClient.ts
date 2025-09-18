import { Exa } from 'exa-js';

const exaApiKey = process.env.EXA_API_KEY;

if (!exaApiKey) {
  throw new Error('EXA_API_KEY is required');
}

const exa = new Exa(exaApiKey);

export interface ProfileUrls {
  linkedinUrl?: string;
  twitterUrl?: string;
}

export async function searchProfiles(founderName: string): Promise<ProfileUrls> {
  const [linkedinSearch, twitterSearch] = await Promise.all([
    exa.search(`${founderName} LinkedIn`, {
      numResults: 1,
      includeDomains: ['linkedin.com'],
      category: 'linkedin profile',
    }),
    exa.search(`${founderName} site:x.com OR site:twitter.com`, {
      numResults: 1,
      includeDomains: ['x.com', 'twitter.com'],
      category: 'tweet',
    }),
  ]);

  const linkedinUrl = linkedinSearch.results?.[0]?.url;
  const twitterUrl = twitterSearch.results?.[0]?.url;

  return {
    linkedinUrl: linkedinUrl?.includes('linkedin.com/in') ? linkedinUrl : undefined,
    twitterUrl: twitterUrl?.includes('x.com') || twitterUrl?.includes('twitter.com') ? twitterUrl : undefined,
  };
}
