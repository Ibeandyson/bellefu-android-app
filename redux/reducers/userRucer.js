import {
	USER_SIGNIN_REQUEST,
	USER_SIGNIN_SUCCESS,
	USER_SIGNIN_FAIL,
	USER_SIGNUP_REQUEST,
	USER_SIGNUP_SUCCESS,
	USER_SIGNUP_FAIL,
	USER_UPDATE_FAIL,
	USER_UPDATE_SUCCESS,
	USER_UPDATE_REQUEST,
	SEARCH_FILTER,
	USER_LOGOUT
} from "../types";




//REDUCER FOR USER SINGNIN
export const userSigninReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_SIGNIN_REQUEST:
			return {
				loading: true
			};
		case USER_SIGNIN_SUCCESS:
			return {
				loading: false,
				user: action.payload
			};
		case USER_SIGNIN_FAIL:
			return {
				loading: false,
				error: action.payload
			};
		case USER_LOGOUT:
			return {
				user: {}
			};
		default:
			return state;
	}
};


//REDUCER FOR USER SIGNUP
export const userSignupReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_SIGNUP_REQUEST:
			return {
				loading: true
			};
		case USER_SIGNUP_SUCCESS:
			return {
				loading: false,
				user: action.payload
			};
		case USER_SIGNUP_FAIL:
			return {
				loading: false,
				error: action.payload
			};
		default:
			return state;
	}
};
