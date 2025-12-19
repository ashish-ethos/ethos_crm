import Lead from '../models/lead.js';
import User from '../models/user.js';
import FollowUp from '../models/followUp.js';
import Project from '../models/project.js';
import { createError, isValidDate } from '../utils/error.js';
import projectModel from '../models/project.js';
import userModel from '../models/user.js';

export const getLead = async (req, res, next) => {
    try {
        const { leadId } = req.params;
        const findedLead = await Lead.findById(leadId)
            .populate('client')
            .populate('allocatedTo')
            .populate('property')
            .exec();

        if (!findedLead) return next(createError(400, 'Lead not exist'));

        res.status(200).json({ result: findedLead, message: 'Lead fetched successfully', success: true });
    } catch (err) {
        next(createError(500, err.message));
    }
};

export const getLeads = async (req, res, next) => {
    try {
        const findedLeads = await Lead.find().populate('client').populate('allocatedTo').populate('property').exec();
        res.status(200).json({ result: findedLeads, message: 'Leads fetched successfully', success: true });
    } catch (err) {
        next(createError(500, err.message));
    }
};

export const getLeadByPhone = async (req, res, next) => {
    try {
        const { phone } = req.params;
        const findedUser = await User.findOne({ phone });
        const findedLead = await Lead.find({ client: findedUser?._id })
            .populate('client')
            .populate('allocatedTo')
            .populate('property')
            .exec();

        res.status(200).json({ result: findedLead, message: 'Lead fetched successfully', success: true });
    } catch (err) {
        next(createError(500, err.message));
    }
};

export const getEmployeeLeads = async (req, res, next) => {
    try {
        const findedLeads = await Lead.find({ allocatedTo: req.user?._id, isArchived: false })
            .populate('property')
            .populate('client')
            .populate('allocatedTo')
            .exec();

        res.status(200).json({ result: findedLeads, message: 'Leads fetched successfully', success: true });
    } catch (err) {
        next(createError(500, err.message));
    }
};



const priorities = [
    { name: "Very Hot", value: 'veryHot' },
    { name: "Hot", value: 'hot' },
    { name: "Moderate", value: 'moderate' },
    { name: "Cold", value: 'cold' },
    { name: "Very Cold", value: 'veryCold' },
];
const sources = [
    { name: "Instagram", value: 'instagram' },
    { name: "Facebook", value: 'facebook' },
    { name: "Facebook Comment", value: 'facebookComment' },
    { name: "Friend and Family", value: 'friendAndFamily' },
    { name: "Direct Call", value: 'directCall' },
    { name: "Google", value: 'google' },
    { name: "Referral", value: 'referral' },
];
const statuses = [
    { name: "New", value: 'new' },
    { name: "Closed (Lost)", value: 'closedLost' },
    { name: "Closed (Won)", value: 'closedWon' },
    { name: "Meeting (Done)", value: 'meetingDone' },
    { name: "Meeting (Attempt)", value: 'meetingAttempt' },
    { name: "Followed Up (Call)", value: 'followedUpCall' },
    { name: "Followed Up (Email)", value: 'followedUpEmail' },
    { name: "Contacted Client (Call)", value: 'contactedClientCall' },
    { name: "Contacted Client (Call Attempt)", value: 'contactedClientCallAttempt' },
    { name: "Contacted Client (Email)", value: 'contactedClientEmail' },
    { name: "Not Interested", value: 'notInterested' },
    { name: "Not Answering", value: 'notAnswering' },
];

