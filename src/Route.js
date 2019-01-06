import { Router, Route, browserHistory } from 'react-router'
import React, { Component } from 'react';
import Signin from './components/signin'
import Home from './components/home'
import User from './components/users'
import Complaints from './components/complaints'


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


// const checkAuthSignInRoute = (nextState, replace, callback) => {
//     const localtoken = localStorage.getItem('user')
//     if (authBol.auth) {
//         if (localtoken) {
//             replace('/')
//             callback()
//         }
//         else {
//             callback()
//         }
//     }

//     if (!localtoken) {
//         callback()
//     }

//     if (!authBol.auth && localtoken) {
//         fetch('https://jsonplaceholder.typicode.com/todos/1')
//             .then(() => {
//                 authBol.auth = true
//                 browserHistory.push('/')
//                 callback();
//             })
//             .catch((err) => {
//                 callback();
//             })
//     }
// }
// const checkAuth = (nextState, replace, callback) => {
//     const localtoken = localStorage.getItem('user')

//     if (authBol.auth) {
//         if (localtoken) {
//             callback()
//         }
//         else {
//             localStorage.removeItem('user')
//             replace('/signin')
//             callback()
//         }
//     }

//     if (!localtoken) {
//         authBol.auth = false
//         localStorage.removeItem('user')
//         replace('/signin')
//         callback()
//     }
//     if (!authBol.auth && localtoken) {
//         fetch('https://jsonplaceholder.typicode.com/todos/1')
//             .then(() => {
//                 authBol.auth = true
//                 callback();
//                 return;
//             })
//             .catch((err) => {
//                 authBol.auth = false
//                 localStorage.removeItem('user')
//                 browserHistory.push('/signin')
//                 callback();
//             })
//     }
// }



class Navbar extends Component {
    constructor(props) {
        super(props)
    }

    componentWillMount() {
        console.log(this.props)
    }

    render() {
        console.log(this.props.location.pathname)
        return (
            <div>
                {
                    this.props.location.pathname === '/signin' ? (
                        <h1>Login</h1>
                    ) : 
                    this.props.location.pathname === '/users' ? (
                        <h1>Users</h1>
                    ) :
                    this.props.location.pathname === '/complaints' ? (
                        <h1>Complaints</h1>
                    ) :
                    <h1>Home</h1>
                }
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
                    <Route component={Navbar}>  
                        <Route path='/signin' component={Signin} />
                        <Route path='/' component={Home} />
                        <Route path='/users' component={User} />
                        <Route path='/complaints' component={Complaints} />
                    </Route>
                </Router>
            </div>
        );
    }
}