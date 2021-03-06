import axios from 'axios';
import getBaseUrl from "../../../helpers/config";
const apiUrl = `${getBaseUrl()}`;

// Action Types
export enum ActionTypes {
  INCREMENT_LIKES = 'INCREMENT_LIKES',
  GET_POSTLIST = 'GET_POSTLIST',
  POSTLIST_FAILURE= 'POSTLIST_FAILURE',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}
export interface IncrementAction {
  type: ActionTypes.INCREMENT_LIKES,
  index: number
}

export const actionCreators = {
  increment:
   (index: number) : IncrementAction=> {
    return {
      type: ActionTypes.INCREMENT_LIKES,
      index: index
    }
  }
}
// //action Type
// export const GET_POSTLIST = 'GET_POSTLIST';
// export const SUCCESS = 'SUCCESS';
// export const FAILURE = 'FAILURE';

// export interface SuccessReturnType {
//   type: ActionTypes.GET_POSTLIST
//   status: ActionTypes.SUCCESS
//   data: PostListResponseDataType
// }

interface PostListResponseDataType {
  code: string;
  caption: string;
  likes: number;
  display_src: string;
  totalComments: number;
}

function success(actionType: ActionTypes.GET_POSTLIST, data: PostListResponseDataType){
  return {
    type: actionType,
    status: ActionTypes.SUCCESS,
    data: data
  };
}
function error(actionType: ActionTypes.POSTLIST_FAILURE, error: any) {
  return {
    type: actionType,
    status: ActionTypes.FAILURE,
    error
  };
}
// get all the question
// export const getQuestions = () => {
//   return async (dispatch) => {
//     // dispatch(startRequest(GET_QUESTIONS_REQUESTING));
//     const path = config.base_url + `/api/v1/question/get_questions`;
//     try {
//       const response = await axios({
//         method: 'get',
//         url: path
//       });
//       dispatch(successRequest(GET_POSTLIST, response.data));
//     } catch (e) {
//       console.log(e);
//       let err = e.response ? e.response.data.err : e.message;
//       dispatch(failureRequest(GET_QUESTIONS_FAILURE, err));
//     }
//   };
// };
export function getPostListData() {
  return (dispatch: any) => {
    return axios.get(`${apiUrl}/posts`)
      .then(response => {
        dispatch(success(ActionTypes.GET_POSTLIST, response.data.posts))
      })
      .catch(error => {
        console.log(error);
        dispatch(error(ActionTypes.POSTLIST_FAILURE, error))
        throw(error);
      });
  };
}
