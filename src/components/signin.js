import React, { Component } from 'react';
import { browserHistory } from 'react-router'
import { fire, database } from '../fire'
import { authBol } from '../auth.js'
import {Button} from 'reactstrap';
import swal from 'sweetalert';

class Signin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
    }
    Login = () => {
        const obj = {
            email: this.state.email,
            password: this.state.password
        }
        if(obj.email && obj.password){
            fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(function (success) {
    
                console.log(success.uid, 'uiddddddddddddddddddddd')
                database.child('users/' + success.uid).on("child_added", (snapshot) => {
                    let obj = snapshot.val()
                    // obj.key = snapshot.key
                    localStorage.setItem('user', obj.uid)
                    authBol.auth = true
                    console.log(obj, 'signinUser')
                    let user = {
                        role: obj.role,
                        uid: obj.uid
                    }
                    browserHistory.push({ pathname: '/', state: { user: user } })
                })
            }).catch((err)=>{
                if(err.message){
                    if(err.message=='There is no user record corresponding to this identifier. The user may have been deleted.'){
                        swal("Error!",'User not found', "error");
                    }
                    else{
                        swal("Error!",err.message, "error");
                    }
                }
            })
        }
        else{
            swal("Error!",'Enter all fields', "error");
        }
    }
    emailChange = (ev) => {
        this.setState({
            email: ev.target.value
        })
    }
    passChange = (ev) => {
        this.setState({
            password: ev.target.value
        })
    }
    render() {
        return (
            <div className='signInDiv'>
               <input type="email" onChange={this.emailChange} placeholder="Enter email here" value={this.state.email}/><br />
                <input type="password" onChange={this.passChange} placeholder="Enter password here" value={this.state.password}/>
                <Button color="primary" onClick={this.Login}>Login</Button>
            </div>

        );
    }
}

export default Signin;
