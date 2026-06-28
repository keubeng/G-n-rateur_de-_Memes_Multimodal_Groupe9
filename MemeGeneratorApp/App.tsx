import React, { useEffect, useRef } from 'react';
import { Platform, AppState, StatusBar } from 'react-native';
import ReceiveSharingIntent from 'react-native-receive-sharing-intent';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const navigationRef = useRef<any>(null);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    ReceiveSharingIntent.getReceivedFiles(
      (files) => {
        if (!files || files.length === 0) return;
        const item = files[0];

        if (navigationRef.current) {
          if (item.weblink || item.text) {
            navigationRef.current.navigate('SharedContent', {
              sharedText: item.weblink || item.text,
            });
          } else if (item.contentUri || item.filePath) {
            navigationRef.current.navigate('SharedContent', {
              sharedImageUri: item.contentUri || item.filePath,
            });
          }
        }
      },
      (error) => {
        console.log('Erreur Share Intent:', error);
      },
      'MemeGeneratorApp'
    );

    return () => {
      ReceiveSharingIntent.clearReceivedFiles();
    };
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F8FC" />
      <AppNavigator navigationRef={navigationRef} />
    </>
  );
}