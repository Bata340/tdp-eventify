import { View, Dimensions } from 'react-native';
import Colors from '../constants/Colors';
import { MyEventsList } from './MyEventsList';
import { HeaderUser } from './HeaderUser';
import { useNavigation } from '@react-navigation/native';


export default function MyEvents() {
    const navigation = useNavigation();

    return (
        <View style={{ backgroundColor: Colors.PRIMARY_VERY_DARK_GRAYED, paddingBottom: 100, minHeight:Dimensions.get("window").height }}>
            <MyEventsList/>
        </View>
    );
}