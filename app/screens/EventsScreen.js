import { View, Dimensions, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { EventsList } from '../components/EventsList';
import { HeaderUser } from '../components/HeaderUser';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState } from 'react';
import { FavoritesList } from '../components/FavoritesList';


export default function EventsScreen() {
    const [isFaved, setIsFaved] = useState(false)
    const navigation = useNavigation();
    return (
        <View style={{ backgroundColor: Colors.PRIMARY_VERY_DARK_GRAYED, paddingBottom: 100, minHeight:Dimensions.get("window").height }}>
            <HeaderUser navigation={navigation}/>
            
            {
                isFaved ?
                <FavoritesList/>
                :
                <EventsList/>
            }
            
            <TouchableOpacity
                    style={{ borderRadius: 50, backgroundColor: Colors.PRIMARY_DARKER, height: 50, width: 50, alignItems: 'center', alignContent: 'center', justifyContent: 'center', left: '80%', top: '80%', position: 'absolute' }}
                    onPress={()=>{setIsFaved(!isFaved)}}
                    activeOpacity={1}
                >
                    {isFaved ? 
                        <AntDesign name="heart" color={Colors.PRIMARY_DARK} size={23} />
                        :
                        <AntDesign name="hearto" color={Colors.GRAY} size={23} />
                    }
            </TouchableOpacity>
            
            
        </View>
    )
}