import React, { Component } from 'react';
import { browserHistory } from 'react-router'
import { database } from '../fire'

import '../App.css'
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            department: '',
            name: '',
            details: ''
        }
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
            console.log(this.props, '-------')
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
        database.child('complaints/'+this.state.user.uid).push(obj).then((success)=>{
            console.log(success, 'kkkkkkkkk')
        })
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
    render() {
        return (
            <div className='home-main-div'>
                <div className='home-child1'>

                    {
                        this.state.user ?
                            this.state.user.role == 'user' ? (
                                <ul className='nav-list'>
                                    <li>Home</li>
                                    <li onClick={() => browserHistory.push('/me')}>My Complaints</li>
                                    <li>Stats</li>
                                </ul>) : (
                                    <ul className='nav-list'>
                                        <li>Home</li>
                                        <li onClick={() => browserHistory.push('/users')}>Users</li>
                                        <li onClick={() => browserHistory.push('/complaints')}>Complaints</li>
                                        <li>Stats</li>
                                    </ul>) : null
                    }
                </div>
                <div className='home-child2'>

                    {
                        this.state.user ?
                            this.state.user.role == 'user' ? (
                                <div>
                                    <h1>Welcome User</h1>

                                    <label>Complaint Title<input type='text' name='name' onChange={this.eventChange} /></label><br />
                                    <select onChange={this.SelectDeptt}>
                                        <option disabled={true} selected={true}>Select Deptt.</option>
                                        <option value='QEC'>QEC</option>
                                        <option value='Maintenance'>Maintenance</option>
                                    </select>
                                    <br />
                                    <textarea rows='10' cols='100' onChange={this.details}>Enter complain here</textarea><br />
                                    <button onClick={this.submitCom}>Submit</button>
                                </div>

                            ) : (
                                    <h1>Welcome Admin</h1>
                                ) : null
                    }

                </div>

            </div>
        );
    }
}

export default Home;
