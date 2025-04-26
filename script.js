const form = document.getElementById('form');
const lista = document.getElementById('lista-transacoes');
const saldoDiv = document.getElementById('saldo');
const grafico = document.getElementById('grafico');

let transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const descricao = document.getElementById('descricao').value;
  const valor = parseFloat(document.getElementById('valor').value);
  const categoria = document.getElementById('categoria').value;
  const tipo = document.getElementById('tipo').value;

  transacoes.push({ descricao, valor, categoria, tipo });
  localStorage.setItem('transacoes', JSON.stringify(transacoes));
  form.reset();
  atualizarTela();
});

function atualizarTela() {
  lista.innerHTML = '';
  let saldo = 0;
  const categorias = {};

  transacoes.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = `${item.descricao} - R$ ${item.valor.toFixed(2)} (${item.categoria})`;
    lista.appendChild(li);

    saldo += item.tipo === 'receita' ? item.valor : -item.valor;
    if (!categorias[item.categoria]) categorias[item.categoria] = 0;
    if (item.tipo === 'despesa') categorias[item.categoria] += item.valor;
  });

  saldoDiv.innerText = `Saldo Atual: R$ ${saldo.toFixed(2)}`;
  saldoDiv.style.color = saldo < 0 ? 'red' : 'green';

  atualizarGrafico(categorias);
}

let chart;
function atualizarGrafico(dados) {
  if (chart) chart.destroy();

  const categorias = Object.keys(dados);
  const valores = Object.values(dados);

  chart = new Chart(grafico, {
    type: 'pie',
    data: {
      labels: categorias,
      datasets: [{
        label: 'Despesas por Categoria',
        data: valores,
        backgroundColor: ['#f44336', '#ff9800', '#4caf50', '#2196f3'],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

atualizarTela();
