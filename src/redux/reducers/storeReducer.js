import {
  STORE_LIST_REQUEST,
  STORE_LIST_SUCCESS,
  STORE_LIST_FAIL,
  CREATE_STORE_REQUEST,
  CREATE_STORE_SUCCESS,
  CREATE_STORE_FAIL,
  DELETE_STORE_REQUEST,
  DELETE_STORE_SUCCESS,
  DELETE_STORE_FAIL,
  VIEW_DETAIL_STORE_REQUEST,
  VIEW_DETAIL_STORE_SUCCESS,
  VIEW_DETAIL_STORE_FAIL,
  UPDATE_STORE_REQUEST,
  UPDATE_STORE_SUCCESS,
  UPDATE_STORE_FAIL,
  STORE_LIST_DROPDOWN_REQUEST,
  STORE_LIST_DROPDOWN_SUCCESS,
  STORE_LIST_DROPDOWN_FAIL,
} from "../../service/Validations/VarConstant";

function resultArr(payload) {
  let result = [];
  const newArray = [...payload];
  result = newArray.map(({ store_id, store_name, status }) => ({
    key: store_id.toString(),
    text: store_name,
    value: store_id,
    status,
  }));
  return result;
}

export const listStoreReducer = (state = { loading: true, data: [], error: "" }, action) => {
  switch (action.type) {
    case STORE_LIST_REQUEST:
      return { ...state, loading: true };
    case STORE_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case STORE_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const viewDetailStoreReducer = (state = { loading: true, data: [], error: "" }, action) => {
  switch (action.type) {
    case VIEW_DETAIL_STORE_REQUEST:
      return { ...state, loading: true };
    case VIEW_DETAIL_STORE_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case VIEW_DETAIL_STORE_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const createStoreReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_STORE_REQUEST:
      return { ...state, loading: true };
    case CREATE_STORE_SUCCESS:
      return { ...state, loading: false, success: action.payload };
    case CREATE_STORE_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const updateStoreReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case UPDATE_STORE_REQUEST:
      return { ...state, loading: true };
    case UPDATE_STORE_SUCCESS:
      return { ...state, loading: false, success: action.payload };
    case UPDATE_STORE_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const deleteStoreReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_STORE_REQUEST:
      return { ...state, loading: true };
    case DELETE_STORE_SUCCESS:
      return { ...state, loading: false, success: action.payload };
    case DELETE_STORE_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const listStoreDropdownReducer = (
  state = { loading: true, store: [], error: "" },
  action
) => {
  switch (action.type) {
    case STORE_LIST_DROPDOWN_REQUEST:
      return { ...state, loading: true };
    case STORE_LIST_DROPDOWN_SUCCESS:
      return {
        ...state,
        loading: false,
        store: [...resultArr(action.payload)],
      };
    case STORE_LIST_DROPDOWN_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
