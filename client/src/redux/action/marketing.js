// src/redux/action/marketing.js
export const ADD_CAMPAIGN = "ADD_CAMPAIGN";
export const DELETE_CAMPAIGN = "DELETE_CAMPAIGN";
export const UPDATE_CAMPAIGN = "UPDATE_CAMPAIGN";
export const SET_CAMPAIGNS = "SET_CAMPAIGNS";

export const addCampaign = (campaign) => ({ type: ADD_CAMPAIGN, payload: campaign });
export const deleteCampaign = (id) => ({ type: DELETE_CAMPAIGN, payload: id });
export const updateCampaign = (id, campaign) => ({ type: UPDATE_CAMPAIGN, payload: { id, campaign } });
export const setCampaigns = (campaigns) => ({ type: SET_CAMPAIGNS, payload: campaigns });
