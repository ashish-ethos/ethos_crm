import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema({
  name: String,
  type: String,
  status: String,
  dailyBudget: Number,
  totalBudget: Number,
  startDate: Date,
  endDate: Date,
  location: String,
  language: String,
  biddingStrategy: String,
  keywords: String,
  leads: Number,
  spend: Number
}, { timestamps: true });

export default mongoose.model("Campaign", CampaignSchema);
