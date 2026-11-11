export function calculateFrenchAmortization(monto, interes, plazo) {
  const cuotaMensual = (monto * (interes / 100) / 12) / (1 - Math.pow(1 + interes / 100 / 12, -plazo));
  let saldoRestante = monto;
  const tabla = [];

  for (let i = 1; i <= plazo; i++) {
    const intereses = saldoRestante * interes / 100 / 12;
    const amortizacionCapital = cuotaMensual - intereses;
    saldoRestante -= amortizacionCapital;
    tabla.push({
      numeroCuota: i,
      saldoInicial: saldoRestante + amortizacionCapital,
      cuotaMensual: cuotaMensual.toFixed(2),
      intereses: intereses.toFixed(2),
      amortizacionCapital: amortizacionCapital.toFixed(2),
      saldoRestante: saldoRestante.toFixed(2)
    });
  }

  return tabla;
}

export function calculateAmericanAmortization(monto, interes, plazo) {
  const interesMensual = (monto * interes / 100) / 12;
  const tabla = [];

  for (let i = 1; i <= plazo; i++) {
    const esUltimaCuota = i === plazo;
    tabla.push({
      numeroCuota: i,
      saldoInicial: monto,
      cuotaMensual: interesMensual.toFixed(2),
      intereses: interesMensual.toFixed(2),
      amortizacionCapital: esUltimaCuota ? monto.toFixed(2) : "0.00",
      saldoRestante: esUltimaCuota ? "0.00" : monto.toFixed(2)
    });
  }

  return tabla;
}

export function buildAmortizationTable(tipoAmortizacion, monto, interes, plazo) {
  if (tipoAmortizacion === "Frances") {
    return calculateFrenchAmortization(monto, interes, plazo);
  }
  return calculateAmericanAmortization(monto, interes, plazo);
}
