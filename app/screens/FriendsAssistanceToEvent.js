import React from 'react'
import { Dimensions, ScrollView, View, TouchableHighlight } from 'react-native';
import { UsersList } from '../components/UsersList';
import Colors from '../constants/Colors';
import ScreenTitle from '../components/ScreenTitle';
import Ionicons from '@expo/vector-icons/Ionicons';
const EventifyLogo = require('../assets/eventify-logo.png');




export const FriendsAssistanceToEvent = ({route, usuarios, showButtons = true, navigation}) => {
    return (
      <View style={{ backgroundColor: Colors.PRIMARY_VERY_DARK, paddingBottom: 50, paddingTop: 100, height: Dimensions.get("window").height}}>
        <View>
            <TouchableHighlight
                style={{ position: 'absolute', top: -30, left: 20, zIndex: 100, borderRadius: 30 }}
                activeOpacity={1}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="chevron-back" color={Colors.WHITE} size={32} />
            </TouchableHighlight>
        </View>
        <View style={{marginTop:20}}>
            <ScreenTitle title={"Amigos que asisten..."} />
        </View>
        <ScrollView >
            <UsersList usuarios={usuarios} route={route} showButtons={showButtons} />
        </ScrollView>
      </View>
    );
  }