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
import {
  verifyEmployee,
  verifyManager,
  verifySuperAdmin,
  verifyToken,
} from "../middleware/auth.js";
import Lead from "../models//lead.js";
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


// GET
router.get("/get/single/:leadId", getLead);
router.get("/get/phone/:phone", getLeadByPhone);
router.get("/get/employee", verifyToken, verifyEmployee, getEmployeeLeads);
router.get("/get/all", verifyToken, verifyManager, getLeads);
router.get("/get/all", verifyToken, getLeads);
router.get("/get/stats", verifyToken, verifyEmployee, getLeadsStat);
router.get("/search", verifyToken, searchLead);
router.get("/filter", verifyToken, filterLead);

// GET ALL LEADS
router.get("/get/all", verifyToken, verifyManager, getLeads);
router.get("/get/shuffle", verifyToken, verifyManager, getShuffleLeads);
router.post("/shuffle/assign/:leadId", verifyToken, verifyManager, assignShuffledLead);
router.post("/shuffle/bulk", verifyToken, verifyManager, bulkShuffleLeads);
router.post("/shuffle/filter", verifyToken, verifyManager, filterAndShuffleLeads);


router.post('/shuffle/bulk', verifyManager, bulkShuffleLeads );
router.post('/shuffle/filter', verifyManager, filterAndShuffleLeads);



// POST
router.post("/create", verifyToken, createLead);

// PUT
router.put("/archive", verifyToken, verifyEmployee, archiveLead);
router.put('/archive/:leadId', verifyToken, verifyEmployee, archiveLead);
router.put("/update/:leadId", verifyToken, verifyEmployee, updateLead);
router.put("/update/shift/:leadId", verifyToken, verifyEmployee, shiftLead);
router.put("/update/share/:leadId", verifyToken, verifyEmployee, shareLead);

// DELETE
router.delete(
  "/delete/:leadId",
  verifyToken,
  verifySuperAdmin,
  verifyManager,
  deleteLead
);
router.delete("/delete-whole-collection", deleteWholeCollection);

export default router;