export const getLeadsStat = async (req, res, next) => {
    const { type } = req.query;

    try {
        let pipeline = [];

        switch (type) {
            case 'status':
                pipeline = [
                    {
                        $group: {
                            _id: '$status',
                            count: { $sum: 1 },
                        },
                    },
                ];
                break;

            case 'priority':
                pipeline = [
                    {
                        $group: {
                            _id: '$priority',
                            count: { $sum: 1 },
                        },
                    },
                ];
                break;

            case 'source':
                pipeline = [
                    {
                        $group: {
                            _id: '$source',
                            count: { $sum: 1 },
                        },
                    },
                ];
                break;

            case 'property':
                pipeline = [
                    {
                        $group: {
                            _id: '$property',
                            count: { $sum: 1 },
                        },
                    },
                ];
                break;

            default:
                return res.status(400).json({ error: 'Invalid type' });
        }

        const aggregatedResult = await Lead.aggregate(pipeline);

        if (type === 'property') {
            const allProjects = await Project.find({}, { title: 1, _id: 1 });
            const projectCounts = {};

            allProjects.forEach((project) => {
                projectCounts[project._id] = 0;
            });

            aggregatedResult.forEach((item) => {
                const projectId = item._id;
                const count = item.count || 0;
                projectCounts[projectId] = count;
            });

            const updatedResult = Object.entries(projectCounts).map(([projectId, count]) => {
                const project = allProjects.find((p) => p._id.toString() === projectId);
                const name = project ? project.title : '';
                return { _id: projectId, name, count };
            });

            res.status(200).json({ result: updatedResult, message: 'Stats fetched successfully.' });
        } else {
            const itemCounts = {};
            const allItems = type == 'priority' ? priorities : type == 'source' ? sources : statuses;

            allItems.forEach((item) => {
                itemCounts[item.value] = 0;
            });

            aggregatedResult.forEach((item) => {
                const itemName = item._id;
                const count = item.count || 0;
                itemCounts[itemName] = count;
            });

            const updatedResult = Object.keys(itemCounts).map((itemValue) => {
                const itemName = allItems.find((item) => item.value === itemValue)?.name || itemValue;
                return { _id: itemValue, name: itemName, count: itemCounts[itemValue] };
            });

            res.status(200).json({ result: updatedResult, message: 'Stats fetched successfully.' });
        }
    } catch (error) {
        next(createError(500, error));
    }
};

export const searchLead = async (req, res, next) => {
    try {
        const { query } = req.query;

        const foundLeads = await Lead.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'client',
                    foreignField: '_id',
                    as: 'clientData',
                },
            },
            {
                $match: {
                    $or: [
                        { 'clientData.firstName': { $regex: new RegExp(query, 'i') } },
                        { 'clientData.lastName': { $regex: new RegExp(query, 'i') } },
                        { 'clientData.username': { $regex: new RegExp(query, 'i') } },
                        { 'clientData.phone': { $regex: new RegExp(query, 'i') } },
                        { 'status': { $regex: new RegExp(query, 'i') } },
                        { 'priority': { $regex: new RegExp(query, 'i') } },
                        { 'city': { $regex: new RegExp(query, 'i') } },
                    ],
                },
            },
            {
                $project: {
                    client: { $arrayElemAt: ['$clientData', 0] },
                    city: 1,
                    priority: 1,
                    status: 1,
                    source: 1,
                    description: 1,
                    uid: 1,
                },
            },
        ]);

        res.status(200).json({
            result: foundLeads,
            message: 'Leads searched successfully',
            success: true,
        });
    } catch (err) {
        next(createError(500, err.message));
    }
};

const buildFilters = (query) => {
    const filters = {};

    Object.entries(query).forEach(([key, value]) => {
        if (!value) return;

        if (key === "startingDate" || key === "endingDate") return;

        if (typeof value === "string" && value.includes(",")) {
            filters[key] = {
                $in: value.split(",").map(v => v.trim()).filter(Boolean),
            };
            return;
        }

        filters[key] = { $regex: `^${value}$`, $options: "i" };
    });

    return filters;
};

