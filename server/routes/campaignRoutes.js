import express from "express";
import {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  cloneCampaign,
  stats
} from "../controllers/campaignController.js";

const router = express.Router();

router.get("/stats", stats);
router.post("/", createCampaign);
router.get("/", getCampaigns);
router.post("/:id/clone", cloneCampaign);
router.get("/:id", getCampaignById);
router.put("/:id", updateCampaign);
router.delete("/:id", deleteCampaign);

export default router;
