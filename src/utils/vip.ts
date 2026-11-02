/**
 * Returns true only for a VIP flag backed by a valid, future expiration date.
 * Missing or invalid dates are treated as expired to prevent perpetual legacy flags.
 */
export const hasActiveVipSubscription = (profile: any, now = Date.now()): boolean => {
  if (!profile || profile.isVip !== true || !profile.vipUntil) return false;

  try {
    const raw = profile.vipUntil;
    const expiry = raw && typeof raw.toDate === 'function' ? raw.toDate() : new Date(raw);
    const expiryTime = expiry instanceof Date ? expiry.getTime() : Number.NaN;
    return Number.isFinite(expiryTime) && expiryTime > now;
  } catch {
    return false;
  }
};
