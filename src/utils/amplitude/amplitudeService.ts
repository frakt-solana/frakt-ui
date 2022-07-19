import amplitude from 'amplitude-js';

import { AMP_API_KEY } from './constants';

export const initAmplitude = (): void => {
  amplitude.getInstance().init(AMP_API_KEY, null, {
    saveEvents: true,
    includeUtm: true,
    includeReferrer: true,
  });
};

export const setAmplitudeUserDevice = (installationToken: string): void => {
  amplitude.getInstance().setDeviceId(installationToken);
};

export const setAmplitudeUserId = (userId: string): void => {
  amplitude.getInstance().setUserId(userId);
};

export const setAmplitudeUserProperties = (properties: unknown): void => {
  amplitude.getInstance().setUserProperties(properties);
};

export const sendAmplitudeData = (
  eventType: string,
  eventProperties?: unknown,
): void => {
  amplitude.getInstance().logEvent(eventType, eventProperties);
};
