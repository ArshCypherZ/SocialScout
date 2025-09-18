export interface FounderProfile {
  inputName: string;
  resolvedProfile: {
    url: string;
    name: string;
  };
  professional_summary: string;
  key_topics_of_interest: string[];
  potential_red_flags: string[];
  sources_used: string[];
  timestamp: string;
}

export interface FounderInput {
  name: string;
  socialUrl?: string;
}

export interface ApiRequest {
  founders: FounderInput[];
}

export interface ApiResponse {
  profiles: FounderProfile[];
}
