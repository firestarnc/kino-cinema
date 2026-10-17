import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import type { HalloweenCandidate, HalloweenVote, HalloweenVoteAttempt } from "@/lib/halloween-voting";

type SupabaseAdmin = ReturnType<typeof getSupabaseAdminClient>;

export interface HalloweenCandidateWithCount extends HalloweenCandidate {
  verified_vote_count: number;
}

export interface HalloweenDashboardData {
  candidates: HalloweenCandidateWithCount[];
  totalVerifiedVotes: number;
  recentVerifiedVotes: HalloweenVote[];
}

function getClient(): SupabaseAdmin {
  return getSupabaseAdminClient() as SupabaseAdmin;
}

function getClientTyped() {
  return getClient();
}

export async function listActiveHalloweenCandidates(): Promise<HalloweenCandidate[]> {
  const supabase = getClientTyped();
  const { data, error } = await supabase
    .from("halloween_candidates")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("display_name", { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function listAllHalloweenCandidates(): Promise<HalloweenCandidate[]> {
  const supabase = getClientTyped();
  const { data, error } = await supabase
    .from("halloween_candidates")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("display_name", { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getHalloweenCandidateById(candidateId: string): Promise<HalloweenCandidate | null> {
  const supabase = getClientTyped();
  const { data, error } = await supabase
    .from("halloween_candidates")
    .select("*")
    .eq("id", candidateId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ?? null;
}

export async function createPendingHalloweenVote(input: {
  candidateId: string;
  fullName: string;
  email: string;
  emailNormalized: string;
  phoneNumber: string;
  verificationTokenHash: string;
  tokenExpiresAt: string;
  ipAddress: string | null;
  userAgent: string | null;
}): Promise<HalloweenVote> {
  const supabase = getClientTyped();

  const { error: deleteError } = await supabase
    .from("halloween_votes")
    .delete()
    .eq("email_normalized", input.emailNormalized)
    .is("verified_at", null);

  if (deleteError) {
    throw deleteError;
  }

  const { data, error } = await supabase
    .from("halloween_votes")
    .insert({
      candidate_id: input.candidateId,
      full_name: input.fullName,
      email: input.email,
      email_normalized: input.emailNormalized,
      phone_number: input.phoneNumber,
      verification_token_hash: input.verificationTokenHash,
      token_expires_at: input.tokenExpiresAt,
      verified_at: null,
      verified_ip_address: null,
      verified_user_agent: null,
      ip_address: input.ipAddress,
      user_agent: input.userAgent,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getHalloweenVoteByTokenHash(tokenHash: string): Promise<HalloweenVote | null> {
  const supabase = getClientTyped();
  const { data, error } = await supabase
    .from("halloween_votes")
    .select("*")
    .eq("verification_token_hash", tokenHash)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ?? null;
}

export async function markHalloweenVoteVerified(input: {
  tokenHash: string;
  verifiedAt: string;
  verifiedIpAddress: string | null;
  verifiedUserAgent: string | null;
}): Promise<HalloweenVote | null> {
  const supabase = getClientTyped();

  const { data, error } = await supabase
    .from("halloween_votes")
    .update({
      verification_token_hash: null,
      token_expires_at: null,
      verified_at: input.verifiedAt,
      verified_ip_address: input.verifiedIpAddress,
      verified_user_agent: input.verifiedUserAgent,
    })
    .eq("verification_token_hash", input.tokenHash)
    .is("verified_at", null)
    .select("*")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ?? null;
}

export async function listVerifiedHalloweenVotes(limit = 100): Promise<HalloweenVote[]> {
  const supabase = getClientTyped();
  const { data, error } = await supabase
    .from("halloween_votes")
    .select("*")
    .not("verified_at", "is", null)
    .order("verified_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function listRecentHalloweenAttempts(limit = 50): Promise<HalloweenVoteAttempt[]> {
  const supabase = getClientTyped();
  const { data, error } = await supabase
    .from("halloween_vote_attempts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function countRecentAttemptsByEmail(emailNormalized: string, sinceISO: string): Promise<number> {
  const supabase = getClientTyped();
  const { count, error } = await supabase
    .from("halloween_vote_attempts")
    .select("id", { count: "exact", head: true })
    .eq("email_normalized", emailNormalized)
    .gte("created_at", sinceISO);

  if (error) {
    throw error;
  }

  return count ?? 0;
}

export async function countRecentAttemptsByIp(ipAddress: string, sinceISO: string): Promise<number> {
  const supabase = getClientTyped();
  const { count, error } = await supabase
    .from("halloween_vote_attempts")
    .select("id", { count: "exact", head: true })
    .eq("ip_address", ipAddress)
    .gte("created_at", sinceISO);

  if (error) {
    throw error;
  }

  return count ?? 0;
}

export async function recordHalloweenAttempt(input: {
  emailNormalized: string | null;
  ipAddress: string | null;
  outcome: string;
  reason: string | null;
}): Promise<void> {
  const supabase = getClientTyped();
  const { error } = await supabase.from("halloween_vote_attempts").insert({
    email_normalized: input.emailNormalized,
    ip_address: input.ipAddress,
    outcome: input.outcome,
    reason: input.reason,
  });

  if (error) {
    throw error;
  }
}

export async function getHalloweenDashboardData(limit = 50): Promise<HalloweenDashboardData> {
  const [candidates, votes] = await Promise.all([
    listAllHalloweenCandidates(),
    listVerifiedHalloweenVotes(Math.max(limit, 200)),
  ]);

  const voteCountByCandidateId = new Map<string, number>();
  for (const vote of votes) {
    voteCountByCandidateId.set(vote.candidate_id, (voteCountByCandidateId.get(vote.candidate_id) ?? 0) + 1);
  }

  return {
    candidates: candidates.map((candidate) => ({
      ...candidate,
      verified_vote_count: voteCountByCandidateId.get(candidate.id) ?? 0,
    })),
    totalVerifiedVotes: votes.length,
    recentVerifiedVotes: votes.slice(0, limit),
  };
}