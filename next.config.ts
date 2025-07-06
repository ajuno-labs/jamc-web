import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const UPLOAD_MAX_SIZE_BYTES = parseInt(process.env.NEXT_PUBLIC_UPLOAD_MAX_SIZE || '1048576', 10);
const MAX_BODY_SIZE_BYTES = parseInt(
  process.env.UPLOAD_SERVER_BODY_LIMIT || String(UPLOAD_MAX_SIZE_BYTES + 1024 * 100),
  10
);

const nextConfig: NextConfig = {
  experimental: {
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
  env: {
    NEXT_PUBLIC_UPLOAD_MAX_SIZE: String(UPLOAD_MAX_SIZE_BYTES),
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig); 
