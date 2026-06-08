import { axiosClient } from "@/api/axios-client";
import type {
  MatchPage,
  MatchQuery,
  MatchQueryResponse,
} from "@/types/match";

export async function getMatches(query: MatchQuery): Promise<MatchPage> {
  const response = await axiosClient.get<MatchQueryResponse>("/matches", {
    params: query,
  });

  return response.data.data;
}
