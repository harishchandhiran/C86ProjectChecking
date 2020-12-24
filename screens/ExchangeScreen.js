import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert} from 'react-native'
import db from '../config'
import firebase from 'firebase'
import MyHeader from '../components/MyHeader'

export default class ExchangeScreen extends Component {
    constructor(){
        super();
        this.state = {
            userId : firebase.auth().currentUser.email,
            userName: '',
            objectName: '',
            reasonToRequest:'',
            requestStatus: '',
            IsExchangeRequestActive: '',
            docId: '',
            requestId: '',
            requestedObjectName: '',
        }
    }

    createUniqueId(){
        return Math.random().toString(36).substring(7);
    }

    receivedObjects = async (objectName) => {
      var userId = this.state.userId;
      var requestId = this.state.requestId;
      db.collection("received_objects").add({
        "user_id": userId,
        "object_name": objectName,
        "request_id": requestId,
        "object_status": "received"
      })
      this.setState({
        IsExchangeRequestActive : false
    })
    }

    getIsExchangeRequestActive = async() => {
      db.collection("users").where("email_Id","==",this.state.userId).get()
        .then((snapshot) => {
          snapshot.forEach((doc) =>{
            this.setState({
              IsExchangeRequestActive : doc.data().IsExchangeRequestActive,
              docId: doc.id
            })
          })
        })
    }

    updateObjectRequestStatus = async() => {
      //Updating the object status after receiving the book.
      db.collection("requested_objects").where("request_id","==",this.state.requestId).get().update({
        "request_status" : "received"
      })
      //Getting the docId to update the user doc
      db.collection("users").where("email_Id","==",this.state.userId).get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            db.collection("users").doc(doc.id).update({
              "IsExchangeRequestActive" : false
            })
          })
        })
    }

    getExchangeRequest = async () => {
      db.collection("requested_objects")
        .where("user_id","==",this.state.userId)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            if(doc.data().request_status !== "received"){
              this.setState({ 
                requestId: doc.data().request_id,
                requestedObjectName: doc.data().object_name,
                requestStatus: doc.data().request_status,
                docId: doc.id
              })
            }
          })
        })
    }

    addRequest = async(objectName,reasonToRequest)=>{
      var userId = this.state.userId;
      var randomRequestId = this.createUniqueId();
      db.collection('requested_objects').add({
          "user_id": userId,
          "object_name":objectName,
          "reason_to_request":reasonToRequest,
          "request_id"  : randomRequestId,
          "requested_by" : this.state.userName,
          "request_status" : "requested"
      })
  
      this.setState({
          objectName :'',
          reasonToRequest : '',
          IsExchangeRequestActive : true
      })

      db.collection("users").doc(this.state.docId).update({
        "IsExchangeRequestActive": true
      })

      return Alert.alert(" Requested Successfully")
    }

    sendNotification = () => {
      //Get the first name and the last name.
      db.collection("users").where("email_Id","==",this.state.userId).get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            var name = doc.data().first_name;
            var lastName = doc.data().last_name;
            //To get the DonorID and object name
            db.collection("all_notifications")
              .where("request_id","==",this.state.requestId).get()
              .then((snapshot) => {
                snapshot.forEach((doc) => {
                  var donorId = doc.data().donor_id;
                  var objectName = doc.data().object_name;
                  //Targeted user_id is the donor_id to send notification to the user.
                  db.collection("all_notifications").add({
                    "targeted_user_id": donorId,
                    "message": name + " " + lastName + " received the " + objectName,
                    "notification_status": "unread",
                    "object_name": objectName
                  })
                })
              })
          })
        })
    }

    componentDidMount () {
      this.getIsExchangeRequestActive();
      this.getExchangeRequest();
    }
    componentWillUnmount () {
      this.setState({
        IsExchangeRequestActive: ''
      })
    }

    render(){
      if(this.state.IsExchangeRequestActive !== true){
        return(
            <View style={{flex:1}}>
              <MyHeader title="Barter System"/>
                <KeyboardAvoidingView style={styles.keyBoardStyle}>
                  <TextInput
                    style ={styles.formTextInput}
                    placeholder={"enter object name"}
                    onChangeText={(text)=>{
                        this.setState({
                            objectName:text
                        })
                    }}
                    value={this.state.objectName}
                  />
                  <TextInput
                    style ={[styles.formTextInput,{height:300}]}
                    multiline
                    numberOfLines ={8}
                    placeholder={"Why do you need this object?"}
                    onChangeText ={(text)=>{
                        this.setState({
                            reasonToRequest:text
                        })
                    }}
                    value ={this.state.reasonToRequest}
                  />
                  <TouchableOpacity
                    style={styles.button}
                    onPress={()=>
                        {this.addRequest(this.state.objectName,this.state.reasonToRequest)}
                    } >
                    <Text>Request</Text>
                  </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        )
      } else if(this.state.IsExchangeRequestActive === true) {
        return (
          <View>
            <MyHeader title="Barter System"/>

            <View 
              style={{ 
                borderColor: 'orange', 
                borderWidth: 2, 
                justifyContent: 'center', 
                alignItems: 'center',
                padding: 10,
                margin: 10,
                marginTop: '40%'
              }}>
              <Text>Object Name</Text>
              <Text>{this.state.requestedObjectName}</Text>
          </View>

          <View 
            style={{ 
              borderColor: 'orange', 
              borderWidth: 2, 
              justifyContent: 'center', 
              alignItems: 'center',
              padding: 10,
              margin: 10,
              marginTop: '5%'
            }}>
              <Text>Request status</Text>
              <Text>{this.state.requestStatus}</Text>
          </View>

          <TouchableOpacity style={{
              borderWidth: 1, 
              borderColor: 'orange',
              backgroundColor: 'orange',
              width: 300,
              alignSelf: 'center',
              alignItems: 'center',
              height: 30,
              marginTop: "5%"
            }} onPress={() => {
              this.sendNotification();
              this.updateObjectRequestStatus();
              this.receivedObjects(this.state.requestedObjectName);
            }}>
            <Text style={{ fontWeight: "bold",paddingTop: 4 }}>I have received the item</Text>
          </TouchableOpacity>

        </View>
        )
      }
      else {
        return (
          <View>
            <MyHeader title="Barter System" />
          </View>
        )
      }
    }
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
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
    width:"80%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    alignSelf: 'center',
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
  }
)