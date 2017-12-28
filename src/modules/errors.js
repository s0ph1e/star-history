export const ADD_ERROR = 'errors/ADD_ERROR';
export const REMOVE_ERROR = 'errors/REMOVE_ERROR';

const initialState = {
	items: []
};

export default (state = initialState, action) => {
	switch (action.type) {
		case ADD_ERROR:
			return {
				...state,
				items: state.items.concat([action.error])
			};

		case REMOVE_ERROR:
		    return {
				...state,
				items: state.items.filter((error, i) => i !== action.index)
			};

		default:
			return state;
	}
}

export const addError = ({error}) => {
	return dispatch => dispatch({
		type: ADD_ERROR,
		error
	});
};

export const removeError = ({index}) => {
	return dispatch => dispatch({
		type: REMOVE_ERROR,
		index
	});
};
