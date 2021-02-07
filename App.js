import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, Text, View, StyleSheet } from 'react-native';
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
   return (
      <LocationView>
         <LocationText>{JSON.stringify(location)}</LocationText>
      </LocationView>
   );
};

const App = () => {
   const [location, setLocation] = useState();
   const [error, setError] = useState(false);

   // GETS LOCATION AND SETS CORRESPONDING STATE
   const getOrUpdateLocation = async () => {
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
   };

   useEffect(() => {
      // REQUEST PERMISSION STATUS
      (async () => {
         let { status } = await Location.requestPermissionsAsync();
         if (status !== `granted`) {
            setError(`Permission to access location was denied`);
            return;
         }
         // IF STATUS IS GRANTED ATTEMPT LOCATION
         getOrUpdateLocation();
      })();
   }, []);

   return (
      <ThemeProvider theme={theme}>
         <AppView>
            {error ? (
               <ErrorComp error={error} />
            ) : (
               <LocationServiceComp location={location} />
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

const LocationView = styled.View`
   display: flex;
   justify-content: center;
   align-items: center;
   height: 50%;
   width: 75%;
   background: ${({ theme }) => theme.accent};
   padding: 5%;
   border: white;
   border-radius: 8px;
`;
const LocationText = styled.Text`
   color: white;
`;

export default App;
