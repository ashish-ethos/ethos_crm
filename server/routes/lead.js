import express from "express";
import {
  createLead,
  getLeadByPhone,
  getLead,
  getEmployeeLeads,
  getLeadsStat,
  getLeads,
  filterLead,
  updateLead,
  shiftLead,
  shareLead,
  archiveLead,
  deleteLead,
  deleteWholeCollection,
  searchLead,
  getShuffleLeads,
  assignShuffledLead,
  bulkShuffleLeads,
  filterAndShuffleLeads,
} from "../controllers/lead.js";
import { defaultRateLimiter, managerRateLimiter } from "../utils/rateLimit.js";
import {
  verifyEmployee,
  verifyManager,
  verifySuperAdmin,
  verifyToken,
} from "../middleware/auth.js";
import Lead from "../models/lead.js";
import { createError } from "../utils/error.js";

const router = express.Router();

const verifyIsAllocatedTo = async (req, res, next) => {
  try {
    const { leadId } = req.params;
    const lead = await Lead.findById(leadId);

    if (!lead) return next(createError(400, "Lead not exist"));

    const isManager = ["manager", "super_admin"].includes(req.user.role);
    const isAllocated = lead.allocatedTo.toString().includes(req.user._id);

    if (isAllocated || isManager) next();
    else next(createError(401, "This lead is not allocated to you."));
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Apply default rate limiter for most routes (only for POST, PUT, DELETE, etc.)
router.use(defaultRateLimiter);

// GET Routes
router.get("/get/single/:leadId", getLead);
router.get("/get/phone/:phone", getLeadByPhone);
router.get("/get/employee", verifyToken, verifyEmployee, getEmployeeLeads);

// Apply role-based rate limiter to sensitive routes
router.get("/get/all", verifyToken, (req, res, next) => {
  if (req.user.role === "manager" || req.user.role === "super_admin") {
    return managerRateLimiter(req, res, next);
  }
  return defaultRateLimiter(req, res, next);
}, getLeads);


router.get("/get/stats", verifyToken, verifyEmployee, getLeadsStat);
router.get("/search", verifyToken, searchLead);
router.get("/filter", verifyToken, filterLead);
router.get("/get/shuffle", verifyToken, verifyManager, getShuffleLeads);

// POST Routes
router.post("/create", verifyToken, defaultRateLimiter, createLead);
router.post("/shuffle/assign/:leadId", verifyToken, verifyManager, assignShuffledLead);
router.post("/shuffle/bulk", verifyToken, verifyManager, bulkShuffleLeads);
router.post("/shuffle/filter", verifyToken, verifyManager, filterAndShuffleLeads);

// PUT Routes
router.put("/archive", verifyToken, verifyEmployee, archiveLead);
router.put("/archive/:leadId", verifyToken, verifyEmployee, archiveLead);
router.put("/update/:leadId", verifyToken, verifyEmployee, updateLead);
router.put("/update/shift/:leadId", verifyToken, verifyEmployee, shiftLead);
router.put("/update/share/:leadId", verifyToken, verifyEmployee, shareLead);

// DELETE Routes
router.delete("/delete/:leadId", verifyToken, verifySuperAdmin, verifyManager, deleteLead);
router.delete("/delete-whole-collection", deleteWholeCollection);

export default router;
