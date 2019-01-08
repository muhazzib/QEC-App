import { Router, Route, browserHistory } from 'react-router'
import React, { Component } from 'react';
import Signin from './components/signin'
import Home from './components/home'
import User from './components/users'
import Complaints from './components/complaints'
import Me from './components/me'

import { fire, database } from './fire'
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
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
                    browserHistory.push({ pathname: nextState.location.pathname, state: { user: user } })
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
        localStorage.removeItem('user'),
            authBol.auth = false;
        browserHistory.push('/signin');
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
                <Navbar color="light" light expand="md">
                    <NavbarBrand href="/">reactstrap</NavbarBrand>
                    {
                        this.props.location.pathname == '/home' ? (
                            <NavbarToggler onClick={this.toggle} />
                        ) : null
                    }
                    {
                        this.props.location.pathname == '/' || this.props.location.pathname ==  '/complaints' || this.props.location.pathname ==  '/mycomplaints' || this.props.location.pathname ==  '/users'? (
                            <Collapse isOpen={this.state.isOpen} navbar>
                                <Nav className="ml-auto" navbar>
                                            <UncontrolledDropdown nav inNavbar>
                                                <DropdownToggle nav caret>
                                                    Options
                                                </DropdownToggle>
                                                <DropdownMenu right>
                                                    <DropdownItem onClick={this.removeUser}>
                                                        Logout
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
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