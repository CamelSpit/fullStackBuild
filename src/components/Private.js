import React, { Component } from 'react';
import {connect} from "react-redux";
import {getUserInfo} from '../ducks/users';

class Private extends Component{ //no export default here because we are doing it at the bottom to link to the reducer

    componentDidMount(){
        console.log('mounting and lauching getUserInfo')
        this.props.getUserInfo();
    }

    bankBalance() {
        return '$' + Math.floor((Math.random() + 1) * 1000) + '.00';
    }


    render() {
        const user = this.props.user;
        return (
            <div className=''>
                <h1>Community Bank</h1><hr />
                <h4>Account information:</h4>
                { user ? <img className='avatar' src={user.img} /> : null }
                <p>Username: { user ? user.user_name : null }</p>
                <p>Email: { user ? user.email : null }</p>
                <p>ID: { user ? user.auth_id : null }</p>
                <h4>Available balance: { user ? this.bankBalance() : null } </h4>
                <a href='http://localhost:4000/auth/logout'><button>Log out</button></a>
            </div> 
        )
}
}

function mapStateToProps(state){ //whatever we return here is merged with the props object for this component. This goes into this.props.user, which we can then use in this component. We have to use props because state is what is tracked locally, and props is what is passed from another component. 
    return{ 
        user: state.user
    }
}

export default connect(mapStateToProps, {getUserInfo})(Private) //invoke connect, and invoke whatever connect returns. Therefore, connect returns a function. Connect uses mapStateToProps to pass the entire store into this function. The second argument in connect, connects the action creator to the store. This then gets merged with the props object. 