export const filterLead = async (req, res, next) => {
    const { startingDate, endingDate } = req.query;

    try {
        const filters = buildFilters(req.query);

        let query = Lead.find(filters);

        if (startingDate && isValidDate(startingDate)) {
            const startDate = new Date(startingDate);
            startDate.setHours(0, 0, 0, 0);
            query = query.where("createdAt").gte(startDate);
        }

        if (endingDate && isValidDate(endingDate)) {
            const endDate = new Date(endingDate);
            endDate.setHours(23, 59, 59, 999);
            query = query.where("createdAt").lte(endDate);
        }
  
        const leads = await query
            .populate("property")
            .populate("client")
            .populate("allocatedTo")
            .exec();

        res.status(200).json({
            result: leads,
            success: true,
            message: "Leads filtered successfully",
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};

export const createLead = async (req, res, next) => {
    try {
        const { city, priority, property, status, source, description, count, clientName, clientPhone } = req.body;
        const { followUpStatus, followUpDate, remarks } = req.body  // for followup

        const foundLead = await User.findOne({ phone: clientPhone });

        const leadsToCreate = Number(count) || 1;
        const createdLeads = [];

        for (let i = 0; i < leadsToCreate; i++) {
            const newLead = await Lead.create({
                client: foundLead ? foundLead._id : null,
                city,
                clientName,
                clientPhone,
                priority,
                property,
                status,
                source,
                description,
                allocatedTo: [req.user?._id],
            });

            await FollowUp.create({ status: followUpStatus, followUpDate, remarks, leadId: newLead._id })


            const populatedLead = await Lead.findById(newLead._id)
                .populate('client')
                .populate('property')
                .populate('allocatedTo')
                .exec();

            createdLeads.push(populatedLead);
        }

        res.status(200).json({
            result: createdLeads,
            message: `Lead(s) created successfully (${createdLeads.length} lead(s) created)`,
            success: true,
        });
    } catch (err) {
        next(createError(500, err.message));
    }
};

export const updateLead = async (req, res, next) => {
    try {
        const { leadId } = req.params;
        const {
            firstName, lastName, username, phone, CNIC, clientCity,
            city, priority, property, status, source, description,
        } = req.body;

        const foundLead = await Lead.findById(leadId);

        const updatedUser = await User.findByIdAndUpdate(
            foundLead.client,
            { firstName, lastName, username, phone, CNIC, city: clientCity, project: property },
        );

        const updatedLead = await Lead.findByIdAndUpdate(
            leadId,
            { city, priority, property, status, source, description, ...req.body },
            { new: true },
        )
            .populate('property')
            .populate('client')
            .populate('allocatedTo')
            .exec();

        res.status(200).json({ result: updatedLead, message: 'Lead updated successfully', success: true });
    } catch (err) {
        next(createError(500, err.message));
    }
};

export const shiftLead = async (req, res, next) => {
    try {
        const { leadId } = req.params;
        const { shiftTo } = req.body;

        const updatedLead = await Lead.findByIdAndUpdate(
            leadId,
            { $set: { allocatedTo: [shiftTo] } },
            { new: true },
        )
            .populate('property')
            .populate('client')
            .populate('allocatedTo')
            .exec();

        res.status(200).json({
            result: updatedLead,
            message: 'Lead shifted successfully',
            success: true,
        });
    } catch (err) {
        next(createError(500, err.message));
    }
};

export const shareLead = async (req, res, next) => {
    try {
        const { leadId } = req.params;
        const { shareWith } = req.body;

        const updatedLead = await Lead.findByIdAndUpdate(
            leadId,
            { $push: { allocatedTo: shareWith } },
            { new: true },
        )
            .populate('property')
            .populate('client')
            .populate('allocatedTo')
            .exec();

        res.status(200).json({
            result: updatedLead,
            message: 'Lead shared successfully',
            success: true,
        });
    } catch (err) {
        next(createError(500, err.message));
    }
};

export const archiveLead = async (req, res, next) => {
    try {
        const { leadId } = req.params;
        const result = await Lead.findByIdAndUpdate(leadId, { $set: { isArchived: true } }, { new: true });
        res.status(200).json({ result, message: 'Lead archived successfully', success: true });
    } catch (err) {
        next(createError(500, err.message));
    }
};

export const deleteLead = async (req, res, next) => {
    try {
        const { leadId } = req.params;
        const foundLead = await Lead.findById(leadId);

        if (!foundLead) return next(createError(400, 'Lead not exist'));

        const deletedLead = await Lead.findByIdAndDelete(leadId);
        res.status(200).json({ result: deletedLead, message: 'Lead deleted successfully', success: true });
    } catch (err) {
        next(createError(500, err.message));
    }
};

export const deleteWholeCollection = async (req, res, next) => {
    try {
        const result = await Lead.deleteMany();
        res.status(200).json({ result, message: 'Lead collection deleted successfully', success: true });
    } catch (err) {
        next(createError(500, err.message));
    }
};

const getRangeFromPeriod = (period, startingDate, endingDate) => {
    const now = new Date();
    let startDate = null;
    let endDate = null;

    if (!period || period === 'date') {
        // treat 'date' as today
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);
    } else if (period === 'week') {
        // last 7 days including today
        endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 6); // 7 day window
        startDate.setHours(0, 0, 0, 0);
    } else if (period === 'month') {
        endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 1);
        startDate.setHours(0, 0, 0, 0);
    } else if (period === 'range') {
        if (startingDate && isValidDate(startingDate)) {
            startDate = new Date(startingDate);
            startDate.setHours(0, 0, 0, 0);
        }
        if (endingDate && isValidDate(endingDate)) {
            endDate = new Date(endingDate);
            endDate.setHours(23, 59, 59, 999);
        }
    }
    return { startDate, endDate };
};

