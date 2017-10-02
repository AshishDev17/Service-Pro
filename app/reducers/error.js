/**
 * ACTION TYPES
 */
const GET_ERROR = 'GET_ERROR';
const CLEAR_ERROR = 'CLEAR_ERROR';

/**
 * INITIAL STATE
 */

const error = '';

/**
 * ACTION CREATORS
 */

export const getError = (err) => ({ type: GET_ERROR, err });
export const clearError = () => ({ type: CLEAR_ERROR });

/**
 * REDUCER
 */
export default function(state = error, action) {
  switch (action.type) {
    case GET_ERROR:
      return action.err;
    case CLEAR_ERROR:
      return error;
    default:
      return state;
  }
}
