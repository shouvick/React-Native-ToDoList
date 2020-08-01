import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as firebase from 'firebase';
import { firebaseConfig } from './config';
import {  Item, Input, Label, Button, List, ListItem } from 'native-base';
import Constants from 'expo-constants';

if(!firebase.apps.length)
{
  firebase.initializeApp(firebaseConfig);
}


export default class App extends React.Component{
  state={
    text:"",
    mylist:[]
  }
  componentDidMount(){
    const myitems = firebase.database().ref("mywishes")
    myitems.on("value",datasnap=>{
      if(datasnap.val()){
      this.setState({mylist:Object.values(datasnap.val())})
      }
    })
  }
  saveitem(){
    const mywishes = firebase.database().ref("mywishes")
    mywishes.push().set({
      text:this.state.text,
      time:Date.now()
    })
    this.setState({text:""})
  }
  removeAll()
  {
    firebase.database().ref("mywishes").remove()
    this.setState({mylist:[]})
  }
  
  render(){
    const myitems = this.state.mylist.map(item=>{
      return(
        <ListItem style={{justifyContent:"space-between"}}>
        <Text>{item.text}</Text>
        </ListItem>
      )
    })
    return (
      <View style={styles.container}>
         <Item floatingLabel>
                <Label>Add Items</Label>
                <Input value={this.state.text} onChangeText={(text)=>this.setState({text})} />
         </Item>
         <View style={{flexDirection:"row",padding:20,justifyContent:"space-around"}}>
            <Button rounded success
            style={styles.mybtn}
            onPress={()=>this.saveitem()}
            >
              <Text>ADD</Text>
            </Button>
            <Button rounded danger style={styles.mybtn} 
            onPress={()=>this.removeAll()}
            >
              <Text>Delete All</Text>
            </Button>
         </View>
         <List>
          {myitems}
         </List>
      </View>
      
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Constants.statusBarHeight
  },
  mybtn:{
    padding:10,
    width:160,
    justifyContent:"center"
  },
  text: {
    color: "white",
    fontSize: 25
  }
});
