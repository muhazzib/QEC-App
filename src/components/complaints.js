import React, { Component } from 'react';
import { browserHistory } from 'react-router'
import { fire, database } from '../fire'
import '../App.css'
class Complaints extends Component {
    constructor(props) {
        super(props);
        this.state = {
            complaints: []
        }
    }

    componentWillMount() {
        database.child('complaints/').on("child_added", (snapshot) => {
            let obj = snapshot.val()
            console.log(snapshot.key, 'obj.key obj.key')
            let complaints = this.state.complaints;
            Object.keys(obj).forEach(function (key) {
                console.log(key, '---------------')
                var value2 = obj[key];
                value2.key = key;
                value2.uid=snapshot.key
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
delete=(key,uid,arrayIndex)=>{
    database.child('complaints/'+uid).child(key).remove().then(()=>{
        const dupComp=this.state.complaints;
        dupComp.splice(arrayIndex,1)
        this.setState({
            complaints:dupComp
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
                        <li>Home</li>
                        <li onClick={() => browserHistory.push('/users')}>Users</li>
                        <li onClick={() => browserHistory.push('/complaints')}>Complaints</li>
                        <li>Stats</li>
                    </ul>
                </div>
                <div className='home-child2'>
                    <h1>Complaints</h1>
                    {
                        this.state.complaints.map((value, index) => {
                            return (
                                <div>
                                    <h6>{value.name}</h6>
                                    <p>{value.details}</p>
                                    <button onClick={()=>this.delete(value.key,value.uid,index)}>Delete</button>
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
