"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

import { clearAuthCookie, setAuthCookie, signToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getDecimal(formData: FormData, key: string, fallback = 0) {
  const raw = getString(formData, key).replace(",", ".");
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getIntInRange(formData: FormData, key: string, fallback: number, min: number, max: number) {
  const raw = getString(formData, key);
  if (!raw) return fallback;
  const parsed = parseInt(raw, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, parsed));
}

function parseDateInput(value: string) {
  return new Date(`${value}T12:00:00.000Z`);
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function loginAction(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const username = getString(formData, "username");
  const password = getString(formData, "password");

  if (!username || !password) {
    return { error: "Lūdzu ievadiet lietotājvārdu un paroli." };
  }

  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    return { error: "Nepareizs lietotājvārds vai parole." };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) {
    return { error: "Nepareizs lietotājvārds vai parole." };
  }

  const token = await signToken({ userId: user.id, username: user.username });
  await setAuthCookie(token);

  redirect("/");
}

export async function logoutAction() {
  await clearAuthCookie();
  redirect("/login");
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export async function updateSettingsAction(formData: FormData) {
  await prisma.settings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      laborRate: getDecimal(formData, "laborRate", 35),
      employeeHourlyCost: getDecimal(formData, "employeeHourlyCost", 8),
      electricityCost: getDecimal(formData, "electricityCost"),
      rentCost: getDecimal(formData, "rentCost"),
      heatCost: getDecimal(formData, "heatCost"),
      cleaningCost: getDecimal(formData, "cleaningCost"),
      clothingCost: getDecimal(formData, "clothingCost"),
      monthStartDay: getIntInRange(formData, "monthStartDay", 10, 1, 28),
    },
    update: {
      laborRate: getDecimal(formData, "laborRate", 35),
      employeeHourlyCost: getDecimal(formData, "employeeHourlyCost", 8),
      electricityCost: getDecimal(formData, "electricityCost"),
      rentCost: getDecimal(formData, "rentCost"),
      heatCost: getDecimal(formData, "heatCost"),
      cleaningCost: getDecimal(formData, "cleaningCost"),
      clothingCost: getDecimal(formData, "clothingCost"),
      monthStartDay: getIntInRange(formData, "monthStartDay", 10, 1, 28),
    },
  });

  revalidatePath("/settings");
  revalidatePath("/");
  revalidatePath("/workers");
}

// ─── Workers ──────────────────────────────────────────────────────────────────

export async function createWorkerAction(formData: FormData) {
  const name = getString(formData, "name");
  if (!name) throw new Error("Name is required.");

  await prisma.worker.create({
    data: {
      name,
      monthlyRate: getDecimal(formData, "monthlyRate", 8),
    },
  });

  revalidatePath("/workers");
}

export async function updateWorkerAction(formData: FormData) {
  const id = getString(formData, "id");
  const name = getString(formData, "name");
  if (!id || !name) throw new Error("Id and name are required.");

  await prisma.worker.update({
    where: { id },
    data: {
      name,
      monthlyRate: getDecimal(formData, "monthlyRate", 8),
    },
  });

  revalidatePath("/workers");
}

export async function deleteWorkerAction(formData: FormData) {
  const id = getString(formData, "id");
  if (!id) throw new Error("Id is required.");

  await prisma.worker.delete({ where: { id } });

  revalidatePath("/workers");
  revalidatePath("/");
}

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export async function createJobAction(formData: FormData) {
  const date = getString(formData, "date");
  const plateNumber = getString(formData, "plateNumber").toUpperCase();
  const clientName = getString(formData, "clientName");
  const clientPhone = getString(formData, "clientPhone");
  const workerId = getString(formData, "workerId") || null;

  if (!date || !plateNumber) {
    throw new Error("Date and plate number are required.");
  }

  const job = await prisma.job.create({
    data: {
      date: parseDateInput(date),
      plateNumber,
      clientName: clientName || null,
      clientPhone: clientPhone || null,
      workerId,
    },
  });

  revalidatePath("/");
  redirect(`/jobs/${job.id}`);
}

