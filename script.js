document.addEventListener('DOMContentLoaded', () => {
    // Aqui modificamos a URL para adicionar a query string com timestamp
    fetch(`data-base.json?v=${new Date().getTime()}`) // Adiciona timestamp para evitar cache
        .then(response => response.json())
        .then(data => {
            const players = data.players;

            // Elementos fixos
            const leftContent = document.createElement('div');
            leftContent.id = 'left-content';
            document.getElementById('left-column').appendChild(leftContent);

            const rightContent = document.createElement('div');
            rightContent.id = 'right-content';
            document.getElementById('right-column').appendChild(rightContent);

            // Função para controlar o estado das checkboxes
            const manageCheckboxes = (currentCheckbox) => {
                const checkboxes = [
                    document.getElementById('left-option-1'),
                    document.getElementById('left-option-2'),
                    document.getElementById('left-option-3'),
                ];
                checkboxes.forEach((checkbox) => {
                    if (checkbox !== currentCheckbox) {
                        checkbox.checked = false;
                    }
                });
            };

            // Elementos dinâmicos
            const renderLeftColumn = () => {
                const leftContent = document.getElementById('left-content');
                leftContent.innerHTML = '';

                if (document.getElementById('left-option-3').checked) {
                    // Lista apenas banidos
                    const bannedPlayers = players.filter(player => player.banned);
                    leftContent.innerHTML = bannedPlayers.map(player => `<div>nome: ${player.name} <br/>tag: ${player.tag} <br/> motivo: ${player.banReason} <br/> ------ </div> <br/>`).join('');
                } else if (document.getElementById('left-option-1').checked) {
                    // Lista por doações (excluindo banidos)
                    const sortedPlayers = players
                        .filter(player => !player.banned)
                        .sort((a, b) => b.donations - a.donations);
                    leftContent.innerHTML = sortedPlayers.map(player => `_______<br><div>${player.name}: <strong>${player.donations}</strong></div>`).join('');
                } else if (document.getElementById('left-option-2').checked) {
                    // Lista por tropas pedidas (excluindo banidos)
                    const sortedPlayers = players
                        .filter(player => !player.banned)
                        .sort((a, b) => b.donationsReceived - a.donationsReceived);
                    leftContent.innerHTML = sortedPlayers.map(player => `<div>_______<br>${player.name}: <strong>${player.donationsReceived}</strong></div>`).join('');
                }
            };

            const renderRightColumn = () => {
                const rightContent = document.getElementById('right-content');
                rightContent.innerHTML = '';

                // Lista por troféus (excluindo banidos)
                const sortedPlayers = players
                    .filter(player => !player.banned)
                    .sort((a, b) => b.trophies - a.trophies);
                rightContent.innerHTML = sortedPlayers.map(player => `<div>${player.name}: <strong>${player.trophies}</strong> <br> (troféus)</div>`).join('');
            };

            // Atualiza a coluna esquerda com eventos das checkboxes
            const checkboxes = [
                document.getElementById('left-option-1'),
                document.getElementById('left-option-2'),
                document.getElementById('left-option-3'),
            ];

            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', (event) => {
                    manageCheckboxes(event.target);
                    renderLeftColumn();
                });
            });

            // Renderiza inicialmente
            renderLeftColumn();
            renderRightColumn();
        })
        .catch(error => console.error('Erro ao carregar o JSON:', error));
});

