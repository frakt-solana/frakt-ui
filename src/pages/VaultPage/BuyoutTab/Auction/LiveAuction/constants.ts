const IS_DEV = process.env.REACT_APP_NETWORK === 'devnet';

export const ENDING_PHASE_DURATION = IS_DEV ? 10 * 60 : 1 * 60 * 60; //? Duration in seconds
