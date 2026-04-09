import { registerRootComponent } from 'expo';
import { getApp } from '@react-native-firebase/app';
import App from './App';
import {Tabby} from 'tabby-react-native-sdk';
import { getMessaging } from '@react-native-firebase/messaging';

Tabby.setApiKey('pk_72b8b107-8a91-4870-bd4b-c96a3ec49d40');


getMessaging(getApp()).setBackgroundMessageHandler(async remoteMessage => {
    console.log('Background message handled:', remoteMessage);
  });

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
