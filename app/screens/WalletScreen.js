import React from 'react';
import { View } from 'react-native';
import { PaymentCard } from '../components/PaymentCard';
import { PaymentList } from '../components/PaymentList';
import { SaldoCard } from '../components/SaldoCard';
import ScreenTitle from '../components/ScreenTitle';
import Colors from '../constants/Colors';

export default function WalletScreen({ route, navigaton }) {

    return (
        <View style={{ width: '100%', paddingTop: 50, height: '100%', backgroundColor: Colors.PRIMARY_VERY_DARK_GRAYED, alignContent: 'center' }}>
            <ScreenTitle title="Billetera" />
            <SaldoCard/>
            <PaymentList/>
        </View>
    )
}