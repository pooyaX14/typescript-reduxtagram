import { routerReducer } from 'react-router-redux';

import { reducers as registrationReducer} from '../screens/Register/store/reducer';
import { posts as postListReducer } from '../screens/PostList/store/reducer';
import { postComments as postCommentsReducer} from '../screens/Post/store/reducer';
import { reducers as loginReducer } from '../screens/Login/store/reducer';

import { combineReducers } from 'redux';
import { UserSession } from "./types";

export const defaultUserSessionProps: UserSession = {
  isLoggedIn: false,
  isLoading: true
}

export function userSessionReducers(state: UserSession = defaultUserSessionProps, action: any) : UserSession {
  switch(action.type){
    case 'FETCH_USER_SESSION':
      return {
        ...state,
        isLoading: true
      }
    case 'SET_USER_SESSION':
      return {
        ...state,
        isLoggedIn: true,
        user: action.data,
        isLoading: false,
      };
    case 'REMOVE_USER_SESSION':
        return {
          isLoggedIn: false,
          isLoading: false
        };
    default:
      return state;
    }
}

const appReducer = combineReducers({
  registration_screen: registrationReducer,
  login_screen: loginReducer,
  postList_screen: postListReducer,
  postInfo_screen: postCommentsReducer,
  user_session: userSessionReducers,
  routing: routerReducer
});

const rootReducer = (state: any, action: any) => {
  return appReducer(state, action);
}

export default rootReducer;