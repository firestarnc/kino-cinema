import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, isAdminConfigured, isValidAdminSessionToken } from "@/lib/admin-auth";
import { getHalloweenDashboardData, listAllHalloweenCandidates } from "@/lib/halloween-voting-db";
import HalloweenCandidatesManager from "@/components/admin/HalloweenCandidatesManager";

export const dynamic = "force-dynamic";

export default async function AdminHalloweenPage() {
  if (!isAdminConfigured()) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border/40 bg-card/40 p-8 backdrop-blur-sm">
          <h1 className="font-playfair text-4xl font-bold text-foreground">Halloween Dashboard</h1>
          <p className="mt-3 font-outfit text-sm text-muted-foreground">Admin authentication is not configured yet.</p>
        </div>
      </section>
    );
  }

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isValidAdminSessionToken(sessionToken)) {
    redirect("/admin/login?next=/admin/halloween");
  }

  const [dashboard, candidates] = await Promise.all([
    getHalloweenDashboardData(50),
    listAllHalloweenCandidates(),
  ]);

  const leaderboard = [...dashboard.candidates]
    .sort((a, b) => b.verified_vote_count - a.verified_vote_count || a.sort_order - b.sort_order)
    .map((candidate, index) => {
      const percentage = dashboard.totalVerifiedVotes > 0
        ? Math.round((candidate.verified_vote_count / dashboard.totalVerifiedVotes) * 1000) / 10
        : 0;

      return {
        rank: index + 1,
        candidate,
        percentage,
      };
    });

  const winner = leaderboard[0] ?? null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-outfit text-xs uppercase tracking-[0.3em] text-cinema-gold">Halloween voting</p>
          <h1 className="mt-2 font-playfair text-4xl font-bold text-foreground md:text-5xl">Verified vote dashboard</h1>
          <p className="mt-2 max-w-2xl font-outfit text-sm text-muted-foreground">Admin view for vote totals and verified contact records.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/api/admin/halloween/export" className="rounded-full border border-white/10 bg-black/20 px-5 py-3 font-outfit text-xs uppercase tracking-[0.26em] text-foreground/85 transition hover:border-cinema-gold/30 hover:text-cinema-gold">
            Export verified votes (CSV)
          </Link>
          <Link href="/halloween" className="rounded-full border border-cinema-gold/25 bg-cinema-gold/10 px-5 py-3 font-outfit text-xs uppercase tracking-[0.26em] text-cinema-gold transition hover:bg-cinema-gold/15">
            Open public vote page
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border/40 bg-card/40 p-5 backdrop-blur-sm">
          <p className="font-outfit text-xs uppercase tracking-[0.24em] text-muted-foreground">Total verified votes</p>
          <p className="mt-3 font-playfair text-4xl font-bold text-foreground">{dashboard.totalVerifiedVotes}</p>
        </div>

        <div className="rounded-2xl border border-border/40 bg-card/40 p-5 backdrop-blur-sm md:col-span-2">
          <p className="font-outfit text-xs uppercase tracking-[0.24em] text-muted-foreground">Top finalists</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.candidates.map((candidate) => (
              <div key={candidate.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-playfair text-xl text-foreground">{candidate.display_name}</p>
                <p className="mt-2 font-outfit text-sm text-muted-foreground">{candidate.verified_vote_count} verified votes</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_1.8fr]">
        <div className="rounded-2xl border border-cinema-gold/30 bg-cinema-gold/10 p-5 backdrop-blur-sm">
          <p className="font-outfit text-xs uppercase tracking-[0.24em] text-cinema-gold">Current leader</p>
          {winner ? (
            <>
              <p className="mt-3 font-playfair text-3xl font-bold text-foreground">{winner.candidate.display_name}</p>
              <p className="mt-2 font-outfit text-sm text-foreground/85">{winner.candidate.verified_vote_count} votes ({winner.percentage}% of verified votes)</p>
            </>
          ) : (
            <p className="mt-3 font-outfit text-sm text-muted-foreground">No verified votes yet.</p>
          )}
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm">
          <table className="min-w-full">
            <thead className="border-b border-border/40 bg-background/40">
              <tr className="text-left">
                <th className="px-4 py-3 font-outfit text-xs uppercase tracking-wider text-muted-foreground">Rank</th>
                <th className="px-4 py-3 font-outfit text-xs uppercase tracking-wider text-muted-foreground">Finalist</th>
                <th className="px-4 py-3 font-outfit text-xs uppercase tracking-wider text-muted-foreground">Votes</th>
                <th className="px-4 py-3 font-outfit text-xs uppercase tracking-wider text-muted-foreground">Share</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center font-outfit text-sm text-muted-foreground">No leaderboard data yet.</td>
                </tr>
              ) : (
                leaderboard.map(({ rank, candidate, percentage }) => (
                  <tr key={candidate.id} className="border-b border-border/20 last:border-0">
                    <td className="px-4 py-3 font-outfit text-sm text-foreground/90">#{rank}</td>
                    <td className="px-4 py-3 font-playfair text-lg text-foreground">{candidate.display_name}</td>
                    <td className="px-4 py-3 font-outfit text-sm text-foreground/90">{candidate.verified_vote_count}</td>
                    <td className="px-4 py-3 font-outfit text-sm text-foreground/90">{percentage}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8">
        <HalloweenCandidatesManager initialCandidates={candidates} />
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm">
        <table className="min-w-full">
          <thead className="border-b border-border/40 bg-background/40">
            <tr className="text-left">
              <th className="px-4 py-3 font-outfit text-xs uppercase tracking-wider text-muted-foreground">Verified At</th>
              <th className="px-4 py-3 font-outfit text-xs uppercase tracking-wider text-muted-foreground">Guest</th>
              <th className="px-4 py-3 font-outfit text-xs uppercase tracking-wider text-muted-foreground">Email</th>
              <th className="px-4 py-3 font-outfit text-xs uppercase tracking-wider text-muted-foreground">Phone</th>
              <th className="px-4 py-3 font-outfit text-xs uppercase tracking-wider text-muted-foreground">Selected</th>
            </tr>
          </thead>
          <tbody>
            {dashboard.recentVerifiedVotes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center font-outfit text-sm text-muted-foreground">
                  No verified votes yet.
                </td>
              </tr>
            ) : (
              dashboard.recentVerifiedVotes.map((vote) => {
                const candidate = dashboard.candidates.find((entry) => entry.id === vote.candidate_id);

                return (
                  <tr key={vote.id} className="border-b border-border/20 last:border-0">
                    <td className="px-4 py-3 font-outfit text-sm text-foreground/90">{vote.verified_at ? new Date(vote.verified_at).toLocaleString("en-NG") : "-"}</td>
                    <td className="px-4 py-3 font-outfit text-sm text-foreground/90">{vote.full_name}</td>
                    <td className="px-4 py-3 font-outfit text-sm text-foreground/90">{vote.email}</td>
                    <td className="px-4 py-3 font-outfit text-sm text-foreground/90">{vote.phone_number}</td>
                    <td className="px-4 py-3 font-outfit text-sm text-foreground/90">{candidate?.display_name ?? "Unknown finalist"}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}