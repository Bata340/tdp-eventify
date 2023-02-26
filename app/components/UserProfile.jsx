import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useEffect, useState } from "react";
import AppConstants from '../constants/AppConstants';
import UserAvatar from '../components/UserAvatar';
import { useGlobalAuthContext } from '../utils/ContextFactory';

const UserProfile = () => {
  const appAuthContext = useGlobalAuthContext();
  return (
    <View style={styles.container}>
    <UserAvatar size={200} uri={appAuthContext.userSession.getUserAvatar()} />
    <Text style={styles.name}>{appAuthContext.userSession.getUserFullName()}</Text>
    <Text style={styles.email}>{appAuthContext.userSession.getUserEmail()}</Text>
    <Text style={styles.birth_date}>{appAuthContext.userSession.getUserBirthDate()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 5,
  },
  birth_date: {
    fontSize: 16,
    color: 'gray',
  },
});

export default UserProfile;
