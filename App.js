import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
   Platform,
   Image,
   Text,
   View,
   StyleSheet,
   TouchableOpacity,
} from 'react-native';
import * as Location from 'expo-location';
import styled, { ThemeProvider } from 'styled-components/native';
import { FadeInView } from './components/FadeInView';

// GLOBAL THEME PROP FOR USE IN STYLED COMPONENTS
const theme = {
   primary: 'rgba(23, 80, 54, 1.0)',
   accent: 'rgba(193, 175, 108, 1.0)',
   error: 'rgba(255, 0, 0, 0.8)',
};

// ERROR COMPONENT
const ErrorComp = ({ error }) => {
   return (
      <ErrorView>
         <ErrorText>{error}</ErrorText>
      </ErrorView>
   );
};

// LOCATION COMPONENT
const LocationServiceComp = ({ location }) => {
   return (
      <>
         <LocationView>
            <LocationText infoType={'speed'}>
               Speed: {location.coords.speed.toFixed(2)} M/s
            </LocationText>
         </LocationView>
         <LocationView>
            <LocationText>
               Altitude: {location.coords.altitude.toFixed(2)} M (GWS 84)
            </LocationText>
         </LocationView>
         <LocationView>
            <LocationText>Timestamp: {Date(location.timestamp)}</LocationText>
         </LocationView>
      </>
   );
};

const App = () => {
   const [splash, setSplash] = useState(false);
   // OBJECT WHICH HOLDS THE LOCATION INFORMATION RETURNED FROM expo-location PACKAGE
   const [location, setLocation] = useState(false);
   // GENERIC ERROR STATE FOR HOLDING ANY AND ALL ERRORS WHICH MAY OCCUR
   const [error, setError] = useState(false);
   // SIGNIFIES USER HAS PRESSED START/STOP AND IS ACTIVELY RECEIVING LOCATION UPDATES
   const [subscriptionActive, setSubscriptionActive] = useState(false);
   // HOLDS TIMER WHICH CALLS LOCATION API
   const locationTimerRef = useRef();

   // SINGLE CALL TO LOCATION SERVICE AND location STATE UPDATE
   const getCurrentLocation = async () => {
      try {
         let location = await Location.getCurrentPositionAsync({});
         setLocation(location);
         // console.log('GET CURRENT LOCATION ERROR');
      } catch (error) {
         setError(error);
         // console.log('GET CURRENT LOCATION ERROR');
      }
   };

   const start = () => {
      console.log(`start`);
      setSubscriptionActive(true);
      locationTimerRef.current = setInterval(() => {
         getCurrentLocation();
      }, 2500);
   };

   const stop = () => {
      console.log(`stop`);
      setSubscriptionActive(true);
      clearInterval(locationTimerRef.current);
   };

   useEffect(() => {
      // REQUEST PERMISSION STATUS
      const callLocationAPI = async () => {
         let { status } = await Location.requestPermissionsAsync();
         if (status !== 'granted') {
            setError('Permission to access location was denied');
            return;
         }
      };
      callLocationAPI();

      // setTimeout(() => {
      //    setSplash(false);
      // }, 2000);
   }, []);

   return (
      <ThemeProvider theme={theme}>
         <AppView>
            {error ? (
               <ErrorComp error={error} />
            ) : splash ? (
               <FadeInView
                  style={{
                     width: 400,
                     height: 400,
                     backgroundColor: 'powderblue',
                  }}
               >
                  <SplashImg source={require('./images/splash.jpeg')} />
               </FadeInView>
            ) : (
               <>
                  <FadeInView
                     style={{
                        width: 400,
                        height: 400,
                        backgroundColor: 'powderblue',
                     }}
                  >
                     <SplashImg source={require('./images/splash.jpeg')} />
                  </FadeInView>
                  {/* <DashboardView>
                     {location && <LocationServiceComp location={location} />}
                  </DashboardView>
                  <ControlPanelView>
                     {!subscriptionActive ? (
                        <ButtonToucOpac onPress={start}>
                           <ButtonText type='single'>START</ButtonText>
                        </ButtonToucOpac>
                     ) : (
                        <ButtonToucOpac onPress={stop}>
                           <ButtonText type='single'>STOP</ButtonText>
                        </ButtonToucOpac>
                     )}
                  </ControlPanelView> */}
               </>
            )}
         </AppView>
      </ThemeProvider>
   );
};

// GLOBAL APP WRAPPER
const AppView = styled.View`
   flex: 1;
   background: ${({ theme }) => theme.primary}
   align-items: center;
   justify-content: center;
`;
const ErrorView = styled.View`
   display: flex;
   justify-content: center;
   align-items: center;
   height: 20%;
   width: 50%;
   background: ${({ theme }) => theme.error};
   padding: 5%;
   border-radius: 8px;
`;
const ErrorText = styled.Text`
   color: white;
`;
const SplashView = styled.View`
   display: flex;
   justify-content: space-around;
   align-items: center;
   height: 99%;
   width: 99%;
   background: lightgrey;
`;
const SplashImg = styled.Image`
   width: 300px;
   height: 300px;
`;

const DashboardView = styled.View`
   display: flex;
   justify-content: space-around;
   align-items: center;
   height: 45%;
   width: 90%;
`;
const LocationView = styled.View`
   background: ${({ theme }) => theme.accent};
   width: 90%;
   padding: 5%;
   border: white;
   border-radius: 8px;
`;
const LocationText = styled.Text`
   color: white;
   font-size: ${({ infoType }) => (infoType === 'speed' ? '35px' : '15px')};
`;
const ControlPanelView = styled.View`
   display: flex;
   flex-flow: row nowrap;
   justify-content: space-around;
   align-items: center;
   height: 45%;
   width: 90%;
`;
const ButtonToucOpac = styled.TouchableOpacity`
   display: flex;
   justify-content: center;
   align-items: center;
   background: ${({ theme }) => theme.accent};
   height: 150px;
   width: 150px;
   border-radius: 300px;
`;
const ButtonText = styled.Text`
   color: ${({ type }) =>
      type === 'start' ? 'green' : type === 'stop' ? 'red' : 'white'};
   font-size: 25px;
   font-weight: bold;
   text-align: center;
`;

export default App;
