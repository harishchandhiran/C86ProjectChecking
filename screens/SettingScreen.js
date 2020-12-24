import * as React from 'react'
import {  View, 
    Text, 
    StyleSheet, 
    KeyboardAvoidingView, 
    TextInput, 
    TouchableOpacity, 
    Alert } from 'react-native'
import MyHeader from '../components/MyHeader'
import firebase from 'firebase'
import db from '../config'

export default class SettingScreen extends React.Component {
    constructor(){
        super();
        this.state = {
            userId: firebase.auth().currentUser.email,
            emailId: '',
            firstName: '',
            lastName: '',
            address: '',
            contact: '',
            docId: '',
        }
    }

    getUserDetails = async () => {
        db.collection("users").where('email_Id','==',this.state.userId).get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    var data = doc.data();
                    this.setState({
                        emailId: data.email_Id,
                        firstName: data.first_name,
                        lastName: data.last_name,
                        address: data.address,
                        contact: data.contact,
                        docId: doc.id
                    })
                })
            })
    }

    updateUserDetails = async() => {
        db.collection("users").doc(this.state.docId).update({
            "first_name": this.state.firstName,
            "last_name": this.state.lastName,
            "address": this.state.address,
            "contact": this.state.contact
        })
        Alert.alert("Profile updated successfully");
    }

    componentDidMount(){
        this.getUserDetails();
    }

    render(){
        return (
            <View>
                <MyHeader title="Settings" navigation={this.props.navigation}/>
                <View style={styles.formContainer}>
                    <TextInput style={styles.formTextInput} 
                        placeholder={"first name"} 
                        maxLength={12} 
                        onChangeText={(text) => {
                            this.setState({
                                firstName: text
                            })
                        }}
                        value={this.state.firstName}
                         />
                        <TextInput style={styles.formTextInput} 
                        placeholder={"last name"} 
                        maxLength={12} 
                        onChangeText={(text) => {
                            this.setState({
                                lastName: text
                            })
                        }}
                        value={this.state.lastName}
                         />
                        <TextInput style={styles.formTextInput} 
                        placeholder={"contact"} 
                        maxLength={10}
                        keyboardType="number-pad"
                        onChangeText={(text) => {
                            this.setState({
                                contact: text
                            })
                        }}
                        value={this.state.contact}
                         />
                        <TextInput style={styles.formTextInput} 
                        placeholder={"address"} 
                        multiline={true}
                        onChangeText={(text) => {
                            this.setState({
                                address: text
                            })
                        }}
                        value={this.state.address}
                         />
                        <TouchableOpacity style={styles.button} 
                            onPress={() => {
                                this.updateUserDetails();
                            }} >
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container : {
      flex:1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    formContainer:{
      flex:1,
      width:'100%',
      alignItems: 'center'
    },
    formTextInput:{
      width:"75%",
      height:35,
      alignSelf:'center',
      borderColor:'#ffab91',
      borderRadius:10,
      borderWidth:1,
      marginTop:20,
      padding:10,
    },
    button:{
      width:"75%",
      height:50,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:10,
      backgroundColor:"#ff5722",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8,
      },
      shadowOpacity: 0.44,
      shadowRadius: 10.32,
      elevation: 16,
      marginTop:20
    },
    buttonText:{
      fontSize:25,
      fontWeight:"bold",
      color:"#fff"
    }
})