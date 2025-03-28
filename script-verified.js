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
    fetch(`data-base.json?v=${new Date().getTime()}`)
        .then(response => response.json())
        .then(data => {
            if (!data.players || !Array.isArray(data.players)) {
                throw new Error("Formato de dados inválido");
            }

			let filteredRows = data.players
				.filter(player => !player.banned) // Filtra apenas os jogadores não banidos
				.map(player => [
					player.name, 
					player.verified ? "✅" : "❌", // Converte true/false para emoji
					player.tag
				]);




            
            // Ordena os jogadores pelo nome corretamente
            filteredRows.sort((a, b) => a[0].localeCompare(b[0])); 

            const headers = ["Nome", "Verificado", "Tag"];
            const table = createTable(headers, filteredRows);

            container.innerHTML = ""; // Remove qualquer conteúdo anterior
            container.appendChild(table); // Adiciona a tabela ao container
        })
        .catch(error => {
            container.textContent = `Erro ao carregar a tabela: ${error.message}`;
        });
});

