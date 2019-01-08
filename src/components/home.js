import React, { Component } from 'react';
import { browserHistory } from 'react-router'
import { database } from '../fire'
import { Form, FormGroup, Label, Input, FormText,Button  } from 'reactstrap';
import swal from 'sweetalert';

import '../App.css'

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            department: '',
            name: '',
            details: '',
            toggleAddCom: false
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
            details: this.state.details
        }
        if(obj.name && obj.department && obj.details){

            database.child('complaints/' + this.state.user.uid).push(obj).then((success) => {
                this.setState({
                    details:'',
                    name:''
                })
            }).then((al)=>{
                swal("Success!", "Coplain has been launched", "success");
            })
        }
        else{
            swal("Error!",'Enter all fields', "error");
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
    render() {
        return (
            <div className='home-main-div'>
                <div className='home-child1'>

                    {
                        this.state.user ?
                            this.state.user.role == 'user' ? (
                                <ul className='nav-list'>
                                    <li className='list-item selected'>Home</li>
                                    <li className='list-item' onClick={() => browserHistory.push({ pathname: '/mycomplaints', state: { user: this.state.user } })}>My Complaints</li>
                                </ul>) : (
                                    <ul className='nav-list'>
                                        <li className='list-Item'>Home</li>
                                        <li className='list-item' onClick={() => browserHistory.push('/users')}>Users</li>
                                        <li className='list-item' onClick={() => browserHistory.push('/complaints')}>Complaints</li>
                                    </ul>) : null
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
                                                    <Input type="text" value={this.state.name} name="name" id="exampleEmail" placeholder="with a placeholder" onChange={this.eventChange} />
                                                </FormGroup>

                                                <FormGroup>
                                                    <Label for="exampleSelectMulti">Role</Label>
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
                                                    <Label for="exampleText">Enter complain here</Label>
                                                    <Input type="textarea"  value={this.state.details} name="text" id="exampleText" onChange={this.details} />
                                                </FormGroup>
                                                <Button color="primary" onClick={this.submitCom} className='fSubBtn'>Submit</Button>
                                                <Button color="danger" onClick={this.toggleAddComFunc}>Discard</Button>
                                            </div>
                                        ) : (
                                                < div className='AddComDiv' onClick={this.toggleAddComFunc} >
                                                    <p>Click here to register a complaint</p>
                                                </div>
                                            )
                                    }
                                </div>

                            ) : (
                                    <h1 className='addComplainH'>Welcome Admin</h1>
                                ) : null
                    }

                </div>

            </div>
        );
    }
}

export default Home;
