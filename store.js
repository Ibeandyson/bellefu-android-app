import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import AsyncStorage from '@react-native-async-storage/async-storage';


import {
    userSigninReducer,
    userSignupReducer,
    userUpdateReducer,
    searchFilterRuducer
} from './redux/reducers/userRucer';

import {
    userCountry,
} from './redux/reducers/userCountry'

// import {
//     languagee,
// } from './reducers/language'




const country =  AsyncStorage.getItem('country') || {}
// const userLanguage = Cookie.getJSON('language') || 'en'

 
 const token = AsyncStorage.getItem('user') 

export const initialState = {
    
    userSignin: { token},
    userCountry: country,
    // language: userLanguage
}

const  reducers = combineReducers({
     //USER STORE
     userSignin: userSigninReducer,
     userSignup: userSignupReducer,
    //  userUpdate: userUpdateReducer,
    //  porductSearchFilter:searchFilterRuducer,
     userCountry: userCountry,
    //  language: languagee
 
})

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducers,initialState,  composeEnhancer(applyMiddleware(thunk)))


export default store;