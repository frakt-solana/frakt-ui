const IS_DEV = process.env.NETWORK === 'devnet';

export const REGULAR_PHASE_DURATION = IS_DEV ? 10 * 60 : 6 * 24 * 60 * 60; //? Duration in seconds
