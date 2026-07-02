import type { NextConfig } from "next";

const resolvedSupabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";

function getSupabaseImageRemotePattern() {
  if (!resolvedSupabaseUrl) {
    return [];
  }

  try {
    const normalizedUrl = resolvedSupabaseUrl.replace(/\/rest\/v1$/i, "");
    const parsed = new URL(normalizedUrl);

    return [
      {
        protocol: "https" as const,
        hostname: parsed.hostname,
        pathname: "/storage/v1/object/public/**",
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  reactCompiler: true,
  trailingSlash: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [...getSupabaseImageRemotePattern()],
  },
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(posters|backdrops|rooms|avatars)/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store",
          },
        ],
      },
    ];
  },
};

export default nextConfig;