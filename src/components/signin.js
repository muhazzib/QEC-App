import React, { Component } from 'react';
import { browserHistory } from 'react-router'
import { fire, database } from '../fire'
import { authBol } from '../auth.js'
import {Button} from 'reactstrap';
import swal from 'sweetalert';
import { Form, FormGroup, Label, Input, FormText, Popover, PopoverBody, PopoverHeader } from 'reactstrap';
import logo from '../Graphics/LOGO.svg';

class Signin extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            email: '',
            password: '',
            popoverOpen: false
        }
    }

    toggle = () => {
        this.setState({
          popoverOpen: !this.state.popoverOpen
        });
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
            <div className='signInBody'>
                <div className='signInDiv'>
                    <div className='loginLogo'>
                        {/* <img src={logo} width='80px' height= '80px'/> */}
                        {/* <h4>Complaints Management System</h4> */}
                        <h5>Please enter your credentials to proceed.</h5>
                    </div>
                    
                    <Input type="email" onChange={this.emailChange} placeholder="Enter email here" value={this.state.email}/>
                    
                    <Input type="password" onChange={this.passChange} placeholder="Enter password here" value={this.state.password}/>
                    <Button className='loginBtn' color="primary" size="lg" block onClick={this.Login}>Login</Button>
                    
                    <Button  id='Popover1' color='link'>Forgot your password?</Button>
                    
                    <Popover className='popover' placement="right" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.toggle}>
                        <PopoverHeader className='popover-header'>Info</PopoverHeader>
                        <PopoverBody>Please contact IT department to recover your password.</PopoverBody>
                    </Popover>
                </div>
            </div>
        );
    }
}

export default Signin;
