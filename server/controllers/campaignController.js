import Campaign from '../models/campaign.js';
import asyncHandler from '../middleware/asyncHandler.js';
import mongoose from 'mongoose';

// CREATE
export const createCampaign = asyncHandler(async (req, res) => {
  // assume req.body is validated on the frontend / routes
  const payload = {
    ...req.body,
    createdBy: req.user ? req.user._id : undefined
  };
  const campaign = await Campaign.create(payload);
  res.status(201).json(campaign);
});

// GET ALL with filters, sorting, pagination
export const getCampaigns = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, type, search, sortBy, startDate, endDate } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (type) filter.type = type;
  if (search) filter.name = { $regex: search, $options: 'i' };
  if (startDate || endDate) {
    filter.$and = [];
    if (startDate) filter.$and.push({ startDate: { $gte: new Date(startDate) } });
    if (endDate) filter.$and.push({ endDate: { $lte: new Date(endDate) } });
  }

  const skip = (Number(page) - 1) * Number(limit);
  let query = Campaign.find(filter).skip(skip).limit(Number(limit));

  if (sortBy) {
    // example sortBy values: 'createdAt:desc' or 'spend:asc'
    const [field, order] = sortBy.split(':');
    query = query.sort({ [field]: order === 'asc' ? 1 : -1 });
  } else {
    query = query.sort({ createdAt: -1 });
  }

  const [campaigns, total] = await Promise.all([
    query.exec(),
    Campaign.countDocuments(filter)
  ]);

  res.json({ data: campaigns, meta: { total, page: Number(page), limit: Number(limit) } });
});

// GET ONE
export const getCampaignById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

  const campaign = await Campaign.findById(id).populate('assignedTo', 'name email');
  if (!campaign) return res.status(404).json({ message: 'Not found' });
  res.json(campaign);
});

// UPDATE
export const updateCampaign = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updated = await Campaign.findByIdAndUpdate(id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
});

// DELETE
export const deleteCampaign = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Campaign.findByIdAndDelete(id);
  res.json({ message: 'Deleted' });
});

// CLONE
export const cloneCampaign = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const original = await Campaign.findById(id);
  if (!original) return res.status(404).json({ message: 'Not found' });

  const cloneObj = original.toObject();
  delete cloneObj._id;
  cloneObj.name = `${cloneObj.name} (Clone)`;
  cloneObj.status = 'scheduled';
  cloneObj.createdAt = new Date();
  cloneObj.updatedAt = new Date();
  const clone = await Campaign.create(cloneObj);
  res.status(201).json(clone);
});

// STATS - aggregation example
export const stats = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const match = {};
  if (from || to) {
    match.createdAt = {};
    if (from) match.createdAt.$gte = new Date(from);
    if (to) match.createdAt.$lte = new Date(to);
  }

  // aggregation: totals and CPL by type
  const totals = await Campaign.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalSpend: { $sum: '$spend' },
        totalLeads: { $sum: '$leads' },
        campaigns: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        totalSpend: 1,
        totalLeads: 1,
        campaigns: 1,
        CPL: { $cond: [{ $gt: ['$totalLeads', 0] }, { $divide: ['$totalSpend', '$totalLeads'] }, 0] }
      }
    }
  ]);

  const byType = await Campaign.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$type',
        totalSpend: { $sum: '$spend' },
        totalLeads: { $sum: '$leads' },
        campaigns: { $sum: 1 }
      }
    },
    {
      $project: {
        type: '$_id',
        totalSpend: 1,
        totalLeads: 1,
        campaigns: 1,
        CPL: { $cond: [{ $gt: ['$totalLeads', 0] }, { $divide: ['$totalSpend', '$totalLeads'] }, 0] }
      }
    }
  ]);

  res.json({ totals: totals[0] || { totalSpend: 0, totalLeads: 0, campaigns: 0, CPL: 0 }, byType });
});
