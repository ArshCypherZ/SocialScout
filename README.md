# SocialScout

A sleek Next.js API for uncovering founder personas through public data. It digs into LinkedIn, Twitter, and more to craft insightful profiles with summaries, interests, and red flags—all backed by real sources.

## Quick Setup
1. Clone and cd into the folder
2. Install deps: `npm install`
3. Set your env vars: `EXA_API_KEY` and `GEMINI_API_KEY`
4. Run dev: `npm run dev`

## Usage
Hit the `/api/founder-profile` endpoint with a POST request like this:

```json
{
  "founders": [
    {
      "name": "Elon Musk",
      "socialUrl": "https://twitter.com/elonmusk"
    }
  ]
}
```

Get back a JSON with the founder's profile, sources, and timestamp. Easy peasy!
