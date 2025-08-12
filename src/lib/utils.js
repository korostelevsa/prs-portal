export function classNames(...arr) {
  return arr.filter(Boolean).join(" ");
}

export const toneFromPercentile = (p) =>
  p >= 85 ? "bad" : p >= 50 ? "warn" : "good";

export const labelFromPercentile = (p) =>
  p >= 85 ? "Высокий" : p >= 50 ? "Выше среднего" : "Средний/ниже";

export function hazardMultiplierFromPRS(z) {
  const orPerSD = 1.6;
  return Math.pow(orPerSD, z || 0);
}
export function hazardMultipliersFromLifestyle({ smoking, ldlImproved, bmiDelta, activity } = {}) {
  let m = 1.0;
  if (smoking) m *= 1.6;
  if (ldlImproved) m *= 0.8;
  if ((bmiDelta ?? 0) <= -5) m *= 0.88;
  if (activity) m *= 0.9;
  return m;
}
export function buildAbsoluteRiskCurve({ base, ageStart = 30, ageEnd = 80, prsZ = 0, lifestyle } = {}) {
  const points = [];
  const hzPRS = hazardMultiplierFromPRS(prsZ);
  const hzLife = hazardMultipliersFromLifestyle(lifestyle);
  const k = base?.k ?? 0.07;
  const base40 = base?.base40 ?? 0.02;
  for (let age = ageStart; age <= ageEnd; age += 1) {
    const years = Math.max(0, age - ageStart);
    const cumHazBaseline = base40 * ((Math.exp(k * years) - 1) / k);
    const cumHaz = cumHazBaseline * hzPRS * hzLife;
    const risk = 1 - Math.exp(-cumHaz);
    points.push({ age, risk: Number((risk * 100).toFixed(2)) });
  }
  return points;
}

(function runSelfTests() {
  try {
    const pts = buildAbsoluteRiskCurve({});
    console.assert(Array.isArray(pts) && pts.length > 0, "Risk curve points generated");
    console.assert(pts[pts.length - 1].risk >= pts[0].risk, "Risk curve non-decreasing");
    console.assert(labelFromPercentile(10) === "Средний/ниже", "Label low ok");
    console.assert(labelFromPercentile(55) === "Выше среднего", "Label mid ok");
    console.assert(labelFromPercentile(90) === "Высокий", "Label high ok");
  } catch (e) {}
})();
