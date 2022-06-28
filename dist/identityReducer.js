export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const REGISTER = 'REGISTER';
export const UPDATE_USER = 'UPDATE_USER';
export const ACCESS_TOKEN_REFRESHED = 'ACCESS_TOKEN_REFRESH';
/**
 * {
    first_name: '',
    middle_name: '',
    last_name: '',
    full_name: '',
    username: null,
    groups: [],
    email: null,
    access_token: null,
    refresh_token: null
    }
 */

export const initialIdentityState = {
  users: [],
  activeUser: null,
  first_name: '',
  middle_name: '',
  last_name: '',
  full_name: '',
  username: null,
  groups: [],
  email: null,
  access_token: null,
  refresh_token: null
};

function identityReducer(state = initialIdentityState, action) {
  switch (action.type) {
    case UPDATE_USER:
      const {
        first_name,
        middle_name,
        last_name,
        email,
        groups,
        username
      } = action.payload;
      return { ...state,
        first_name,
        last_name,
        middle_name,
        groups,
        username,
        full_name: `${first_name} ${middle_name ? middle_name + ' ' : ''}${last_name}`,
        email
      };

    case ACCESS_TOKEN_REFRESHED:
      const {
        access_token
      } = action.payload;
      return { ...state,
        access_token
      };

    case LOGIN:
      const {
        payload
      } = action;
      return {
        access_token: payload.access_token,
        refresh_token: payload.refresh_token
      };

    default:
      return { ...state
      };
  }
}

export default identityReducer;