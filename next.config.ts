import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Define maximum upload file size (bytes), fallback to 1MB
const UPLOAD_MAX_SIZE_BYTES = parseInt(process.env.NEXT_PUBLIC_UPLOAD_MAX_SIZE || '1048576', 10);
// Define maximum request body size for Server Actions (bytes), defaults to file size limit + 100KB overhead or overridden via UPLOAD_SERVER_BODY_LIMIT
const MAX_BODY_SIZE_BYTES = parseInt(
  process.env.UPLOAD_SERVER_BODY_LIMIT || String(UPLOAD_MAX_SIZE_BYTES + 1024 * 100),
  10
);

const nextConfig: NextConfig = {
  experimental: {
    // Configure Server Actions request body size limit
    serverActions: {
      bodySizeLimit: MAX_BODY_SIZE_BYTES,
    },
  },
  images: {
    domains: ['api.dicebear.com', 'jamc-dev-bucket.s3.ap-southeast-2.amazonaws.com'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Expose upload limit to client-side via environment variable (string)
  env: {
    NEXT_PUBLIC_UPLOAD_MAX_SIZE: String(UPLOAD_MAX_SIZE_BYTES),
  },
  // Keep any existing configuration options
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig); 