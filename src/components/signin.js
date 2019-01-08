import React, { Component } from 'react';
import { browserHistory } from 'react-router'
import {fire,database} from '../fire' 
import { authBol } from '../auth.js'

class Signin extends Component {
    constructor(props){
        super(props);
        this.state={
            email:'',
            password:''
        }
    }
    Login=()=>{
        const obj={
            email:this.state.email,
            password:this.state.password
        }
        fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(function (success) {

            console.log(success.uid,'uiddddddddddddddddddddd')
            database.child('users/'+success.uid).on("child_added",(snapshot)=>{
                let obj = snapshot.val()
                // obj.key = snapshot.key
                localStorage.setItem('user',obj.uid)
                authBol.auth=true
                console.log(obj,'signinUser')
                let user={
                    role:obj.role,
                    uid:obj.uid
                }
                browserHistory.push({pathname:'/',state:{user:user}})
            })
        })
        console.log(obj)
    }
    emailChange=(ev)=>{
        this.setState({
            email:ev.target.value
        })
    }
    passChange=(ev)=>{
        this.setState({
            password:ev.target.value
        })
    }
  render() {
    return (
        <div>
       <label>Email<input type="email" onChange={this.emailChange}/></label><br/>
       <label>Password<input type="password" onChange={this.passChange}/></label>
       <button onClick={this.Login}>Login</button>
        </div>

    );
  }
}

export default Signin;
