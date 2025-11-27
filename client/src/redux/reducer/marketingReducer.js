// src/redux/reducer/marketingReducer.js
import { ADD_CAMPAIGN, DELETE_CAMPAIGN, UPDATE_CAMPAIGN, SET_CAMPAIGNS } from "../action/marketing";

const initialState = {
  campaigns: [],
  loading: false,
  error: null,
};

export default function marketingReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CAMPAIGNS:
      return { ...state, campaigns: action.payload || [] };

    case ADD_CAMPAIGN:
      return { ...state, campaigns: [...state.campaigns, action.payload] };

    case DELETE_CAMPAIGN:
      return {
        ...state,
        campaigns: state.campaigns.filter(
          c => (c._id || c.id) !== action.payload
        ),
      };

    case UPDATE_CAMPAIGN:
      return {
        ...state,
        campaigns: state.campaigns.map(c =>
          (c._id || c.id) === action.payload.id
            ? { ...c, ...action.payload.campaign }
            : c
        ),
      };

    default:
      return state;
  }
}
