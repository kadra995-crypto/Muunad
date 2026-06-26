// Account/order-history features degrade gracefully to "not configured"
// instead of crashing when the database isn't provisioned yet (see
// app/api/orders, app/api/auth/*, and components/AccountPanel.tsx).
export const isDbConfigured = Boolean(process.env.POSTGRES_URL);
