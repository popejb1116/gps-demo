import React, { useRef, useEffect } from 'react';
import { Animated, View } from 'react-native';
import styled from 'styled-components/native';

export const FadeInView = (props) => {
   const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

   React.useEffect(() => {
      Animated.timing(fadeAnim, {
         toValue: 1,
         duration: 10000,
         useNativeDriver: true,
      }).start();
   }, [fadeAnim]);

   return (
      <Animated.View // Special animatable View
         style={{
            ...props.style,
            opacity: fadeAnim, // Bind opacity to animated value
         }}
      >
         {props.children}
      </Animated.View>
   );
};
