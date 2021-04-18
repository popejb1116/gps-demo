import React, { useRef, useEffect } from 'react';
import { Animated, View } from 'react-native';
import styled from 'styled-components/native';

export const SplashImage = (props) => {
   const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

   React.useEffect(() => {
      Animated.timing(fadeAnim, {
         toValue: 1,
         duration: 2500,
         useNativeDriver: true,
      }).start();
   }, [fadeAnim]);

   return (
      <Animated.Image
         source={require('../images/splash.jpeg')}
         style={{
            opacity: fadeAnim, // Bind opacity to animated value
            width: 300,
            height: 300,
         }}
      />
   );
};
