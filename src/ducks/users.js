import axios from 'axios';

const initialState = {
    user: {}
}

const GET_USER_INFO = 'GET_USER_INFO';

export function getUserInfo(){ //action creator. creates the action that will be fire from your component
    console.log('getting user info');
    let userData = axios.get("/auth/me").then(res=>{
        console.log(res.data);
        return res.data;
    })

    return{
    type: GET_USER_INFO, 
    payload: userData
    } //due to the async nature from axios, this return may fire before we have userData. Redux promise middleware comes in to fix this. It checks the value of the payload. If it is a promise object, the middleware will 'do it's thang'
}

export default function reducer(state=initialState, action){ //takes in an action and state. State comes from the store, which has the current state. The reducer returns the updated state to the store. 
    switch(action.type){
        case GET_USER_INFO + '_FULFILLED': //the second part comes from the promise middleware. There's also _pending and _rejected. Can do cool animation loading bars with _pending. 
            return Object.assign({}, state, {user: action.payload})
    default:
        return state;
    }
}