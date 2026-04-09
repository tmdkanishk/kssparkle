import React, { useEffect, useState } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { CustomProvider } from './src/hooks/CustomeContext';
import { Alert, Image, Text, View, NativeModules } from 'react-native';
import { LanguageCurrencyProvider } from './src/hooks/LanguageCurrencyContext';
import { CartProvider } from './src/hooks/CartContext';
import { WishlistProvider } from './src/hooks/WishlistContext';
import { LoadingProvider } from './src/hooks/LoadingProvider';
import { UserProvider } from './src/hooks/UserContext';
import BackgroundWrapper from './src/components/customcomponents/BackgroundWrapper';
import { BackgroundReadyProvider } from './src/hooks/BackgroundReadyContext';
// import TamaraSdk from 'react-native-tamara-sdk';
// import { Tabby } from 'tabby-react-native-sdk';






export default function App() {
  // const [isConnected, setIsConnected] = useState(true);
  // useEffect(() => {
  //   const checkConnection = async () => {
  //     const connection = await checkInternetConnection();
  //     setIsConnected(connection);
  //   };
  //   checkConnection();

  //   setInterval(() => { checkConnection() }, 2000); // Check every 5 seconds
  //   // return () => {
  //   //   clearInterval(interval);
  //   // }; 
  //   // Cleanup on unmount
  // }, []);

  // const checkInternetConnection = async () => {
  //   try {
  //     const response = await fetch("https://www.google.com", { method: "HEAD" });
  //     return response.ok;

  //   } catch (error) {
  //     return false;
  //   }
  // };

  // if (!isConnected) {
  //   return (
  //     <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
  //       <View style={{ width: '80%', height: '40%' }}>
  //         <Image source={require('./src/assets/images/internetconnection.png')} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
  //       </View>
  //       <Text style={{ fontSize: 20 }}>No Internet!</Text>
  //       <Text style={{ fontSize: 14, color: 'gray' }}>Please check your internet connection and try again!</Text>
  //     </View>
  //   )
  // }

  //   useEffect(() => {
  //   TamaraSdk.initSdk(
  //     "AUTH_TOKEN",
  //     "API_URL",
  //     "NOTIFICATION_WEBHOOK_URL",
  //     "PUBLISH_KEY",
  //     "NOTIFICATION_TOKEN",
  //     true // sandbox
  //   );
  // }, []);





  const [ready, setReady] = useState(false);


  useEffect(() => {
    async function preload() {
      const assets = [
        require("./src/assets/images/backgroundimage.png"),
      ];

      const promises = assets.map((img) =>
        Image.prefetch(Image.resolveAssetSource(img).uri)
      );

      await Promise.all(promises);
      setReady(true);
    }

    preload();
  }, []);

  // useEffect(() => {
  //   Tabby.setApiKey('pk_test_xxxxxxxxx');
  // }, []);


  if (!ready) {
    // Show loader or splash screen
    return null;
  }


  return (
    // <BackgroundWrapper>

    <LoadingProvider>
      <CustomProvider>
        <LanguageCurrencyProvider>
          <UserProvider>
            <CartProvider>
              <WishlistProvider>
                <AppNavigator />
              </WishlistProvider>
            </CartProvider>
          </UserProvider>
        </LanguageCurrencyProvider>
      </CustomProvider>
    </LoadingProvider>

    // </BackgroundWrapper>



  );

}


