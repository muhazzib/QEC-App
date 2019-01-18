import React, { Component } from 'react';
import { browserHistory } from 'react-router'
import { database } from '../fire'
import { Form, FormGroup, Label, Input, FormText, Button } from 'reactstrap';
import swal from 'sweetalert';
import '../App.css';
import home from '../Graphics/Home.svg';
import addComp from '../Graphics/addcomplaint.svg';
import myComp from '../Graphics/My Complaints.svg';
import { Progress } from 'reactstrap';
import comps from '../Graphics/Complaints.svg';
import pending from '../Graphics/pending.svg';
import resolved from '../Graphics/resolved.svg';
import users from '../Graphics/Users-01.svg';
import Complaints from './complaints.js'

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            department: '',
            name: '',
            details: '',
            toggleAddCom: false,
            complaints: [],
            userLength: '',
            RUsers:'',
            unRUsers:''
        }
    }
    componentDidMount() {
        console.log(this.props.location.state, 'aaaaaaaaaaaaaaaaa')
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

        let users = [];
        let RUsers=0;
        let unRUsers=0;
        database.child('users/').on("child_added", (snapshot) => {
            let obj = snapshot.val()
            console.log(snapshot.key, 'obj.key obj.key')
            Object.keys(obj).forEach(function (key) {
                console.log(key, '---------------')
                var value2 = obj[key];
                value2.key = key;
                users.push(value2)
                console.log(value2, 'valuasdad')
            })
            this.setState({
                userLength: users.length
            })
        })

        database.child('complaints/').on("child_added", (snapshot) => {
            let obj = snapshot.val()
            console.log(snapshot.key, 'obj.key obj.key')
            Object.keys(obj).forEach(function (key) {
                console.log(key, '---------------')
                var value2 = obj[key];
                value2.key = key;
                value2.uid = snapshot.key
                if(value2.resolved){
                     RUsers+=1;
                }
                else{
                    unRUsers+=1;
                }
                console.log(unRUsers, 'commavaluasdad')
            })
            this.setState({
                RUsers,
                unRUsers
            })
           
        })

    }
    eventChange = (ev) => {
        this.setState({
            name: ev.target.value
        })
    }
    submitCom = () => {
        let obj = {
            name: this.state.name,
            department: this.state.department,
            details: this.state.details,
            resolved: false
        }
        if (obj.name && obj.department && obj.details) {

            database.child('complaints/' + this.state.user.uid).push(obj).then((success) => {
                this.setState({
                    details: '',
                    name: ''
                })
            }).then((al) => {
                swal("Success!", "Complaint has been launched", "success");
            })
        }
        else {
            swal("Error!", 'Enter all fields', "error");
        }
    }
    SelectDeptt = (ev) => {
        this.setState({
            department: ev.target.value
        })
    }
    details = (ev) => {
        this.setState({
            details: ev.target.value
        })
    }
    toggleAddComFunc = () => {
        this.setState({
            toggleAddCom: !this.state.toggleAddCom
        })
    }

    // getLengthOfCompsArray = () => {
    //     database.child('complaints/').on("child_added", (snapshot) => {
    //         let obj = snapshot.val()

    //         let complaints = this.state.complaints;

    //         Object.keys(obj).forEach(function (key) {
    //             console.log(key, '---------------')
    //             var value2 = obj[key];
    //             value2.key = key;
    //             value2.uid = snapshot.key
    //             complaints.push(value2)
    //             console.log(value2, 'valuasdad')
    //         })
    //         this.setState({
    //             complaints: complaints
    //         })
    //         console.log(complaints.length);
    //     })
    // }


    render() {

        return (

            <div className='home-main-div'>
                <div className='home-child1'>

                    {
                        this.state.user ?
                            this.state.user.role == 'user' ? (
                                <ul className='nav-list'>
                                    <li className='list-item selected'>
                                        <table>
                                            <tr>
                                                <td><img src={home} width='20px' height='30px' /></td>
                                                <td width='12px'></td>
                                                <td style={{ paddingTop: 10 }}> Home</td>
                                            </tr>
                                        </table>
                                    </li>
                                    <li className='list-item' onClick={() => browserHistory.push({ pathname: '/mycomplaints', state: { user: this.state.user } })}>
                                        <table>
                                            <tr>
                                                <td><img src={myComp} width='20px' height='30px' /></td>
                                                <td width='12px'></td>
                                                <td style={{ paddingTop: 10 }}>My Complaints</td>
                                            </tr>
                                        </table>

                                    </li>
                                </ul>
                            )
                                :
                                (
                                    <ul className='nav-list'>
                                        <li className='list-Item'>
                                            <table>
                                                <tr>
                                                    <td><img src={home} width='20px' height='30px' /></td>
                                                    <td width='12px'></td>
                                                    <td style={{ paddingTop: 10 }}> Home</td>
                                                </tr>
                                            </table>
                                        </li>
                                        <li className='list-item' onClick={() => browserHistory.push('/users')}>
                                            <table>
                                                <tr>
                                                    <td><img src={users} width='20px' height='30px' /></td>
                                                    <td width='12px'></td>
                                                    <td style={{ paddingTop: 10 }}>Users</td>
                                                </tr>
                                            </table>
                                        </li>
                                        <li className='list-item' onClick={() => browserHistory.push('/complaints')}>
                                            <table>
                                                <tr>
                                                    <td><img src={comps} width='20px' height='30px' /></td>
                                                    <td width='12px'></td>
                                                    <td style={{ paddingTop: 10 }}>Complaints</td>
                                                </tr>
                                            </table>
                                        </li>
                                    </ul>
                                )
                            :
                            null
                    }
                </div>
                <div className='home-child2'>

                    {
                        this.state.user ?
                            this.state.user.role == 'user' ? (
                                <div>
                                    {
                                        this.state.toggleAddCom ? (

                                            <div>
                                                <h1 className='addComplainH'>Add Complain</h1>

                                                <FormGroup>
                                                    <Label for="exampleEmail">Complaint Title</Label>
                                                    <Input type="text" value={this.state.name} name="name" id="exampleEmail" placeholder="Complaint Title here" onChange={this.eventChange} />
                                                </FormGroup>

                                                <FormGroup>
                                                    <Label for="exampleSelectMulti">Department</Label>
                                                    <Input
                                                        type="select"
                                                        name="selectMulti"
                                                        id="exampleSelectMulti"
                                                        onChange={this.SelectDeptt}

                                                    >
                                                        <option disabled={true} selected={true}>Select Deptt.</option>
                                                        <option value='QEC'>QEC</option>
                                                        <option value='Maintenance'>Maintenance</option>
                                                    </Input>
                                                </FormGroup>

                                                {/* <select onChange={this.SelectDeptt}>
                                                    <option disabled={true} selected={true}>Select Deptt.</option>
                                                    <option value='QEC'>QEC</option>
                                                    <option value='Maintenance'>Maintenance</option>
                                                </select> */}


                                                <FormGroup>
                                                    <Label for="exampleText" disabled>Complaint Details</Label>
                                                    <Input type="textarea" value={this.state.details} name="text" id="exampleText" onChange={this.details} />
                                                </FormGroup>
                                                <Button color="primary" onClick={this.submitCom} className='fSubBtn'>Submit</Button>
                                                <Button color="danger" onClick={this.toggleAddComFunc}>Discard</Button>
                                            </div>
                                        )
                                            :
                                            (
                                                < div className='AddComDiv' onClick={this.toggleAddComFunc} >
                                                    <div className='addComp'>
                                                        <img src={addComp} width='200px' height='100px' />
                                                    </div>
                                                    <p>Click here to register a complaint</p>
                                                </div>
                                            )
                                    }
                                </div>

                            ) : (
                                    <div>
                                        <h1 className='welcome'>Welcome Admin,</h1>
                                        <h2>Here are the statistics of the system!</h2>

                                        <div className='usersStat'>
                                            <img src={users} width='40px' height='50px' />
                                            <h3 >Total Users</h3>
                                            <Progress animated value={this.state.userLength} />
                                            <h4>{this.state.userLength}</h4>
                                        </div>
                                        <div className='pending'>
                                            <img src={pending} width='40px' height='50px' />
                                            <h3 >Pending Complaints </h3>
                                            <Progress animated value={this.state.RUsers} color='warning' />
                                            <h4>{this.state.RUsers}</h4>
                                        </div>
                                        <div className='resolved'>
                                            <img src={resolved} width='40px' height='50px' />
                                            <h3 >Resolved Complaints</h3>
                                            <Progress animated value={this.state.unRUsers} color='success' />
                                            <h4>{this.state.unRUsers}</h4>
                                        </div>
                                    </div>
                                ) : null
                    }

                </div>

            </div>
        );
    }
}

export default Home;
