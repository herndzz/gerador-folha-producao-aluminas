let nomeCount = 0;

// Função para adicionar um novo conjunto de campos de nome e datas
function adicionarNome() {
  nomeCount++;

  const container = document.getElementById("nomes-container");
  const nomeDiv = document.createElement("div");
  nomeDiv.className = "nome-container";
  nomeDiv.id = `nome-container-${nomeCount}`;

  nomeDiv.innerHTML = `
    <div class="nome-input">
      <label for="nome-${nomeCount}">Nome Inserido ${nomeCount}:</label>
      <input type="text" id="nome-${nomeCount}" name="nome-${nomeCount}">
    </div>

    <div class="date-input">
      <label for="data-nascimento-${nomeCount}">Data de Nascimento:</label>
      <input type="date" id="data-nascimento-${nomeCount}" name="data-nascimento-${nomeCount}">
    </div>

    <div class="date-input">
      <label for="data-morte-${nomeCount}">Data de Morte:</label>
      <input type="date" id="data-morte-${nomeCount}" name="data-morte-${nomeCount}">
    </div>

    <button type="button" class="remove-button" onclick="removerNome(${nomeCount})">Remover</button>
  `;

  container.appendChild(nomeDiv);
}

// Função para remover um conjunto de campos
function removerNome(id) {
  const nomeDiv = document.getElementById(`nome-container-${id}`);
  if (nomeDiv) nomeDiv.remove();
}

// Função para gerar o PDF
async function gerarPDF() {
  const { jsPDF } = window.jspdf || window.jspdf.jsPDF;
  const doc = new jsPDF();

  // Adicionar os dados do formulário
  const descricao = document.getElementById("descricao").value || "N/A";
  const observacoes = document.getElementById("observacoes").value || "N/A";
  const nomeCliente = document.getElementById("nomeCliente").value || "N/A";
  const codigoOS = document.getElementById("codigoOS").value || "N/A";
  const celularCliente = document.getElementById("celularCliente").value || "N/A";
  const nomeContato = document.getElementById("nomeContato").value || "N/A";
  const dataPedido = document.getElementById("dataPedido").value || "N/A";
  const previsaoEntrega = document.getElementById("previsaoEntrega").value || "N/A";

  // Configurações do PDF
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(16);
  doc.setTextColor(40);
  doc.text(`Aluminas - Ordem de Produção #${codigoOS}`, 105, 20, { align: "center" });

  // Cabeçalho
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.setFont("Helvetica", "bold");
  doc.setFont("Helvetica", "normal");
  doc.text(`Descrição: ${descricao}`, 10, 40);
  doc.setLineWidth(0.2);
  doc.line(10, 45, 200, 45); // Linha após a descrição

  // Corpo
  const nomesContainer = document.getElementById("nomes-container").children;
  let y = 55; // Posição inicial no PDF

  for (let i = 0; i < nomesContainer.length; i++) {
    const nomeField = nomesContainer[i].querySelector(`[id^="nome-"]`);
    const dataNascimentoField = nomesContainer[i].querySelector(`[id^="data-nascimento-"]`);
    const dataMorteField = nomesContainer[i].querySelector(`[id^="data-morte-"]`);

    // Verifica se os campos existem
    if (nomeField && dataNascimentoField && dataMorteField) {
      const nome = nomeField.value || "N/A";
      const dataNascimento = dataNascimentoField.value || "N/A";
      const dataMorte = dataMorteField.value || "N/A";

      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.setFont("Helvetica", "bold");
      doc.text(`Nome: ${nome}`, 10, y);
      doc.setFont("Helvetica", "normal");
      doc.text(`Data de Nascimento: ${dataNascimento}`, 10, y + 10);
      doc.text(`Data de Morte: ${dataMorte}`, 10, y + 20);
      y += 30; // Incrementa a posição y para o próximo conjunto de dados

      // Adicionar uma linha de separação entre os conjuntos de dados
      doc.setLineWidth(0.2);
      doc.line(10, y - 5, 200, y - 5);
    }
  }

  // Observações
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Observações: ${observacoes}`, 10, y + 10);

  // Rodapé
  y += 20;
  doc.setFont("Helvetica", "bold");
  doc.text("Informações do Cliente", 10, y);
  doc.setFont("Helvetica", "normal");
  doc.text(`Nome do Cliente: ${nomeCliente}`, 10, y + 10);
  doc.text(`Código OS: ${codigoOS}`, 10, y + 20);
  doc.text(`Celular: ${celularCliente}`, 10, y + 30);
  doc.text(`Nome Contato: ${nomeContato}`, 10, y + 40);
  doc.setLineWidth(0.2);
  doc.line(10, y + 45, 200, y + 45); // Linha após o contato
  doc.text(`Data Pedido: ${dataPedido}`, 10, y + 50);
  doc.text(`Previsão de Entrega: ${previsaoEntrega}`, 10, y + 60);

  // Obter a data e hora atual
  const now = new Date();
  const formattedDate = now.toLocaleDateString('pt-BR');
  const formattedTime = now.toLocaleTimeString('pt-BR').replace(/:/g, '-');

  // Salvar o PDF com a data e hora atual no nome do arquivo
  doc.save(`ordem_producao_${formattedDate}_${formattedTime}.pdf`);
}
