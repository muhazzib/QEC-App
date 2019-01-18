import React, { Component } from 'react';
import { browserHistory } from 'react-router'
import { fire, database } from '../fire'
import {
    Card, Button, CardHeader, CardFooter, CardBody,
    CardTitle, CardText
} from 'reactstrap';
import '../App.css'
import myComp from '../Graphics/My Complaints.svg';
import home from '../Graphics/Home.svg';


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
                        <li className='list-Item' onClick={() => browserHistory.push({ pathname: '/', state: { user: this.state.user } })}>
                            <table>
                                <tr>
                                    <td><img src={home} width='20px' height= '30px'/></td>
                                    <td width='12px'></td>
                                    <td style={{paddingTop: 10}}> Home</td>
                                </tr>
                            </table>
                        </li>
                        <li className='list-Item seleted'>
                            <table>
                                <tr>
                                    <td><img src={myComp} width='20px' height= '30px'/></td>
                                    <td width='12px'></td>
                                    <td style={{paddingTop: 10}}>My Complaints</td>
                                </tr>
                            </table>
                        </li>
                    </ul>
                </div>
                <div className='home-child2'>
                    <div className='body'>
                        <h1>My Complaints</h1>
                        {
                            this.state.mycomplaints.map((value, index) => {
                                return (
                                    <div>

                                        <Card className= 'complaint'>
                                            <CardHeader className='complaint-header' style={{ fontWeight: 'bolder'}}><h3>{value.name}</h3></CardHeader>
                                            <CardBody>
                                                {/* <CardTitle>Special Title Treatment</CardTitle> */}
                                                <CardText className='card-text'>{value.details}</CardText>
                                            </CardBody>
                                            <CardFooter><span className='disabled'>Sent to: </span><h4>{value.department}</h4></CardFooter>
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
