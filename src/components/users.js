import React, { Component } from 'react';
import { browserHistory } from 'react-router'
import { fire, database } from '../fire'
import '../App.css'
class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            adduser: false,
            role: '',
            name: '',
            id: '',
            email: '',
            password: '',
            designation: '',
            users: [],
            user:''
        }
    }
    toggle = () => {
        this.setState({
            adduser: !this.state.adduser
        })
    }

    SelectRole = (ev) => {
        this.setState({
            role: ev.target.value
        })
    }

    getValues = (event) => {
        this.setState({
            name: event.target.name === 'name' ? event.target.value : this.state.name,
            id: event.target.name === 'id' ? event.target.value : this.state.id,
            email: event.target.name === 'email' ? event.target.value : this.state.email,
            password: event.target.name === 'password' ? event.target.value : this.state.password,
            designation: event.target.name === 'post' ? event.target.value : this.state.designation,
        })
    }

    addUser = () => {
        let obj = {
            name: this.state.name,
            id: this.state.id,
            email: this.state.email,
            password: this.state.password,
            role:'user'
        }

        if (this.state.role === 'faculty') {
            obj.designation = this.state.designation
        }




        fire.auth().createUserWithEmailAndPassword(obj.email, obj.password)
            .then(function (res) {
                obj.uid = res.uid
                database.child("users/"+res.uid).push(obj)
            })
            .then((success) => {
                this.setState({
                    email: '',
                    id: '',
                    password: '',
                    designation: '',
                    name: '',
                })
                console.log(success)
            })
            .catch((error) => {
                console.log(error)
            });


        console.log(obj, '-----')
    }

    componentDidMount() {
        if (this.props.location.state) {
            let UserObj = {
                role: this.props.location.state.user.role,
                uid: this.props.location.state.user.uid
            }
            this.setState({
                user: UserObj
            })
        }
    
        else {
    
        }

        
        database.child('users/').on("child_added", (snapshot) => {
            let obj = snapshot.val()
            console.log(snapshot.key, 'obj.key obj.key')
            let users = this.state.users;
            Object.keys(obj).forEach(function (key) {
                console.log(key, '---------------')
                var value2 = obj[key];
                value2.key = key;
                users.push(value2)
                console.log(value2, 'valuasdad')
            })
            this.setState({
                users: users
            })
        })
        console.log(this.state.users, 'state users')

    }


    render() {
        console.log(this.state.users, '--------users')
        return (
            <div className='home-main-div'>
                <div className='home-child1'>
                    <ul className='nav-list'>
                        <li onClick={() => browserHistory.push({pathname:'/',state:{user:this.state.user}})}>Home</li>
                        <li onClick={() => browserHistory.push('/users')}>Users</li>
                        <li onClick={() => browserHistory.push('/complaints')}>Complaints</li>
                        <li>Stats</li>
                    </ul>
                </div>
                <div className='home-child2'>
                    <button onClick={this.toggle}>{this.state.adduser ? 'Back To Users' : 'Add Users'}</button>
                    {
                        this.state.adduser ? (
                            <div>
                                <h1>Add Users</h1>
                                <select onChange={this.SelectRole}>
                                    <option disabled={true} selected={true}>Select Role</option>
                                    <option value='student'>Student</option>
                                    <option value='faculty'>Faculty</option>
                                </select><br />
                                <label>Name<input type='text' name='name' onChange={this.getValues} /></label><br />
                                <label>ID<input type='text' name='id' onChange={this.getValues} /></label><br />

                                {
                                    this.state.role === 'faculty' ? (
                                        <label>Designation<input type='text' name='post' onChange={this.getValues} /></label>
                                    ) : null
                                }
                                {
                                    this.state.role === 'faculty' ? (
                                        <br />
                                    ) : null
                                }
                                <label>Email<input type='email' name='email' onChange={this.getValues} /></label><br />
                                <label>Password<input type='password' name='password' onChange={this.getValues} /></label><br />
                                <button onClick={this.addUser}>Add</button>

                            </div>
                        ) : (
                                <div>
                                    <h1>Users</h1>
                                    {
                                        this.state.users.map((value, index) => {
                                            return (
                                                <div>
                                                <h4>{value.name}</h4>
                                                <h6>{value.designation}</h6>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            )
                    }
                </div>

            </div>
        );
    }
}

export default Users;
