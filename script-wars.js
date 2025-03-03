// Função para criar a tabela
function createTable(headers, rows) {
    const table = document.createElement("table");

    // Adiciona os cabeçalhos
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header; // Define o texto do cabeçalho
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Adiciona as linhas de dados
    const tbody = document.createElement("tbody");
    rows.forEach(rowData => {
        const row = document.createElement("tr");
        rowData.forEach(cellData => {
            const td = document.createElement("td");
            td.textContent = cellData; // Define o texto da célula
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    return table;
}

// Código para carregar o JSON e inserir a tabela.
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById("table-container");
    fetch(`war-data-base.json?v=${new Date().getTime()}`)
        .then(response => response.json())
        .then(data => {
            if (!data.headers || !data.rows) {
                throw new Error("Formato de dados inválido");
            }

            // Ordenar com base na fórmula: PT's + (Guerras * 0.05)
            data.rows.sort((a, b) => {
                let scoreA = (a[2] > 0 && a[3] > 0) ? (a[3] / a[2]) + (a[2] * 0.2) : 0; // Use 0 para jogadores com PTs ou Guerras = 0
                let scoreB = (b[2] > 0 && b[3] > 0) ? (b[3] / b[2]) + (b[2] * 0.2) : 0; // Use 0 para jogadores com PTs ou Guerras = 0
                return scoreB - scoreA;
            });

            // Filtrar os campos específicos (Nome, Número de guerras, PT's)
            let filteredRows = data.rows.map(row => [row[0], row[2], row[3]]); // Seleciona apenas os campos necessários

            const table = createTable(data.headers, filteredRows);
            container.innerHTML = ""; // Remove qualquer conteúdo anterior
            container.appendChild(table); // Adiciona a tabela ao container
        })
        .catch(error => {
            container.textContent = `Erro ao carregar a tabela: ${error.message}`;
        });
});

