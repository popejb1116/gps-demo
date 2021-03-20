import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, Text, View, StyleSheet, Button } from 'react-native';
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
   console.log('LOCATION SERVICE COMP');
   console.log(location);

   return (
      <LocationView>
         <LocationText>{JSON.stringify(location)}</LocationText>
      </LocationView>
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

   // SINGLE CALL TO LOCATION SERVICE AND location STATE UPDATE
   // KEPT JUST FOR TESTING AT THIS POINT BUT NOT NECESSARY
   // TODO: UPDATE TO KILL ANY ACTIVE SUBSCRIPTIONS
   const handleGetCurrentPosition = async () => {
      console.log('HANDLE GET CURRENT POSITION');
      console.log(locationSubscription.current);
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
               distanceInterval: 0, //
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
                     {subscriptionActive ? (
                        <Button
                           title='stop'
                           onPress={() => handleWatchPosition('stop')}
                        />
                     ) : (
                        <Button
                           title='start'
                           onPress={() => handleWatchPosition('start')}
                        />
                     )}
                     <Button
                        title='single req'
                        onPress={handleGetCurrentPosition}
                     />
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
   justify-content: center;
   align-items: center;
   height: 45%;
   width: 90%;
   border: ${({ theme }) => theme.accent};
   border-radius: 8px;
`;
const LocationView = styled.View`
   background: ${({ theme }) => theme.accent};
   padding: 5%;
   border: white;
   border-radius: 8px;
`;
const LocationText = styled.Text`
   color: white;
`;
const ControlPanelView = styled.View`
   display: flex;
   flex-flow: row nowrap;
   justify-content: flex-start;
   align-items: flex-start;
   height: 45%;
   width: 90%;
   border: ${({ theme }) => theme.accent};
   border-radius: 8px;
`;

export default App;
