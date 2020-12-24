import * as React from 'react';
import { 
    View,
    Text,
    FlatList,
    StyleSheet
 } from "react-native";
import { ListItem } from "react-native-elements";
import MyHeader from "../components/MyHeader";
import db from '../config'
import firebase from 'firebase'

export default class MyReceivedItems extends React.Component {
    static navigationOptions = { header: null };

    constructor(){
        super();
        this.state = {
            userId: firebase.auth().currentUser.email,
            receivedItems: [],
        }
        this.requestRef = null
    }

    getReceivedItemsList = () => {
        this.requestRef = db.collection("received_items")
            .where("donor_id" ,'==', this.state.userId)
            .onSnapshot((snapshot)=>{
            var allReceivedItems = snapshot.docs.map(document => document.data());
            this.setState({
                receivedItems : allReceivedItems,
            });
            })
    }

    keyExtractor = (item, index) => {index.toString()}

    renderItem = ( {item, index} ) =>(
        <ListItem
        key={index}
        title={item.object_name}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        bottomDivider
        />
    )

        componentDidMount(){
            this.getReceivedItemsList();
        }

        componentWillUnmount(){
            this.requestRef();
        }

    render(){
        return(
            <View style={{flex:1}}>
                <MyHeader navigation={this.props.navigation} title="My Received Items"/>
                <View style={{flex:1}}>
                {
                    this.state.receivedItems.length === 0
                    ?(
                    <View style={styles.subtitle}>
                        <Text style={{ fontSize: 20}}>No received items</Text>
                    </View>
                    )
                    :(
                    <FlatList
                        keyExtractor={this.keyExtractor}
                        data={this.state.receivedItems}
                        renderItem={this.renderItem}
                    />
                    )
                }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    subtitle: {
        alignSelf: 'center',
        alignItems: 'center',
        marginTop: '50%'
    }
});