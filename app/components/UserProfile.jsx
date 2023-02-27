import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import UserAvatar from '../components/UserAvatar';
import { useGlobalAuthContext } from '../utils/ContextFactory';
import { MyEventsAndTickets } from '../screens/MyEventsAndTickets';
import Colors from '../constants/Colors';
import MyEvents from './MyEvents';

const UserProfile = () => {
  const appAuthContext = useGlobalAuthContext();
  const birthDate = appAuthContext.userSession.getUserBirthDate();
  return (
    <ScrollView>
      <View style={styles.container}>
        <UserAvatar size={200} uri={appAuthContext.userSession.getUserAvatar()} />
        <Text style={styles.name}>{appAuthContext.userSession.getUserFullName()}</Text>
        <Text style={styles.email}>{appAuthContext.userSession.getUserEmail()}</Text>
        <Text style={styles.birth_date}>{birthDate.substr(8,2)+"/"+birthDate.substr(5,2)+"/"+birthDate.substr(0,4)}</Text>
      </View>
      <View style={{minHeight: 400, maxHeight: window.height}}>
        <MyEventsAndTickets/>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 10,
    paddingBottom:0
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.WHITE,
    marginBottom: 5,
  },
  email: {
    fontSize: 25,
    color: "lightgray",
    marginBottom: 5,
  },
  birth_date: {
    fontSize: 16,
    color: 'lightgray',
  },
});

export default UserProfile;
