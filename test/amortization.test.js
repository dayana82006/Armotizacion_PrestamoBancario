import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";

const registry = {};
const context = {
  HTMLElement: class {
    attachShadow() {
      return {};
    }
  },
  customElements: {
    define(name, ctor) {
      registry[name] = ctor;
    },
  },
  console,
};
vm.createContext(context);
vm.runInContext(
  fs.readFileSync(new URL("../src/components/ArmotizacionTable.js", import.meta.url), "utf8"),
  context
);

function createTable() {
  return new registry["amortization-table"]();
}

function submit(table, tipo) {
  let html = "";
  table.shadowRoot = {
    querySelector(selector) {
      const values = {
        "#clienteId": "1",
        "#monto": "10000",
        "#interes": "12",
        "#plazo": "12",
        "#tipoAmortizacion": tipo,
      };
      if (selector === "#amortization-table-container") {
        return {
          set innerHTML(value) {
            html = value;
          },
        };
      }
      return { value: values[selector] };
    },
  };
  table.handleFormSubmit({ preventDefault() {} });
  return html;
}

test("el sistema americano conserva el capital hasta la última cuota", () => {
  const table = createTable();
  const rows = table.calculateAmericanAmortization(10000, 12, 12);

  assert.equal(rows.length, 12);
  assert.equal(rows[0].intereses, "100.00");
  assert.equal(rows[0].amortizacionCapital, "0.00");
  assert.equal(rows[0].cuotaMensual, "100.00");
  assert.equal(rows[0].saldoRestante, "10000.00");
  assert.equal(rows[1].saldoInicial, "10000.00");
  assert.equal(rows[1].saldoRestante, "10000.00");
  assert.equal(rows[1].amortizacionCapital, "0.00");
  assert.equal(rows[11].intereses, "100.00");
  assert.equal(rows[11].amortizacionCapital, "10000.00");
  assert.equal(rows[11].cuotaMensual, "10100.00");
  assert.equal(rows[11].saldoRestante, "0.00");
});

test("el sistema francés amortiza capital en cada cuota", () => {
  const table = createTable();
  const rows = table.calculateFrenchAmortization(10000, 12, 12);

  assert.equal(rows[0].cuotaMensual, "888.49");
  assert.equal(rows[0].intereses, "100.00");
  assert.equal(rows[0].amortizacionCapital, "788.49");
  assert.equal(rows[11].saldoRestante, "0.00");

  const principal = rows.reduce((sum, row) => sum + Number(row.amortizacionCapital), 0);
  assert.ok(Math.abs(principal - 10000) < 0.05, `capital amortizado ${principal}`);
});

test("la opción Frances del formulario usa el cálculo francés", () => {
  const table = createTable();
  const html = submit(table, "Frances");

  assert.match(html, /888\.49/);
  assert.doesNotMatch(html, /10100\.00/);
});

test("la opción Francés también usa el cálculo francés", () => {
  const table = createTable();
  const html = submit(table, "Francés");

  assert.match(html, /888\.49/);
});

test("la opción Americano muestra el pago final de capital", () => {
  const table = createTable();
  const html = submit(table, "Americano");

  assert.match(html, /10100\.00/);
  assert.match(html, /10000\.00/);
  assert.doesNotMatch(html, /888\.49/);
});
