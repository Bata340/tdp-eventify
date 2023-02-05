import React from 'react';
import { Text, View } from 'react-native';
import Colors from '../constants/Colors';

export default   function ScreenSubtitle({ title = "Screen" }) {
  return (
      <View style={{ width: '100%', alignItems: 'center', marginBottom:10}}>
          <Text style={{ color: Colors.WHITE, fontWeight: 'bold', fontSize: 27 }}>{title}</Text>
      </View>
  )
}
