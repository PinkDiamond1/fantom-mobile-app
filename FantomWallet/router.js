import React from 'react';
import { StackNavigator, createStackNavigator } from 'react-navigation';

import SplashScreen from './src/views/splashScreen/';
import WalletSetup from './src/views/walletSetup/';
import PrivacyPolicy from './src/views/privacyPolicy/index';
import TermsConditions from './src/views/termsConditions/index';
import CaptionOutput from './src/views/captionOutput/index';
import HomeScreen from './src/views/homeScreen/';
import CaptchaVerification from './src/views/captchaVerification/index';
import AddressBook from './src/views/homeScreen/settings/addressBook/'
import QRScanner from './src/views/qr/scanner/view';
import QRGenerator from './src/views/qr/generator/';
import EditContact from './src/views/editContact/index';
import SendMoney from './src/component/sendMoney/index';
import Settings from './src/views/homeScreen/settings/index';
import AboutApp from './src/views/homeScreen/settings/aboutApp/index';
import CustomerSupport from './src/views/homeScreen/settings/customerSupport/index';
import RecoverWallet from './src/views/recoverWallet/';
import WalletImported from './src/views/WalletImported';
const Routing = createStackNavigator({
    SplashScreen: { screen: SplashScreen },
    WalletSetup: {
        screen: WalletImported,
import WalletInfo from './src/views/WalletInfo'
const Routing = createStackNavigator({
    SplashScreen: { screen: SplashScreen },
    WalletSetup: {
        screen: WalletInfo,
        navigationOptions: {
            gesturesEnabled: false,
        },
    },
    Terms: { screen: TermsConditions },
    PrivacyPolicy: { screen: PrivacyPolicy },
    CaptionOutput: { screen: CaptionOutput },
    HomeScreen: {
        screen: HomeScreen,
        navigationOptions: {
            gesturesEnabled: false,
        },
    },
    CaptchaVerification: { screen: CaptchaVerification },
    WalletImported: { screen: WalletImported },
    WalletInfo: { screen: WalletInfo },
    AddressBook: { screen: AddressBook },
    QRScanner: { screen: QRScanner },
    QRGenerator: { screen: QRGenerator },
    EditContact: { screen: EditContact },
    SendMoney: { screen: SendMoney },
    Settings: { screen: Settings },
    AboutApp: { screen: AboutApp },
    CustomerSupport: { screen: CustomerSupport },
    RecoverWallet:{screen: RecoverWallet},
},
    {
        headerMode: 'none',
    });

export default class Router extends React.Component {
    render() {
        return (
            <Routing />
        );
    }
}
