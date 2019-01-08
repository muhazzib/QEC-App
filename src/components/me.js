import React, { Component } from 'react';
import { browserHistory } from 'react-router'
import { fire, database } from '../fire'
import {
    Card, Button, CardHeader, CardFooter, CardBody,
    CardTitle, CardText
} from 'reactstrap';
import '../App.css'

class Me extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mycomplaints: [],
            user: ''
        }
    }
    componentDidMount() {
        console.log(this.props, '-------aa')
        if (this.props.location.state) {
            let UserObj = {
                role: this.props.location.state.user.role,
                uid: this.props.location.state.user.uid
            }
            this.setState({
                user: UserObj
            })




            let myComArray = [];
            database.child('complaints/' + UserObj.uid).on("child_added", (snapshot) => {
                let obj = snapshot.val();
                obj.key = snapshot.key;
                myComArray.push(obj)
                this.setState({
                    mycomplaints: myComArray
                })
                console.log('obj obj', obj, 'obj obj')
            })
        }

        else {

        }
    }
    // delete=(key,uid,arrayIndex)=>{
    //     database.child('complaints/'+uid).child(key).remove().then(()=>{
    //         const dupComp=this.state.complaints;
    //         dupComp.splice(arrayIndex,1)
    //         this.setState({
    //             complaints:dupComp
    //         })
    //     })
    // }

    render() {

        return (
            <div className='home-main-div'>
                <div className='home-child1'>
                    <ul className='nav-list'>
                        <li className='list-Item' onClick={() => browserHistory.push({ pathname: '/', state: { user: this.state.user } })}>Home</li>
                        <li className='list-Item seleted'>My Complaints</li>
                    </ul>
                </div>
                <div className='home-child2'>
                    <div className='body'>
                        <h1>My Complaints</h1>
                        {
                            this.state.mycomplaints.map((value, index) => {
                                return (
                                    <div>

                                        <Card>
                                            <CardHeader>{value.name}</CardHeader>
                                            <CardBody>
                                                <CardTitle>Special Title Treatment</CardTitle>
                                                <CardText>{value.details}</CardText>
                                            </CardBody>
                                            <CardFooter>{value.department}</CardFooter>
                                        </Card>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

            </div>
        );
    }
}

export default Me;
