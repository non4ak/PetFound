import { useQuery } from "@tanstack/react-query";

import { getMatches } from "@/data/queries/matches";
import type { MatchQuery } from "@/types/match";

export function useGetMatches(query: MatchQuery) {
  return useQuery({
    queryKey: ["matches", query],
    queryFn: () => getMatches(query),
  });
}
