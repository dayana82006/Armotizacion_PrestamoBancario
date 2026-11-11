import test from "node:test";
import assert from "node:assert/strict";
import { buildAmortizationTable } from "./amortization.js";

test("el tipo Frances usa cuota fija y reduce el saldo cada mes", () => {
  const tabla = buildAmortizationTable("Frances", 10000, 12, 12);

  assert.equal(tabla.length, 12);
  assert.equal(tabla[0].cuotaMensual, "888.49");
  assert.equal(tabla[0].intereses, "100.00");
  assert.equal(tabla[0].amortizacionCapital, "788.49");
  assert.equal(tabla[0].saldoRestante, "9211.51");
  assert.equal(tabla[1].saldoInicial.toFixed(2), "9211.51");
  assert.equal(tabla[11].saldoRestante, "0.00");
  assert.notEqual(tabla[0].amortizacionCapital, "0.00");
});

test("el tipo Americano conserva el capital hasta la ultima cuota", () => {
  const tabla = buildAmortizationTable("Americano", 10000, 12, 12);

  assert.equal(tabla.length, 12);
  assert.equal(tabla[0].saldoInicial, 10000);
  assert.equal(tabla[0].cuotaMensual, "100.00");
  assert.equal(tabla[0].amortizacionCapital, "0.00");
  assert.equal(tabla[0].saldoRestante, "10000.00");
  assert.equal(tabla[1].saldoInicial, 10000);
  assert.equal(tabla[1].amortizacionCapital, "0.00");
  assert.equal(tabla[1].saldoRestante, "10000.00");
  assert.equal(tabla[11].saldoInicial, 10000);
  assert.equal(tabla[11].amortizacionCapital, "10000.00");
  assert.equal(tabla[11].saldoRestante, "0.00");
  assert.equal(tabla[11].cuotaMensual, "100.00");
});
