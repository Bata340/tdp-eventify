import React from 'react';
import { useWindowDimensions, View, StyleSheet, StatusBar } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import MyEvents from '../components/MyEvents';
import MyTickets from '../components/MyTickets';
import Colors from '../constants/Colors';


const styles = StyleSheet.create({
    scene: {
      flex: 1,
    },
    container: {
        paddingTop: StatusBar.currentHeight,
        backgroundColor: Colors.PRIMARY_DARK
    },
    indicator: {
        backgroundColor: Colors.PRIMARY_DARKER
    }
  });


const MyEventsAndTickets = () => {

    const MyTicketsTab = () => (
        <MyTickets/>
    );
      
    const MyEventsTab = () => (
        <MyEvents/>
    );
      
    const renderScene = SceneMap({
        first: MyEventsTab,
        second: MyTicketsTab,
    });

    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'Mis Eventos' },
        { key: 'second', title: 'Mis Tickets' },
    ]);


    const renderTabBar = props => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'white' }}
            style={{ backgroundColor: Colors.PRIMARY_DARKER }}
        />
    );

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            style={styles.container}
            renderTabBar = {renderTabBar}
            
        />
    );
};

export default MyEventsAndTickets;