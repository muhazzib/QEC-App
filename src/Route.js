import { Router, Route, browserHistory } from 'react-router'
import React, { Component } from 'react';
import Signin from './components/signin'
import Home from './components/home'
import User from './components/users'
import Complaints from './components/complaints'
import Me from './components/me'
import logo from './Graphics/LOGO.svg';

import { fire, database } from './fire'
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    Button,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';


import { authBol } from './auth.js'


const login = () => {
    localStorage.setItem('user', 'abc')
    authBol.auth = true
    browserHistory.push('/')
}
const logout = () => {
    localStorage.removeItem('user')
    browserHistory.push('/signin')
}


const checkAuthSignInRoute = (nextState, replace, callback) => {
    const localtoken = localStorage.getItem('user')
    if (authBol.auth) {
        if (localtoken) {
            replace('/')
            callback()
        }
        else {
            callback()
        }
    }

    if (!localtoken) {
        callback()
    }

    if (!authBol.auth && localtoken) {
        fire.auth().onAuthStateChanged((user) => {
            if (user) {
                database.child('users/' + user.uid).on("child_added", (snapshot) => {
                    let obj = snapshot.val()
                    // obj.key = snapshot.key
                    console.log(obj, '-----')
                    authBol.auth = true
                    let user = {
                        role: obj.role,
                        uid: obj.uid
                    }
                    browserHistory.push({ pathname: '/', state: { user: user } })
                })
            }
            else {
                callback()
                localStorage.removeItem('user')
                authBol.auth = false;
            }
        });
    }
}
const checkAuth = (nextState, replace, callback) => {
    const localtoken = localStorage.getItem('user')

    if (authBol.auth) {
        if (localtoken) {
            callback()
        }
        else {
            localStorage.removeItem('user')
            replace('/signin')
            callback()
        }
    }

    if (!localtoken) {
        authBol.auth = false
        localStorage.removeItem('user')
        replace('/signin')
        callback()
    }
    if (!authBol.auth && localtoken) {
        fire.auth().onAuthStateChanged((user) => {
            if (user) {
                database.child('users/' + user.uid).on("child_added", (snapshot) => {
                    let obj = snapshot.val()
                    // obj.key = snapshot.key
                    console.log(nextState, '---test-')
                    authBol.auth = true
                    let user = {
                        role: obj.role,
                        uid: obj.uid
                    }
                    console.log(nextState, '--------asdad')
                    if (user.role === 'admin') {
                        if (nextState.location.pathname == '/complaints') {
                            browserHistory.push({ pathname: '/complaints', state: { user: user } })
                        }
                        else if (nextState.location.pathname == '/users') {
                            browserHistory.push({ pathname: '/users', state: { user: user } })
                        }
                        else if (nextState.location.pathname == '/') {
                            browserHistory.push({ pathname: '/', state: { user: user } })
                        }
                        else{
                            browserHistory.push({ pathname: '/', state: { user: user } })
                        }
                        // callback()
                    }
                    else {
                        if (nextState.location.pathname !== '/' && nextState.location.pathname !== '/mycomplaints') {
                            browserHistory.push({ pathname: '/', state: { user: user } })
                        }
                        else {
                            if (nextState.location.pathname == '/mycomplaints') {
                                browserHistory.push({ pathname: '/mycomplaints', state: { user: user } })
                            }
                            else if (nextState.location.pathname == '/') {
                                browserHistory.push({ pathname: '/', state: { user: user } })
                            }
                        }
                    }
                })
            }
            else {
                callback()
                localStorage.removeItem('user')
                authBol.auth = false;
            }
        });
    }
}



class Navbar2 extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }

    removeUser = () => {
        fire.auth().signOut().then(function () {
            localStorage.removeItem('user'),
                authBol.auth = false;
            browserHistory.push('/signin');
        }, function (error) {
            console.error('Sign Out Error', error);
        });
    }

    componentWillMount() {
        console.log(this.props)
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    render() {
        console.log(this.props.location.pathname)
        return (
            <div>
                <Navbar className="nav-bar" expand="md">
                    <img src={logo} width='80px' height='80px' />
                    <NavbarBrand className="brand" href="/">

                        Complaints Management System | SMIU</NavbarBrand>
                    {
                        this.props.location.pathname == '/home' ? (
                            <NavbarToggler onClick={this.toggle} />
                        ) : null
                    }
                    {
                        this.props.location.pathname == '/' || this.props.location.pathname == '/complaints' || this.props.location.pathname == '/mycomplaints' || this.props.location.pathname == '/users' ? (
                            <Collapse isOpen={this.state.isOpen} navbar>
                                <Nav className="ml-auto" navbar>
                                    {/* <UncontrolledDropdown nav inNavbar>
                                                <DropdownToggle className="nav-bar" nav caret>
                                                    Options
                                                </DropdownToggle>
                                                <DropdownMenu right>
                                                    <DropdownItem onClick={this.removeUser}>
                                                        Logout
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </UncontrolledDropdown> */}
                                    <Button color='danger' className="logout" onClick={this.removeUser}>Logout</Button>
                                </Nav>
                            </Collapse>
                        ) : null
                    }
                </Navbar>
                {
                    this.props.children
                }
            </div>
        );
    }
}



export default class Routers extends Component {
    constructor(props) {
        super(props)
    }

    componentWillMount() {
        console.log(this.props)
    }

    render() {
        return (
            <div>
                <Router history={browserHistory}>
                    <Route component={Navbar2}>
                        <Route path='/signin' component={Signin} onEnter={checkAuthSignInRoute} />
                        <Route path='/' component={Home} onEnter={checkAuth} />
                        <Route path='/users' component={User} onEnter={checkAuth} />
                        <Route path='/complaints' component={Complaints} onEnter={checkAuth} />
                        <Route path='/mycomplaints' component={Me} onEnter={checkAuth} />
                    </Route>
                </Router>
            </div>
        );
    }
}