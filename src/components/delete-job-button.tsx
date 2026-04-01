"use client";

import { deleteJobAction } from "@/app/actions";

export function DeleteJobButton({ jobId }: { jobId: string }) {
  async function handleDelete() {
    if (!confirm("Dzēst šo darbu un visas tā pozīcijas?")) return;
    const fd = new FormData();
    fd.append("jobId", jobId);
    await deleteJobAction(fd);
  }

  return (
    <button className="btn btn-ghost" onClick={handleDelete} type="button">
      Dzēst darbu
    </button>
  );
}
