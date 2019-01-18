import React, { Component } from 'react';
import { browserHistory } from 'react-router'
import { fire, database } from '../fire'
import {
    Card, Button, CardHeader, CardFooter, CardBody,
    CardTitle, CardText
} from 'reactstrap';
import swal from 'sweetalert';
import '../App.css';
import home from '../Graphics/Home.svg';
import comps from '../Graphics/Complaints.svg';
import users from '../Graphics/Users-01.svg';

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
    resolve=(obj,arrayIndex)=>{
        let Newobj = {
            name: obj.name,
            department: obj.department,
            details: obj.details,
            resolved:obj.resolved==false?true:false
        }
        let LocalNewobj = {
            name: obj.name,
            department: obj.department,
            details: obj.details,
            resolved:obj.resolved==false?true:false,
            uid:obj.uid,
            key:obj.key
        }
        
        database.child('complaints/' + obj.uid).child(obj.key).update(Newobj).then((success) => {
            const dupComp = this.state.complaints;
            dupComp.splice(arrayIndex, 1,LocalNewobj)
            this.setState({
                complaints: dupComp
            })
        }).then(()=>{
            swal("Success!", `Complaint has been ${obj.resolved?'unresolved':'resolved'}`, "success");
        })
    }
    render() {
        console.log(this.state.complaints, 'onbjbdaj')

        return (
            <div className='home-main-div'>
                <div className='home-child1'>
                    <ul className='nav-list'>
                        <li onClick={() => browserHistory.push({ pathname: '/', state: { user: this.state.user } })}>
                            <table>
                                <tr>
                                    <td><img src={home} width='20px' height= '30px'/></td>
                                    <td width='12px'></td>
                                    <td style={{paddingTop: 10}}> Home</td>
                                </tr>
                            </table>
                        </li>
                        <li onClick={() => browserHistory.push('/users')}>
                            <table>
                                <tr>
                                    <td><img src={users} width='20px' height= '30px'/></td>
                                    <td width='12px'></td>
                                    <td style={{paddingTop: 10}}>Users</td>
                                </tr>
                            </table>    
                        </li>
                        <li onClick={() => browserHistory.push('/complaints')}>
                            <table>
                                <tr>
                                    <td><img src={comps} width='20px' height= '30px'/></td>
                                    <td width='12px'></td>
                                    <td style={{paddingTop: 10}}>Complaints</td>
                                </tr>
                            </table>
                        </li>
                    </ul>
                </div>
                <div className='home-child2'>
                    <h1 className='addComplainH'>Complaints</h1>
                    {
                        this.state.complaints.map((value, index) => {
                            return (
                                <div>

                                    <Card className= 'complaint'>
                                        <CardHeader className='complaint-header' style={{ fontWeight: 'bolder'}}><h3>{value.name}</h3></CardHeader>
                                        <CardBody>
                                            {/* <CardTitle>Special Title Treatment</CardTitle> */}
                                            <CardText>{value.details}</CardText>
                                            <Button outline color= 'danger' onClick={() => this.delete(value.key, value.uid, index)}>Delete</Button>
                                            &nbsp;&nbsp;
                                            <Button outline color= {value.resolved?'primary':'success'} onClick={()=>this.resolve(value,index)}>{value.resolved==false?'Mark as resolved.':'Mark as unresolved.'}</Button>
                                        </CardBody>
                                        <CardFooter><span className='disabled'>Sent to: </span><h4>{value.department}</h4></CardFooter>
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
