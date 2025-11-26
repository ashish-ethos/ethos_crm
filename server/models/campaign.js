import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['search','display','video','pmax'], default: 'search' },
  status: { type: String, enum: ['scheduled','active','paused','stopped'], default: 'scheduled' },
  dailyBudget: { type: Number, default: 0 },
  totalBudget: { type: Number, default: 0 },
  startDate: Date,
  endDate: Date,
  location: String,
  language: String,
  biddingStrategy: String,
  keywords: [String],
  leads: { type: Number, default: 0 },
  spend: { type: Number, default: 0 },
  creatives: [{ url: String, type: String }], 
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  meta: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

// quick indexes for filters/sorts
CampaignSchema.index({ status: 1 });
CampaignSchema.index({ type: 1 });
CampaignSchema.index({ createdAt: -1 });

export default mongoose.model("Campaign", CampaignSchema);