// Add this at top of file
const shuffle = (array) => {
    return array
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
};

export const getShuffleLeads = async (req, res, next) => {
    try {
        let leads = await Lead.find({})
            .populate("property")
            .populate("client")
            .populate("allocatedTo");

        leads = shuffle(leads);

        res.status(200).json({
            result: leads,
            message: "Leads shuffled successfully",
            success: true,
        });
    } catch (error) {
        next(error);
    }
};



export const assignShuffledLead = async (req, res, next) => {
    try {
        const { leadId } = req.params;
        const { assignTo, setAsPrimary } = req.body; // assignTo: userId, setAsPrimary: boolean

        if (!assignTo) return next(createError(400, 'assignTo (employee id) is required'));

        // If setAsPrimary true -> replace allocatedTo with [assignTo], else push if not already present
        let updated;
        if (setAsPrimary) {
            updated = await Lead.findByIdAndUpdate(
                leadId,
                { $set: { allocatedTo: [assignTo] } },
                { new: true }
            )
                .populate('client')
                .populate('property')
                .populate('allocatedTo')
                .exec();
        } else {
            updated = await Lead.findByIdAndUpdate(
                leadId,
                { $addToSet: { allocatedTo: assignTo } }, // avoids duplicates
                { new: true }
            )
                .populate('client')
                .populate('property')
                .populate('allocatedTo')
                .exec();
        }

        if (!updated) return next(createError(400, 'Lead not found'));

        res.status(200).json({ result: updated, message: 'Lead assigned successfully', success: true });
    } catch (err) {
        next(createError(500, err.message || err));
    }
};


const fisherYatesShuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