export async function updateJobAction(formData: FormData) {
  const jobId = getString(formData, "jobId");
  const date = getString(formData, "date");
  const plateNumber = getString(formData, "plateNumber").toUpperCase();

  if (!jobId || !date || !plateNumber) {
    throw new Error("Job id, date and plate number are required.");
  }

  await prisma.job.update({
    where: { id: jobId },
    data: {
      date: parseDateInput(date),
      plateNumber,
      clientName: getString(formData, "clientName") || null,
      clientPhone: getString(formData, "clientPhone") || null,
      vehicleNote: getString(formData, "vehicleNote") || null,
      additionalExpenses: getDecimal(formData, "additionalExpenses"),
      notes: getString(formData, "notes") || null,
      workerId: getString(formData, "workerId") || null,
    },
  });

  revalidatePath("/");
  revalidatePath(`/jobs/${jobId}`);
}

export async function updateJobPaymentAction(formData: FormData) {
  const jobId = getString(formData, "jobId");
  const amountPaid = getDecimal(formData, "amountPaid");
  if (!jobId) throw new Error("Job id is required.");

  await prisma.job.update({
    where: { id: jobId },
    data: { amountPaid },
  });

  revalidatePath("/");
  revalidatePath(`/jobs/${jobId}`);
}

export async function deleteJobAction(formData: FormData) {
  const jobId = getString(formData, "jobId");
  if (!jobId) throw new Error("Job id is required.");

  await prisma.job.delete({ where: { id: jobId } });

  revalidatePath("/");
  redirect("/");
}

// ─── Job Items ─────────────────────────────────────────────────────────────────

export async function addJobItemAction(formData: FormData) {
  const jobId = getString(formData, "jobId");
  if (!jobId) throw new Error("Job id is required.");

  const currentOrder = await prisma.jobItem.aggregate({
    where: { jobId },
    _max: { rowOrder: true },
  });

  const item = await prisma.jobItem.create({
    data: {
      jobId,
      rowOrder: (currentOrder._max.rowOrder ?? 0) + 1,
      partName: getString(formData, "partName") || "Jauna pozīcija",
      partCode: getString(formData, "partCode") || null,
      quantity: getDecimal(formData, "quantity", 1),
      partPurchasePrice: getDecimal(formData, "partPurchasePrice"),
      partSalePrice: getDecimal(formData, "partSalePrice"),
      laborHours: getDecimal(formData, "laborHours"),
      laborRate: getDecimal(formData, "laborRate", 35),
      employeeHourlyCost: getDecimal(formData, "employeeHourlyCost", 8),
      notes: getString(formData, "notes") || null,
    },
  });

  revalidatePath("/");
  revalidatePath(`/jobs/${jobId}`);

  return {
    id: item.id,
    jobId: item.jobId,
    rowOrder: item.rowOrder,
    partName: item.partName,
    partCode: item.partCode,
    quantity: item.quantity.toString(),
    partPurchasePrice: item.partPurchasePrice.toString(),
    partSalePrice: item.partSalePrice.toString(),
    laborHours: item.laborHours.toString(),
    laborRate: item.laborRate.toString(),
    employeeHourlyCost: item.employeeHourlyCost.toString(),
    notes: item.notes,
  };
}

export async function updateJobItemAction(formData: FormData) {
  const jobId = getString(formData, "jobId");
  const itemId = getString(formData, "itemId");

  if (!jobId || !itemId) throw new Error("Job id and item id are required.");

  await prisma.jobItem.update({
    where: { id: itemId },
    data: {
      partName: getString(formData, "partName"),
      partCode: getString(formData, "partCode") || null,
      quantity: getDecimal(formData, "quantity", 1),
      partPurchasePrice: getDecimal(formData, "partPurchasePrice"),
      partSalePrice: getDecimal(formData, "partSalePrice"),
      laborHours: getDecimal(formData, "laborHours"),
      laborRate: getDecimal(formData, "laborRate", 35),
      employeeHourlyCost: getDecimal(formData, "employeeHourlyCost", 8),
      notes: getString(formData, "notes") || null,
    },
  });

  revalidatePath("/");
  revalidatePath(`/jobs/${jobId}`);
}

export async function deleteJobItemAction(formData: FormData) {
  const jobId = getString(formData, "jobId");
  const itemId = getString(formData, "itemId");

  if (!jobId || !itemId) throw new Error("Job id and item id are required.");

  await prisma.jobItem.delete({ where: { id: itemId } });

  revalidatePath("/");
  revalidatePath(`/jobs/${jobId}`);
}
