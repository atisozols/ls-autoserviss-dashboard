import { updateSettingsAction } from "@/app/actions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const defaultSettings = {
  laborRate: 35,
  employeeHourlyCost: 8,
  electricityCost: 0,
  rentCost: 0,
  heatCost: 0,
  cleaningCost: 0,
  clothingCost: 0,
};

export default async function SettingsPage() {
  const settings = await prisma.settings.findUnique({ where: { id: 1 } });
  const s = settings ?? defaultSettings;

  const totalFixedMonthly =
    Number(s.electricityCost) +
    Number(s.rentCost) +
    Number(s.heatCost) +
    Number(s.cleaningCost) +
    Number(s.clothingCost);

  return (
    <div className="shell">
      <div className="page-header">
        <h1>Iestatījumi</h1>
        <p className="hero-text">
          Noklusējuma likmes un fiksētās mēneša izmaksas
        </p>
      </div>

      <form action={updateSettingsAction}>
        <div className="settings-grid">
          <section className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Fiksētie ienākumi</p>
                <h2>Darba likme</h2>
              </div>
            </div>
            <p className="settings-hint">
              Stundas likme, ko par darbu maksā klients
            </p>
            <div className="field-grid">
              <label className="field">
                <span>Darba likme (EUR/h)</span>
                <input
                  defaultValue={Number(s.laborRate)}
                  min="0"
                  name="laborRate"
                  required
                  step="1"
                  type="number"
                />
              </label>
              <input
                name="employeeHourlyCost"
                type="hidden"
                value={Number(s.employeeHourlyCost)}
              />
            </div>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Fiksētās izmaksas</p>
                <h2>Mēneša izmaksas</h2>
              </div>
              <span className="pill">
                Kopā: {totalFixedMonthly.toFixed(2)} €/mēn
              </span>
            </div>
            <p className="settings-hint">
              Aptuvenie mēneša fiksētie izdevumi informācijai un pārskatam.
            </p>
            <div className="field-grid">
              <label className="field">
                <span>Elektroenerģija (EUR/mēn)</span>
                <input
                  defaultValue={Number(s.electricityCost)}
                  min="0"
                  name="electricityCost"
                  step="0.01"
                  type="number"
                />
              </label>
              <label className="field">
                <span>Īre (EUR/mēn)</span>
                <input
                  defaultValue={Number(s.rentCost)}
                  min="0"
                  name="rentCost"
                  step="0.01"
                  type="number"
                />
              </label>
              <label className="field">
                <span>Siltums (EUR/mēn)</span>
                <input
                  defaultValue={Number(s.heatCost)}
                  min="0"
                  name="heatCost"
                  step="0.01"
                  type="number"
                />
              </label>
              <label className="field">
                <span>Uzkopšana (EUR/mēn)</span>
                <input
                  defaultValue={Number(s.cleaningCost)}
                  min="0"
                  name="cleaningCost"
                  step="0.01"
                  type="number"
                />
              </label>
              <label className="field">
                <span>Apģērbs (EUR/mēn)</span>
                <input
                  defaultValue={Number(s.clothingCost)}
                  min="0"
                  name="clothingCost"
                  step="0.01"
                  type="number"
                />
              </label>
            </div>
          </section>
        </div>

        <div className="form-submit-row">
          <button className="btn btn-primary" type="submit">
            Saglabāt iestatījumus
          </button>
        </div>
      </form>
    </div>
  );
}
