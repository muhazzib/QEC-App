import React, { Component } from 'react';
import { browserHistory } from 'react-router'
import { fire, database } from '../fire'
import { Card, Button, CardTitle, CardText } from 'reactstrap';
import { Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import swal from 'sweetalert';



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
            user: ''
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
            role: 'user'
        }

        if (this.state.role === 'faculty') {
            obj.designation = this.state.designation
        }




        fire.auth().createUserWithEmailAndPassword(obj.email, obj.password)
            .then(function (res) {
                obj.uid = res.uid
                database.child("users/" + res.uid).push(obj)
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
            }).then((alertsuc)=>{
                swal("Success!", "User has been created", "success");
            })
            .catch((error) => {
                if(!obj.name || !obj.id || !obj.email || !obj.password || !obj.role ){
                    swal("Error!",'Enter all fields', "error");
                }
                else{
                    if(error.message){
                        swal("Error!",error.message, "error");
                    }
                    else{
                        console.log(error)
                    }
                }

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
        let CardIndex = 0;
        console.log(this.state.users, '--------users')
        return (
            <div className='home-main-div'>
                <div className='home-child1'>
                    <ul className='nav-list'>
                        <li onClick={() => browserHistory.push({ pathname: '/', state: { user: this.state.user } })}>Home</li>
                        <li onClick={() => browserHistory.push('/users')}>Users</li>
                        <li onClick={() => browserHistory.push('/complaints')}>Complaints</li>
                    </ul>
                </div>
                <div className='home-child2'>
                    {
                        this.state.adduser ? (
                            <div className='user-maindiv'>
                                <div className='AddUserBtnDiv'>

                                    <Button onClick={this.toggle}>{this.state.adduser ? 'Back To Users' : 'Add Users'}</Button>
                                </div>
                                <h1>Add Users</h1>
                                <div className='formDiv'>
                                    <FormGroup>
                                        <Label for="exampleSelectMulti">Role</Label>
                                        <Input
                                            type="select"
                                            name="selectMulti"
                                            id="exampleSelectMulti"
                                            onChange={this.SelectRole}

                                        >
                                            <option disabled={true} selected={true}>Select Role</option>
                                            <option value='student'>Student</option>
                                            <option value='faculty'>Faculty</option>
                                        </Input>
                                    </FormGroup>



                                    {/* <select onChange={this.SelectRole}>

                                    </select><br /> */}

                                    <FormGroup>
                                        <Label for="exampleEmail">Name</Label>
                                        <Input value={this.state.name} type="text" name="name" id="exampleEmail" placeholder="with a placeholder" onChange={this.getValues} />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="exampleEmail">ID</Label>
                                        <Input value={this.state.id} type="text" name="id" id="exampleEmail" placeholder="with a placeholder" onChange={this.getValues} />
                                    </FormGroup>

                                    {
                                        this.state.role === 'faculty' ? (
                                            <FormGroup>
                                                <Label for="exampleEmail">Designation</Label>
                                                <Input value={this.state.designation} type="text" name="post" id="exampleEmail" placeholder="with a placeholder" onChange={this.getValues} />
                                            </FormGroup>
                                        ) : null
                                    }
                                    {/* {
                                        this.state.role === 'faculty' ? (
                                            <br />
                                        ) : null
                                    } */}

                                    <FormGroup>
                                        <Label for="exampleEmail">Email</Label>
                                        <Input value={this.state.email} type="email" name="email" id="exampleEmail" placeholder="with a placeholder" onChange={this.getValues} />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="exampleEmail">Password</Label>
                                        <Input value={this.state.password} type="password" name="password" id="exampleEmail" placeholder="with a placeholder" onChange={this.getValues} />
                                    </FormGroup>
                                    <Button color="primary" onClick={this.addUser}>Add</Button>
                                </div>
                            </div>
                        ) : (
                                <div className='user-maindiv'>
                                    <div className='AddUserBtnDiv'>
                                        <Button color="secondary" onClick={this.toggle}>{this.state.adduser ? 'Back To Users' : 'Add User'}</Button>
                                    </div>

                                    <h1>Users</h1>
                                    {
                                        this.state.users.map((value, index) => {
                                            CardIndex = CardIndex + 1;
                                            if (CardIndex > 3) {
                                                CardIndex = 1;
                                            }
                                            return (
                                                <Card body className={`UserChild${CardIndex}`}>
                                                    <CardTitle>{value.name}</CardTitle>
                                                    <CardText>{value.email}</CardText>
                                                    {
                                                        value.role == 'admin' ? (
                                                            <CardText>Admin</CardText>
                                                        ) : (
                                                                <CardText>{value.designation ? value.designation : 'Student'}</CardText>
                                                            )
                                                    }

                                                    {/* <Button>{`Role ${value.role}`}</Button> */}
                                                </Card>

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
