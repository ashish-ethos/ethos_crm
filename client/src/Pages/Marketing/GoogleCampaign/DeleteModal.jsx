// src/Pages/Admin/GoogleCampaign/DeleteModal.jsx
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

export default function DeleteModal({ open, setOpen, onConfirm }) {
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Delete Campaign</DialogTitle>
      <DialogContent>Are you sure you want to delete this campaign?</DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={() => { onConfirm(); setOpen(false); }} color="error">Delete</Button>
      </DialogActions>
    </Dialog>
  );
}
