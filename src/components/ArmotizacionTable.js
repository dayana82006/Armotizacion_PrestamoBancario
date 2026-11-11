import { buildAmortizationTable } from "../js/amortization.js";

class AmortizationTable extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .btn {
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          background-color: #656AA2; /* Azul */
          color: #FFA500; /* Naranja */
          border: none;
          font-weight: bold;
          transition: all 0.3s ease;
        }
      
        .btn:hover {
          background-color: #0056b3; /* Azul más oscuro */
          color: #FFD580; /* Naranja más claro */
        }
        .btn-primary { background-color: #656AA2; color: white; }
        .btn-danger { background-color: #dc3545; color: white; }
        .btn-info { background-color: #17a2b8; color: white; }
        .btn-success { background-color: #28a745; color: white; }
        table { width: 100%; margin-top: 20px; }
        th, td { padding: 8px 12px; text-align: left; }
        th { background-color: #f2f2f2; }
        tr:nth-child(even) { background-color: #f9f9f9; }
      </style>
      <div class="container">
        <h2>Simulación de Amortización</h2>
        <form id="loan-form">
          <div>
            <label for="clienteId">ID del Cliente:</label>
            <input type="text" id="clienteId" required>
          </div>
          <div>
            <label for="monto">Monto del Préstamo ($):</label>
            <input type="number" id="monto" required>
          </div>
          <div>
            <label for="interes">Tasa de Interés Anual (%):</label>
            <input type="number" id="interes" required>
          </div>
          <div>
            <label for="plazo">Plazo (meses):</label>
            <input type="number" id="plazo" required>
          </div>
          <div>
            <label for="tipoAmortizacion">Tipo de Amortización:</label>
            <select id="tipoAmortizacion" required>
              <option value="Frances">Francés</option>
              <option value="Americano">Americano</option>
            </select>
          </div>
          <button type="submit" class="btn">Calcular</button>
        </form>
        <div id="amortization-table-container"></div>
      </div>
    `;

    this.shadowRoot.querySelector("#loan-form").addEventListener("submit", this.handleFormSubmit.bind(this));
  }

  async handleFormSubmit(event) {
    event.preventDefault();

    const clienteId = this.shadowRoot.querySelector("#clienteId").value;
    const monto = parseFloat(this.shadowRoot.querySelector("#monto").value);
    const interes = parseFloat(this.shadowRoot.querySelector("#interes").value);
    const plazo = parseInt(this.shadowRoot.querySelector("#plazo").value);
    const tipoAmortizacion = this.shadowRoot.querySelector("#tipoAmortizacion").value;

    const tablaAmortizacion = buildAmortizationTable(tipoAmortizacion, monto, interes, plazo);

    this.renderAmortizationTable(tablaAmortizacion);
  }

  // Renderizar la tabla de amortización calculada
  renderAmortizationTable(tabla) {
    const container = this.shadowRoot.querySelector("#amortization-table-container");
    container.innerHTML = `
      <h3>Tabla de Amortización</h3>
      <table>
        <thead>
          <tr>
            <th>Cuota</th>
            <th>Saldo Inicial</th>
            <th>Cuota Mensual</th>
            <th>Intereses</th>
            <th>Amortización</th>
            <th>Saldo Restante</th>
          </tr>
        </thead>
        <tbody>
          ${tabla.map(row => `
            <tr>
              <td>${row.numeroCuota}</td>
              <td>$${row.saldoInicial}</td>
              <td>$${row.cuotaMensual}</td>
              <td>$${row.intereses}</td>
              <td>$${row.amortizacionCapital}</td>
              <td>$${row.saldoRestante}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
}

customElements.define('amortization-table', AmortizationTable);
