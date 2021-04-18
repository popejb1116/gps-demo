import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
   Platform,
   Text,
   View,
   StyleSheet,
   TouchableOpacity,
} from 'react-native';
import * as Location from 'expo-location';
import styled, { ThemeProvider } from 'styled-components/native';

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
   // console.log('LOCATION SERVICE COMP');
   // console.log(location);

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
   // OBJECT WHICH HOLDS THE LOCATION INFORMATION RETURNED FROM expo-location PACKAGE
   const [location, setLocation] = useState(false);
   // GENERIC ERROR STATE FOR HOLDING ANY AND ALL ERRORS WHICH MAY OCCUR
   const [error, setError] = useState(false);
   // HOLDS SUBCRIPTION TO LOCATION UPDATES
   const locationSubscription = useRef();
   const [subscriptionActive, setSubscriptionActive] = useState(false);

   const locationTimerRef = useRef();

   const start = () => {
      console.log(`start`);
      locationTimerRef.current = setInterval(() => {
         // console.log(`interval`);
         handleGetCurrentPosition();
      }, 3000);
   };

   const stop = () => {
      console.log(`stop`);
      clearInterval(locationTimerRef.current);
   };

   // SINGLE CALL TO LOCATION SERVICE AND location STATE UPDATE
   // KEPT JUST FOR TESTING AT THIS POINT BUT NOT NECESSARY
   // TODO: UPDATE TO KILL ANY ACTIVE SUBSCRIPTIONS
   const handleGetCurrentPosition = async () => {
      console.log('HANDLE GET CURRENT POSITION');
      // console.log(locationSubscription.current);
      console.log('*****\n\n');
      try {
         let location = await Location.getCurrentPositionAsync({});
         console.log(location);
         console.log('*****\n\n');
         setLocation(location);
      } catch (error) {
         console.log('GET CURRENT POSITION ERROR');
         setError(error);
      }
   };

   // START/STOP WATCH LOCATION
   const handleWatchPosition = async (action) => {
      console.log('HANDLE WATCH POSITION');

      switch (action) {
         case 'start':
            // CREATE LOCATION SUBSCRIPTION AND GET REGULAR LOCATION UPDATES
            console.log('CREATE LOCATION SUBSCRIPTION');
            console.log('*****\n\n');
            // OPTIONS PASSED WHEN MAKING SUBSCRIPTION
            let options = {
               accuracy: Location.Accuracy.Highest,
               timeInterval: 1000, // ms
               distanceInterval: 1, // UPDATE EVERY METER
               mayShowUserSettingsDialog: false, // ANDROID ONLY - REQ ADDITIONAL HARDWARE FOR BETTER ACCURACY
            };
            // ACTUAL SUBSCRIPTION TO LOCATION SERVICE
            try {
               locationSubscription.current = await Location.watchPositionAsync(
                  options,
                  (location) => {
                     console.log(`LOCATION CALLBACK`);
                     console.log(location);
                     console.log('*****\n\n');
                     setLocation(location);
                     setSubscriptionActive(true);
                  }
               );
            } catch (error) {
               console.log('GET LOCATION SUBSCRIPTION ERROR');
               setError(error);
            }

            break;
         case 'stop':
            // CANCEL SUBSCRIPTION AND STOP GETTING LOCATION UPDATES
            console.log('TERMINATE LOCATION SUBSCRIPTION');
            console.log('*****\n\n');
            locationSubscription.current.remove();
            setSubscriptionActive(false);
            break;
         default:
            console.log('UNKNOWN ACTION');
            break;
      }
   };

   useEffect(() => {
      // REQUEST PERMISSION STATUS
      // TODO: CONVERT TO NAMED FUNC FOR READABILITY
      (async () => {
         let { status } = await Location.requestPermissionsAsync();
         if (status !== 'granted') {
            setError('Permission to access location was denied');
            return;
         }
      })();
   }, []);

   return (
      <ThemeProvider theme={theme}>
         <AppView>
            {error ? (
               <ErrorComp error={error} />
            ) : (
               <>
                  <DashboardView>
                     {location && <LocationServiceComp location={location} />}
                  </DashboardView>
                  <ControlPanelView>
                     {/* {subscriptionActive ? (
                        <ButtonToucOpac
                           onPress={() => handleWatchPosition('stop')}
                        >
                           <ButtonText type='stop'>STOP</ButtonText>
                        </ButtonToucOpac>
                     ) : (
                        <ButtonToucOpac
                           onPress={() => handleWatchPosition('start')}
                        >
                           <ButtonText type='start'>START</ButtonText>
                        </ButtonToucOpac>
                     )} */}
                     {/* <ButtonToucOpac onPress={handleGetCurrentPosition}>
                        <ButtonText type='single'>SINGLE READING</ButtonText>
                     </ButtonToucOpac> */}
                     <ButtonToucOpac onPress={start}>
                        <ButtonText type='single'>START</ButtonText>
                     </ButtonToucOpac>
                     <ButtonToucOpac onPress={stop}>
                        <ButtonText type='single'>STOP</ButtonText>
                     </ButtonToucOpac>
                  </ControlPanelView>
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
const DashboardView = styled.View`
   display: flex;
   justify-content: space-around;
   align-items: center;
   height: 45%;
   width: 90%;
   /* border: ${({ theme }) => theme.accent}; */
   /* border-radius: 8px; */
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
   /* border: ${({ theme }) => theme.accent}; */
   /* border-radius: 8px; */
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
