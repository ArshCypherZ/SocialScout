import { NextRequest, NextResponse } from 'next/server'
import { FounderProfile, ApiRequest, ApiResponse, FounderInput } from '@/lib/types'
import { searchProfiles } from '@/lib/exaClient'
import { analyzeContent } from '@/lib/geminiClient'
import { Exa } from 'exa-js'

async function getContent(urls: string[]): Promise<string> {
  if (urls.length === 0) return ''
  const exaApiKey = process.env.EXA_API_KEY
  if (!exaApiKey) throw new Error('EXA_API_KEY is required')
  const exa = new Exa(exaApiKey)
  const contents = await exa.getContents(urls, { text: { maxCharacters: 4000 } })
  return contents.results.map((r: any) => r.text).join('\n\n')
}

export async function POST(request: NextRequest) {
  const body: ApiRequest = await request.json()
  const { founders } = body

  const profiles: FounderProfile[] = await Promise.all(
    founders.map(async (founder: FounderInput) => {
      let urls: string[] = []
      let socialUrl = founder.socialUrl

      if (socialUrl) {
        const socialText = await getContent([socialUrl])
        if (socialText.length > 0) {
          const analysis = await analyzeContent(socialText, founder.name)
          return {
            inputName: founder.name,
            resolvedProfile: {
              url: socialUrl,
              name: founder.name,
            },
            professional_summary: analysis.professional_summary,
            key_topics_of_interest: analysis.key_topics_of_interest,
            potential_red_flags: analysis.potential_red_flags,
            sources_used: [socialUrl],
            timestamp: new Date().toISOString(),
          }
        }
      }

      const urlsData = await searchProfiles(founder.name)
      if (urlsData.linkedinUrl) urls.push(urlsData.linkedinUrl)
      if (urlsData.twitterUrl) urls.push(urlsData.twitterUrl)
      const aggregatedText = await getContent(urls)
      const analysis = await analyzeContent(aggregatedText, founder.name)
      const linkedinUrl = urlsData.linkedinUrl || urlsData.twitterUrl || ''
      const sources_used = urls

      return {
        inputName: founder.name,
        resolvedProfile: {
          url: linkedinUrl,
          name: founder.name,
        },
        professional_summary: analysis.professional_summary,
        key_topics_of_interest: analysis.key_topics_of_interest,
        potential_red_flags: analysis.potential_red_flags,
        sources_used,
        timestamp: new Date().toISOString(),
      }
    })
  )

  const response: ApiResponse = { profiles }
  return NextResponse.json(response)
}
