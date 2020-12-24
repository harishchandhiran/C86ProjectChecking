import * as React from 'react'
import { View,Text,FlatList,StyleSheet, TouchableOpacity } from 'react-native'
import { ListItem,Icon } from 'react-native-elements'
import MyHeader from "../components/MyHeader"
import firebase from "firebase"
import db from "../config";

export default class DonateScreen extends React.Component {
    constructor(){
        super();
        this.state = {
            allRequests: []
        }
        this.requestRef = null
    }

    getRequestList = () => {
        this.requestRef = db.collection("requested_objects")
            .onSnapshot((snapshot) => {
                var requestedObjectList = snapshot.docs.map(doc => doc.data())
                this.setState({ allRequests:requestedObjectList })
            })
    }

    componentDidMount(){
        this.getRequestList();
    }

    componentWillUnmount(){
        this.requestRef();
    }

    keyExtractor = (item,index) => index.toString()

    renderItem = ({ item, i }) => {
        return (
            <ListItem 
                key={i} 
                title={item.object_name}
                titleStyle={{ color: 'orange',fontWeight: 'bold' }}
                subtitle={item.reason_to_request}
                rightElement={
                    <TouchableOpacity style={styles.button}
                    onPress ={()=>{
                        this.props.navigation.navigate("ReceiverDetails",{"details": item})
                      }}
                    >
                        <Text style={{ color: 'white' }}>View</Text>
                    </TouchableOpacity>
                }
                bottomDivider
             />
        )
    }

    render(){
        return (
            <View style={{ flex: 1 }}>
                <MyHeader title="Donate Screen" navigation ={this.props.navigation}/>
                <View style={{ flex: 1 }}>
                    {
                        this.state.allRequests.length===0
                        ?
                        (
                            <View style={styles.subContainer}>
                                <Text style={{ fontSize: 20,textAlign: 'center',marginTop: 100 }}>
                                    No requests found
                                </Text>
                            </View>
                        )
                        : 
                        (
                            <FlatList 
                                keyExtractor={this.keyExtractor} 
                                data={this.state.allRequests}
                                renderItem={this.renderItem} />
                        )
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    button:{
        width:100,
        height:30,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:"#ff5722",
        shadowColor: "#000",
        shadowOffset: {
           width: 0,
           height: 8
        }
    }
})