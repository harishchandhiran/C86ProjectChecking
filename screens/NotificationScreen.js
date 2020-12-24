import React, {Component} from 'react';
import { View, 
    Text, 
    FlatList, 
    TouchableOpacity, 
    StyleSheet } from "react-native";
import { ListItem,Icon } from 'react-native-elements';
import MyHeader from "../components/MyHeader";
import firebase from "firebase";
import db from "../config";
import SwipeableFlatList from '../components/SwipeableFlatList';

export default class NotificationScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: firebase.auth().currentUser.email,
            allNotifications: []
        }
        this.notificationRef = null;
    }

    getAllNotifications = () => {
        this.notificationRef = db.collection("all_notifications")
            .where("notification_status","==","unread")
            .where("targeted_user_id","==",this.state.userId)
            .onSnapshot((snapshot) => {
                var allNotifications = [];
                snapshot.docs.map((doc) => {
                    var notification = doc.data();
                    notification["doc_id"] = doc.id;
                    allNotifications.push(notification);
                })
                this.setState({
                    allNotifications: allNotifications
                })
            })
    }

    keyExtractor = (item,index) => index.toString()

    renderItem = ({item,index}) => {
        return (
            <ListItem 
                leftElement={<Icon name="book" type="font-awesome" color ='#696969'/>}
                key={index}
                title={item.message + " the " + item.item_name}
                titleStyle={{ color: 'black', fontWeight: 'bold',fontSize: 13 }}
                bottomDivider />
        )
    }

    componentDidMount(){
        this.getAllNotifications();
    }

    componentWillUnmount(){
        this.notificationRef
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={{flex:0.1}}>
                    <MyHeader title={"Notifications"} navigation={this.props.navigation}/>
                </View>
                <View style={{flex: 0.9}}>
                    {
                        this.state.allNotifications.length === 0
                        ?(
                            <View style={{flex:1, justifyContent: "center",alignItems: "center"}}>
                                <Text style={{fontSize: 25}}>You have no notifications</Text>
                            </View>
                        )
                        :(
                            <SwipeableFlatList 
                                allNotifications={this.state.allNotifications} 
                             />
                        )
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container : {
      flex : 1
    }
})

/* leftElement={<Icon name="book" type="font-awsome" color="#696969" />}
                title = {data.item.message + " the " + data.item.item_name}
                titleStyle={{ color:"black", fontWeight: 'bold', fontSize: 13 }}
                bottomDivider */