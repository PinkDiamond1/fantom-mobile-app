import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import { connect } from 'react-redux';
const Web3 = require('web3');

import NavigationTab from '../../views/homeScreen/navigationTab/';
import Header from '../../general/header/';

import fantomIcon from '../../images/fantomWhiteIcon.png';
import secondaryIcon from '../../images/icon.png';
import leftIcon from '../../images/notification_red.png';
import settingIcon from '../../images/setting.png';
import { SUCCESS, RECEIVED, SENT, FAILED, ETHER_TYPE, FANTOM_TYPE } from '../../common/constants/';


/**
 *  This is the Home Screen for App.
 */
class TransactionEntity extends Component {

    constructor(props) {
        super(props);
        this.state = {
            balance: '0',
            transactionData: [],
            isLoading: true,
            walletType: ETHER_TYPE
        }
        this.loadTransactionData = this.loadTransactionData.bind(this);
        //  this.state.fantomTransactionArr = this.getTransactionsFromApiAsync(this.getPublicKey());
        if (this.props.publicKey) {
            this.getWalletBalance(this.props.publicKey, this.state.walletType);
            // this.getEtherBalanceFromApiAsync(this.props.publicKey);
            this.getTransactionsFromApiAsync(this.props.publicKey);
        }
    }

    ////////////////////////////////////

    getWalletBalance(address, walletType) {
        if (walletType === ETHER_TYPE) {
            this.getEtherBalanceFromApiAsync(address);
        } else if (walletType === FANTOM_TYPE) {
            this.getFantomBalanceFromApiAsync(address);
        }
    }

    /**
     * getFantomBalanceFromApiAsync() :  Api to fetch wallet balance for given address of Fantom own endpoint.
     * @param { String } address : address to fetch wallet balance.
     */
    getFantomBalanceFromApiAsync(address) {
        let dummyAddress = 0xFD00A5fE03CB4672e4380046938cFe5A18456Df4;
        return fetch('http://18.221.128.6:8080/account/'+dummyAddress)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('from fantom own wallet , balance response : ', responseJson);
                if (responseJson && responseJson.balance) {
                    const balance = responseJson.balance;
                    console.log('balance: ', balance);
                    // const valInEther = Web3.utils.fromWei(balance, 'ether');
                    // console.log('valInEther: ', valInEther);
                    // this.setState({
                    //     balance: valInEther,
                    // })
                }
                return responseJson;
            })
            .catch((error) => {
                
                console.error(error);
            });
    }



    //////////////////////////////

    /**
     * getEtherBalanceFromApiAsync() :  Api to fetch Ether wallet balance for given address.
     * @param { String } address : address to fetch wallet balance.
     */
    getEtherBalanceFromApiAsync(address) {
        return fetch('https://api-ropsten.etherscan.io/api?module=account&action=balance&address=' + address + '&tag=latest&apikey=WQ1D9TBEG4IWFNGZSX3YP4QKXUI1CVAUBP')
            .then((response) => response.json())
            .then((responseJson) => {
                console.warn('from ether , balance response : ', responseJson);
                if (responseJson.status && responseJson.status === "1") {
                    const balance = responseJson.result;
                    const valInEther = Web3.utils.fromWei(balance, 'ether');
                    this.setState({
                        balance: valInEther,
                    })
                }
                return responseJson;
            })
            .catch((error) => {
                console.error(error);
            });
    }

    /**
     * getTransactionsFromApiAsync():  Api to fetch transactions for given address.
     * @param {String} address : address to fetch transactions.
     */
    getTransactionsFromApiAsync(address) {
        const dummyAddress = '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae';
        fetch('http://api-ropsten.etherscan.io/api?module=account&action=txlist&address=' + address + '&startblock=0&endblock=99999999&sort=asc&apikey=WQ1D9TBEG4IWFNGZSX3YP4QKXUI1CVAUBP')
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('response of dummyAddress', responseJson);
                if (responseJson && responseJson.result && responseJson.result.length) {
                    this.loadTransactionData(responseJson);
                } else {
                    this.setState({
                        isLoading: false,
                    });
                }
                return responseJson;
            })
            .catch((error) => {
                console.error(error);
                this.setState({
                    isLoading: false,
                });
            });
    }

    /**
     * loadTransactionData() :  Function to create array of objects from response of Api calling for storing transactions.
     * @param {*} responseJson : Json of transaction response data from Api.
     */
    loadTransactionData(responseJson) {
        let transactionData = [];
        // let publicKey = '0x4d8868F7d7581d770735821bb0c83137Ceaf18FD'.toLowerCase();
        let publicKey = this.props.publicKey.toLowerCase();
        console.log('my key : ', publicKey)
        let type = '';
        let transactionId = '';
        for (let data of responseJson.result) {

            if (publicKey === data.from.toLowerCase()) {
                type = SENT;
                transactionId = data.to;
            } else if (publicKey === data.to.toLowerCase()) {
                type = RECEIVED;
                transactionId = data.from;
            }
            transactionStatus = (data.isError === "0") ? SUCCESS : FAILED;
            if (publicKey === data.from || publicKey === data.to) {
                const value = data.value;
                const valInEther = Web3.utils.fromWei(value, 'ether');

                transactionData.push({
                    type: type,
                    amount: valInEther,
                    transactionId: transactionId,
                    transactionStatus: transactionStatus,
                    amountUnit: 'FTM',
                    from: data.from,
                    to: data.to,
                    isError: data.isError
                });
            }
        }
        transactionData = transactionData.reverse();
        this.setState({
            transactionData,
            isLoading: false,
        });
    }

    /**
     * onRefresh() :  To reload the transaction data on page refresh.
     */
    onRefresh() {
        if (this.props.publicKey && !this.props.isLoading) {
            this.setState({
                isLoading: true,
            })
            this.getEtherBalanceFromApiAsync(this.props.publicKey);
            this.getTransactionsFromApiAsync(this.props.publicKey);
        }
    }

    onRightIconPress() {
        this.props.navigation.navigate('Settings');
    }

    render() {
        const { balance, transactionData, isLoading } = this.state;
        return (
            <View style={{ flex: 1, }}>
                <StatusBar barStyle="light-content" />
                <Header text='FANTOM'
                    rightButtonIcon={settingIcon}
                    headerStyle={{ backgroundColor: '#EEBD12', }}
                    onRightIconPress={this.onRightIconPress.bind(this)}
                    fantomIcon={fantomIcon}
                    secondaryButtonIcon={secondaryIcon}
                    leftButtonIcon={leftIcon}
                />
                <NavigationTab
                    navigation={this.props.navigation}
                    balance={balance}
                    transactionData={transactionData}
                    isLoading={isLoading}
                    onRefresh={this.onRefresh.bind(this)}
                />
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        publicKey: state.keyReducer.publicKey,
    };
},
    mapDispatchToProps = (dispatch) => {
        return {
        };
    };


export default connect(mapStateToProps, mapDispatchToProps)(TransactionEntity);