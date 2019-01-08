import React, { Component } from 'react';
import { browserHistory } from 'react-router'
import { fire, database } from '../fire'
import {
    Card, Button, CardHeader, CardFooter, CardBody,
    CardTitle, CardText
} from 'reactstrap';
import '../App.css'
class Complaints extends Component {
    constructor(props) {
        super(props);
        this.state = {
            complaints: [],
            user: ''
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
        }

        else {

        }
        database.child('complaints/').on("child_added", (snapshot) => {
            let obj = snapshot.val()
            console.log(snapshot.key, 'obj.key obj.key')
            let complaints = this.state.complaints;
            Object.keys(obj).forEach(function (key) {
                console.log(key, '---------------')
                var value2 = obj[key];
                value2.key = key;
                value2.uid = snapshot.key
                complaints.push(value2)
                console.log(value2, 'valuasdad')
            })
            this.setState({
                complaints: complaints
            })
            // obj.map((value,index)=>{
            //     Object.keys(value).forEach(function (key) {
            //                   console.log(key,'valuasdad')
            //     })
            // })
        })
    }
    delete = (key, uid, arrayIndex) => {
        database.child('complaints/' + uid).child(key).remove().then(() => {
            const dupComp = this.state.complaints;
            dupComp.splice(arrayIndex, 1)
            this.setState({
                complaints: dupComp
            })
        })
        // console.log(key,'===>>>>>>>>>',uid)
    }

    render() {
        console.log(this.state.complaints, 'onbjbdaj')

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
                    <h1 className='addComplainH'>Complaints</h1>
                    {
                        this.state.complaints.map((value, index) => {
                            return (
                                <div>

                                    <Card>
                                        <CardHeader>{value.name}</CardHeader>
                                        <CardBody>
                                            <CardTitle>Special Title Treatment</CardTitle>
                                            <CardText>{value.details}</CardText>
                                            <Button onClick={() => this.delete(value.key, value.uid, index)}>Delete</Button>
                                        </CardBody>
                                        <CardFooter>{value.department}</CardFooter>
                                    </Card>
                                </div>
                            )
                        })
                    }
                </div>

            </div>
        );
    }
}

export default Complaints;
