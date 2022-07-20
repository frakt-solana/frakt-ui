import * as amplitude from '@amplitude/analytics-browser';

import { AMP_API_KEY } from './constants';

export const initAmplitude = (): void => {
  amplitude.init(AMP_API_KEY);
};

export const setAmplitudeUserDevice = (installationToken: string): void => {
  amplitude.setDeviceId(installationToken);
};

export const setAmplitudeUserId = (userId: string): void => {
  amplitude.setUserId(userId);
};

export const sendAmplitudeData = (
  eventType: string,
  eventProperties?: unknown,
): void => {
  amplitude.track(eventType, eventProperties);
};
