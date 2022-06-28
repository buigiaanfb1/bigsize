import {
  SIZE_LIST_REQUEST,
  SIZE_LIST_SUCCESS,
  SIZE_LIST_FAIL,
} from "../../service/Validations/VarConstant";

export const listSizeReducer = (state = { loading: true, data: [], error: "" }, action) => {
  switch (action.type) {
    case SIZE_LIST_REQUEST:
      return { ...state, loading: true };
    case SIZE_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case SIZE_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
