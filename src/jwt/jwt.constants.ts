export const jwtConstants = {
  accessSecret: process.env.JWT_ACCESS_SECRET || 'access_secret',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
  accessTtl: '15m',
  refreshTtl: '7d',
};
