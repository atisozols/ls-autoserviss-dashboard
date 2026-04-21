type NumericLike = number | string | { toString(): string } | null | undefined;

export type ItemLike = {
  quantity: NumericLike;
  partPurchasePrice: NumericLike;
  partSalePrice: NumericLike;
  laborHours: NumericLike;
  laborRate: NumericLike;
  employeeHourlyCost: NumericLike;
};

export type JobLike<TItem extends ItemLike> = {
  additionalExpenses: NumericLike;
  items: TItem[];
};

const currencyFormatter = new Intl.NumberFormat("lv-LV", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("lv-LV", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

function toNumber(value: NumericLike) {
  return Number(value ?? 0);
}

function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function formatCurrency(value: NumericLike) {
  return currencyFormatter.format(toNumber(value));
}

export function formatDate(value: Date) {
  return dateFormatter.format(value);
}

export function toInputDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

/**
 * Returns the current accounting month key as "YYYY-MM".
 * Accounting month YYYY-MM starts on YYYY-MM-{startDay} and ends on
 * (YYYY-MM+1)-{startDay-1} inclusive. If today's day < startDay, the
 * current accounting month is the previous calendar month.
 */
export function getCurrentMonthStr(startDay = 1): string {
  const now = new Date();
  let year = now.getFullYear();
  let mon = now.getMonth(); // 0-indexed
  if (now.getDate() < startDay) {
    mon -= 1;
    if (mon < 0) {
      mon = 11;
      year -= 1;
    }
  }
  return `${year}-${String(mon + 1).padStart(2, "0")}`;
}

/**
 * Returns the UTC start (inclusive) and end (exclusive) of the accounting month.
 * Month key "YYYY-MM" with startDay=10 → window [YYYY-MM-10, (YYYY-MM+1)-10).
 */
export function getMonthBounds(monthKey: string, startDay = 1): { startDate: Date; endDate: Date } {
  const [y, m] = monthKey.split("-").map(Number);
  const startDate = new Date(Date.UTC(y, m - 1, startDay));
  const endDate = new Date(Date.UTC(y, m, startDay));
  return { startDate, endDate };
}

/** Given a date, returns the accounting month key "YYYY-MM" it belongs to. */
export function getAccountingMonthKey(date: Date, startDay = 1): string {
  let year = date.getUTCFullYear();
  let mon = date.getUTCMonth();
  if (date.getUTCDate() < startDay) {
    mon -= 1;
    if (mon < 0) {
      mon = 11;
      year -= 1;
    }
  }
  return `${year}-${String(mon + 1).padStart(2, "0")}`;
}

/** Returns the Monday of the current week as "YYYY-MM-DD" */
export function getCurrentWeekStart(): string {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon, ...
  const daysBack = day === 0 ? 6 : day - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - daysBack);
  return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, "0")}-${String(monday.getDate()).padStart(2, "0")}`;
}

/** Count Mon–Fri days in a given calendar month (year=full year, month=0-indexed) */
export function getBusinessDaysInMonth(year: number, month: number): number {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let count = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const dow = new Date(year, month, d).getDay();
    if (dow !== 0 && dow !== 6) count++;
  }
  return count;
}

/** Count Mon–Fri days inside the accounting-month window for the given key. */
export function getBusinessDaysInAccountingMonth(monthKey: string, startDay = 1): number {
  const { startDate, endDate } = getMonthBounds(monthKey, startDay);
  let count = 0;
  const d = new Date(startDate);
  while (d < endDate) {
    const dow = d.getUTCDay();
    if (dow !== 0 && dow !== 6) count++;
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return count;
}

/**
 * Calculate effective fixed costs for a period, counting only business days up to today.
 * For past periods all days are counted. For current/future periods only elapsed days count.
 *
 * Daily rate is computed per accounting month: `totalMonthlyFixed / businessDaysInAccountingMonth`.
 * This way the month-start-day setting is honoured — a period that straddles two accounting
 * months uses the correct divisor for each day.
 *
 * @param totalMonthlyFixed  Monthly fixed cost (same every month from settings)
 * @param startDate          Period start (UTC, inclusive)
 * @param endDate            Period end (UTC, exclusive)
 * @param todayUTC           Today at UTC midnight
 * @param monthStartDay      Day of month the accounting period starts on (1-28)
 */
export function calculatePeriodFixedCosts(
  totalMonthlyFixed: number,
  startDate: Date,
  endDate: Date,
  todayUTC: Date,
  monthStartDay = 1,
): { effectiveCost: number; businessDaysElapsed: number; totalBusinessDays: number } {
  if (totalMonthlyFixed <= 0) {
    return { effectiveCost: 0, businessDaysElapsed: 0, totalBusinessDays: 0 };
  }

  let effectiveCost = 0;
  let businessDaysElapsed = 0;
  let totalBusinessDays = 0;

  const bDaysCache = new Map<string, number>();
  const d = new Date(startDate);
  while (d < endDate) {
    const dow = d.getUTCDay();
    if (dow !== 0 && dow !== 6) {
      totalBusinessDays++;
      if (d <= todayUTC) {
        const key = getAccountingMonthKey(d, monthStartDay);
        let bDays = bDaysCache.get(key);
        if (bDays === undefined) {
          bDays = getBusinessDaysInAccountingMonth(key, monthStartDay);
          bDaysCache.set(key, bDays);
        }
        if (bDays > 0) {
          effectiveCost += totalMonthlyFixed / bDays;
          businessDaysElapsed++;
        }
      }
    }
    d.setUTCDate(d.getUTCDate() + 1);
  }

  return {
    effectiveCost: Math.round(effectiveCost * 100) / 100,
    businessDaysElapsed,
    totalBusinessDays,
  };
}

export function calculateJobItem<TItem extends ItemLike>(item: TItem) {
  const quantity = toNumber(item.quantity);
  const partPurchasePrice = toNumber(item.partPurchasePrice);
  const partSalePrice = toNumber(item.partSalePrice);
  const laborHours = toNumber(item.laborHours);
  const laborRate = toNumber(item.laborRate);
  const employeeHourlyCost = toNumber(item.employeeHourlyCost);

  const partPurchaseTotal = roundCurrency(quantity * partPurchasePrice);
  const partSaleTotal = roundCurrency(quantity * partSalePrice);
  const laborRevenue = roundCurrency(laborHours * laborRate);
  const employeeCost = roundCurrency(laborHours * employeeHourlyCost);
  const lineRevenue = roundCurrency(partSaleTotal + laborRevenue);
  const lineCost = roundCurrency(partPurchaseTotal + employeeCost);
  const lineProfit = roundCurrency(lineRevenue - lineCost);

  return {
    ...item,
    quantity,
    partPurchasePrice,
    partSalePrice,
    laborHours,
    laborRate,
    employeeHourlyCost,
    partPurchaseTotal,
    partSaleTotal,
    laborRevenue,
    employeeCost,
    lineRevenue,
    lineCost,
    lineProfit,
  };
}

export function calculateJobTotals<TItem extends ItemLike>(job: JobLike<TItem>) {
  const items = job.items.map((item) => calculateJobItem(item));
  const additionalExpenses = roundCurrency(toNumber(job.additionalExpenses));

  const totalRevenue = roundCurrency(
    items.reduce((sum, item) => sum + item.lineRevenue, 0),
  );
  const itemsCost = roundCurrency(items.reduce((sum, item) => sum + item.lineCost, 0));
  const totalCost = roundCurrency(itemsCost + additionalExpenses);
  const profit = roundCurrency(totalRevenue - totalCost);

  return {
    items,
    additionalExpenses,
    totalRevenue,
    totalCost,
    profit,
    positionCount: items.length,
  };
}