const distributeAndAssign = async (leads, employees, options = {}) => {
    if (!employees || employees.length === 0) return { assignedCount: {}, totalAssigned: 0 };

    const assignedCount = {};
    employees.forEach((id) => { assignedCount[id] = 0; });

    const setAsPrimary = Boolean(options.setAsPrimary);

    const promises = leads.map((lead, idx) => {
        const employee = employees[idx % employees.length];
        assignedCount[employee] = (assignedCount[employee] || 0) + 1;

        if (setAsPrimary) {
            return Lead.findByIdAndUpdate(lead._id, { $set: { allocatedTo: [employee] } }, { new: true })
                .populate('client').populate('property').populate('allocatedTo').exec();
        } else {
            return Lead.findByIdAndUpdate(lead._id, { $addToSet: { allocatedTo: employee } }, { new: true })
                .populate('client').populate('property').populate('allocatedTo').exec();
        }
    });
    const updatedLeads = await Promise.all(promises);
    return { assignedCount, totalAssigned: updatedLeads.filter(Boolean).length, updatedLeads };
};

export const bulkShuffleLeads = async (req, res, next) => {
    try {
        const {
            employees,
            period = 'date',
            startingDate,
            endingDate,
            status,
            setAsPrimary = true,   // always primary
            limit
        } = req.body;

        const filter = { isArchived: { $ne: true } };

        // If multiple statuses passed, use them
        if (status && Array.isArray(status) && status.length > 0) {
            filter.status = { $in: status };
        } else {
            filter.status = { $ne: null };   // ALL leads (no restriction)
        }

        // Date range
        const { startDate, endDate } = getRangeFromPeriod(period, startingDate, endingDate);
        if (startDate) filter.createdAt = { ...(filter.createdAt || {}), $gte: startDate };
        if (endDate) filter.createdAt = { ...(filter.createdAt || {}), $lte: endDate };

        // Fetch leads
        let query = Lead.find(filter);
        if (Number(limit) > 0) query = query.limit(Number(limit));
        let leads = await query.exec();

        // Shuffle leads
        leads = fisherYatesShuffle(leads);

        // Get employees
        let employeeIds = [];
        if (employees === "all") {
            const all = await User.find({ role: "employee" }, { _id: 1 });
            employeeIds = all.map(e => e._id.toString());
        } else {
            employeeIds = employees.map(e => e.toString());
        }

        if (employeeIds.length === 0)
            return next(createError(400, "No employees found"));

        // Cycle assign
        const updated = [];
        for (let i = 0; i < leads.length; i++) {
            const empId = employeeIds[i % employeeIds.length];
            const updatedLead = await Lead.findByIdAndUpdate(
                leads[i]._id,
                { $set: { allocatedTo: [empId] } },
                { new: true }
            );

            updated.push(updatedLead);
        }

        res.status(200).json({
            success: true,
            message: "Shuffled & Reassigned Successfully",
            totalLeads: leads.length,
            employees: employeeIds.length,
        });

    } catch (err) {
        next(createError(500, err.message || err));
    }
};


/**
 * POST /shuffle/filter
 * Use when manager wants to preview which leads will be shuffled (no DB assignment).
 * Body same as bulkShuffleLeads but this endpoint returns shuffled leads only.
 */
export const filterAndShuffleLeads = async (req, res, next) => {
    try {
        const { period = 'date', startingDate, endingDate, status, limit } = req.body;
        const filter = { isArchived: { $ne: true } };

        // FIX: Remove forced 'notInterested'
        if (status && Array.isArray(status) && status.length > 0) {
            filter.status = { $in: status };
        }
        // If no status → allow all non-archived leads

        const { startDate, endDate } = getRangeFromPeriod(period, startingDate, endingDate);
        if (startDate) filter.createdAt = { ...(filter.createdAt || {}), $gte: startDate };
        if (endDate) filter.createdAt = { ...(filter.createdAt || {}), $lte: endDate };

        let query = Lead.find(filter).populate('client').populate('property').populate('allocatedTo');
        if (Number(limit) && Number(limit) > 0) query = query.limit(Number(limit));

        let leads = await query.exec();
        leads = fisherYatesShuffle(leads);

        res.status(200).json({
            result: leads,
            total: leads.length,
            message: 'Filtered leads shuffled (preview)',
            success: true,
        });
    } catch (err) {
        next(createError(500, err.message || err));
    }
};