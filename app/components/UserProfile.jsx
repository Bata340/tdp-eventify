import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import UserAvatar from '../components/UserAvatar';
import { useGlobalAuthContext } from '../utils/ContextFactory';
import MyEventsAndTickets from '../screens/MyEventsAndTickets';

const UserProfile = () => {
  const appAuthContext = useGlobalAuthContext();
  return (
    <ScrollView>
      <View style={styles.container}>
      <UserAvatar size={200} uri={appAuthContext.userSession.getUserAvatar()} />
      <Text style={styles.name}>{appAuthContext.userSession.getUserFullName()}</Text>
      <Text style={styles.email}>{appAuthContext.userSession.getUserEmail()}</Text>
      <Text style={styles.birth_date}>{appAuthContext.userSession.getUserBirthDate()}</Text>
      </View>
      <MyEventsAndTickets />
    </ScrollView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 10
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
    marginBottom: 5,
  },
  email: {
    fontSize: 25,
    color: 'gray',
    marginBottom: 5,
  },
  birth_date: {
    fontSize: 16,
    color: 'gray',
  },
});

export default UserProfile;
