import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EventsScreen from './screens/EventsScreen';
import EventQR from './screens/EventQR';
import SettingsScreen from './screens/SettingsScreen';
import WalletScreen from './screens/WalletScreen';
import Colors from './constants/Colors';
import { TouchableOpacity, View } from 'react-native';
import FavoritesScreen from './screens/FavoritesScreen';
import LoginScreen from './screens/LoginScreen';
import { StatusBar } from 'expo-status-bar';
import { GlobalAuthContext, GlobalAuthActionsContext } from './utils/ContextFactory';
import Session from './utils/Session';
import EventDetailScreen from './screens/EventDetailScreen';
import AddEventScreen from './screens/AddEventScreen';
import EventPaymentForm from './screens/EventPaymentForm';
import EditEventScreen from './screens/EditEventScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShowPeople from './screens/ShowPeople';
import MyEventsAndTickets from './screens/MyEventsAndTickets';

function LoginStack() {
  const LoginStack = createNativeStackNavigator();

  return(
    <LoginStack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }} >
      <LoginStack.Screen name="Login" component={LoginScreen} headerShown={false} />
      <LoginStack.Screen name="Register" component={RegisterScreen} headerShown={false} />
    </LoginStack.Navigator>
  )
}

function EventsStack() {
  const EventsStack = createNativeStackNavigator();

  return(
    <EventsStack.Navigator initialRouteName="Events" screenOptions={{ headerShown: false }} >
      <EventsStack.Screen name="Events" component={EventsScreen} headerShown={false} />
      <EventsStack.Screen name="EventDetail" component={EventDetailScreen} headerShown={false} />
      <EventsStack.Screen name="EventPayment" component={EventPaymentForm} options={{ headerShown: false }} />
      <EventsStack.Screen name="EventEdit" component={EditEventScreen} options={{ headerShown: false}}/>
      <EventsStack.Screen name="EventQR" component={EventQR} options={{ headerShown: false}}/>
      <EventsStack.Screen name="ShowPeople" component={ShowPeople} options={{ headerShown: false}}/>
    </EventsStack.Navigator>
  )
}

function AuthenticatedBottomTab() {
  const AuthTab = createBottomTabNavigator();

  const TabBarFloatingButton = (props) => {
    return (
      <View style={{ position: 'relative', alignItems: 'center' }} pointerEvents="box-none">
        <TouchableOpacity style={{ top: -15, borderRadius: 50, backgroundColor: Colors.PRIMARY, height: 60, width: 60, alignItems: 'center', justifyContent: 'center' }} onPress={props.onPress} >
          <Entypo name="plus" color={Colors.WHITE} size={35} style={{ fontWeight: 'bold' }} />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <AuthTab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.PRIMARY,
        tabBarInactiveTintColor: Colors.PRIMARY_VERY_DARK_GRAYED,
        tabBarStyle: {
          elevation: 30,
          backgroundColor: Colors.PRIMARY_DARKER,
          borderTopWidth: 0
        }
      }}
    >
      <AuthTab.Screen
        name="EventsStack"
        component={EventsStack}
        options={{
					tabBarIcon: ({ focused, color, size }) => <AntDesign name={focused ? "appstore1" : "appstore-o"} color={color} size={size} />,
          headerShown: false
				}}
      />
      <AuthTab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
					tabBarIcon: ({ focused, color, size }) => <AntDesign name={focused ? "heart" : "hearto"} color={color} size={size} />,
          headerShown: false
				}}
      />
      <AuthTab.Screen
        name="AddEvent"
        component={AddEventScreen}
        options={{
					tabBarButton: (props) => <TabBarFloatingButton {...props} />,
          headerShown: false
				}}
      />
      <AuthTab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
					tabBarIcon: ({ focused, color, size }) => <Ionicons name={focused ? "wallet" : "wallet-outline"} color={color} size={size} />,
          headerShown: false
				}}
      />
      <AuthTab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
					tabBarIcon: ({ focused, color, size }) => <Ionicons name={focused ? "settings" : "settings-outline"} color={color} size={size} />,
          headerShown: false
				}}
      />
    </AuthTab.Navigator>
  )
}

const MainStack = createNativeStackNavigator();

export default function App() {
  const [appAuthContext, setAppAuthContext] = useState({
		userSession: undefined,
    favorites: []
	});

  useEffect(() => {
    Session.getInstance().load()
    .then(session => {
      setAppAuthContext({
        userSession: session,
        favorites: []
      })
    })
  }, []);

  return (
    <GlobalAuthContext.Provider value={appAuthContext}>
      <GlobalAuthActionsContext.Provider value={setAppAuthContext}>
        <NavigationContainer>
          <MainStack.Navigator>
            {appAuthContext.userSession?.isLoggedIn() ?
              <MainStack.Screen
                name="AuthStack" component={AuthenticatedBottomTab} options={{ headerShown: false }}
              />
            :
              <MainStack.Screen 
                name="LoginStack" component={LoginStack} options={{ headerShown: false }}
              />
            }
          </MainStack.Navigator>
          <StatusBar style="light" />
        </NavigationContainer>
      </GlobalAuthActionsContext.Provider>
    </GlobalAuthContext.Provider>
  );
}
