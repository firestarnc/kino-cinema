import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isAdminConfigured, isValidAdminSessionToken } from "@/lib/admin-auth";
import { listAllHalloweenCandidates, listVerifiedHalloweenVotes } from "@/lib/halloween-voting-db";

export const dynamic = "force-dynamic";

function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function ensureAdminSession(request: NextRequest): NextResponse | null {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Admin authentication is not configured" }, { status: 500 });
  }

  const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isValidAdminSessionToken(sessionToken)) {
    return unauthorizedResponse();
  }

  return null;
}

function escapeCsv(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

export async function GET(request: NextRequest) {
  const authError = ensureAdminSession(request);
  if (authError) {
    return authError;
  }

  try {
    const [candidates, votes] = await Promise.all([
      listAllHalloweenCandidates(),
      listVerifiedHalloweenVotes(10000),
    ]);

    const candidateMap = new Map(candidates.map((candidate) => [candidate.id, candidate.display_name]));

    const header = [
      "verified_at",
      "full_name",
      "email",
      "phone_number",
      "selected_candidate",
      "created_at",
    ];

    const rows = votes.map((vote) => {
      const selectedCandidate = candidateMap.get(vote.candidate_id) ?? "Unknown finalist";

      return [
        vote.verified_at ?? "",
        vote.full_name,
        vote.email,
        vote.phone_number,
        selectedCandidate,
        vote.created_at,
      ].map((cell) => escapeCsv(cell)).join(",");
    });

    const csv = [header.join(","), ...rows].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="halloween-votes-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
      status: 200,
    });
  } catch (error) {
    console.error("[admin/halloween/export] failed to export verified votes", error);
    return NextResponse.json({ error: "Unable to export votes" }, { status: 500 });
  }
}