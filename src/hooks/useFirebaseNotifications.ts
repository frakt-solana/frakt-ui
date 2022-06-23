import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

import { selectWalletPublicKey } from '../state/common/selectors';
import { commonActions } from '../state/common/actions';

const firebaseConfig = {
  apiKey: process.env.FCM_API_KEY,
  authDomain: process.env.FCM_AUTH_DOMAIN,
  databaseURL: process.env.FCM_DATABASE_URL,
  projectId: process.env.FCM_PROJECT_ID,
  storageBucket: process.env.FCM_STORAGE_BUCKET,
  messagingSenderId: process.env.FCM_MESSSAGING_SENDER_ID,
  appId: process.env.FCM_APP_ID,
  measurementId: process.env.FCM_MEASUREMENT_ID,
};

export const useFirebaseNotifications = (): void => {
  const dispatch = useDispatch();
  const walletPublicKey = useSelector(selectWalletPublicKey);
  useEffect(() => {
    if (walletPublicKey && dispatch) {
      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);
      getToken(messaging, { vapidKey: process.env.FCM_VAPID }).then((token) => {
        dispatch(commonActions.sendFcmToken(token));
      });
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/firebase-messaging-sw.js')
          .then(() => {})
          .catch(() => {});
      }
    }
  }, [walletPublicKey, dispatch]);
};
