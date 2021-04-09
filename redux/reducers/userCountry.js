import {LOAD_USER_COUNTRY, UPDATE_USER_COUNTRY} from '../types'

// FETCH & UPDATE USER COUNTRY DETAILS
export const userCountry = (state={}, action) => {
    switch (action.type){
        case LOAD_USER_COUNTRY:
            return {...action.country};
        case UPDATE_USER_COUNTRY:
            return {...action.country};
        default:
            return state;
    }
};