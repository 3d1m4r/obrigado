// Dados das receitas
const recipes = [
    {
        id: "chantininho",
        name: "Chantininho",
        icon: "🧁",
        description: "Receitas exclusivas para festas",
        potential: "R$ 300-600/dia",
        difficulty: "Fácil",
        difficultyClass: "difficulty-easy",
        filename: "chantininho.pdf"
    },
    {
        id: "macarrons",
        name: "Macarrons",
        icon: "🌈",
        description: "Segredo dos macarrons franceses",
        potential: "R$ 400-800/dia",
        difficulty: "Intermediário",
        difficultyClass: "difficulty-intermediate",
        filename: "macarrons.pdf"
    },
    {
        id: "bem-casado",
        name: "Bem Casado",
        icon: "💍",
        description: "Fature alto em casamentos",
        potential: "R$ 500-1000/evento",
        difficulty: "Fácil",
        difficultyClass: "difficulty-easy",
        filename: "bem-casado.pdf"
    },
    {
        id: "pudim",
        name: "Pudim",
        icon: "🍮",
        description: "Variações que conquistam",
        potential: "R$ 200-400/dia",
        difficulty: "Muito Fácil",
        difficultyClass: "difficulty-very-easy",
        filename: "pudim.pdf"
    },
    {
        id: "donuts",
        name: "Donuts",
        icon: "🍩",
        description: "Donuts artesanais",
        potential: "R$ 350-700/dia",
        difficulty: "Fácil",
        difficultyClass: "difficulty-easy",
        filename: "donuts.pdf"
    },
    {
        id: "cupcake",
        name: "Cupcake",
        icon: "🧁",
        description: "Cupcakes gourmet profissionais",
        potential: "R$ 250-500/dia",
        difficulty: "Fácil",
        difficultyClass: "difficulty-easy",
        filename: "cupcake.pdf"
    },
    {
        id: "panetone-chocotone",
        name: "Panetone & Chocotone",
        icon: "🎄",
        description: "Doces natalinos lucrativos",
        potential: "R$ 800-2000/mês",
        difficulty: "Intermediário",
        difficultyClass: "difficulty-intermediate",
        filename: "panetone-chocotone.pdf"
    },
    {
        id: "bolos-caseiros",
        name: "Bolos Caseiros",
        icon: "🎂",
        description: "Bolos irresistíveis",
        potential: "R$ 400-800/dia",
        difficulty: "Fácil",
        difficultyClass: "difficulty-easy",
        filename: "bolos-caseiros.pdf"
    },
    {
        id: "brigadeiro-gourmet",
        name: "Brigadeiro Gourmet",
        icon: "🍫",
        description: "Brigadeiros sofisticados",
        potential: "R$ 300-900/dia",
        difficulty: "Muito Fácil",
        difficultyClass: "difficulty-very-easy",
        filename: "brigadeiro-gourmet.pdf"
    },
    {
        id: "pipoca-gourmet",
        name: "Pipoca Gourmet",
        icon: "🍿",
        description: "Margem de lucro até 400%",
        potential: "R$ 200-600/dia",
        difficulty: "Muito Fácil",
        difficultyClass: "difficulty-very-easy",
        filename: "pipoca-gourmet.pdf"
    }
];

// Estado dos downloads
let downloadingIds = new Set();

// Função para mostrar toast
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${isError ? 'error' : ''} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Função para fazer download
async function downloadRecipe(recipe) {
    // Adiciona à lista de downloads em andamento
    downloadingIds.add(recipe.id);
    updateCardState(recipe.id, true);
    
    try {
        // Busca o arquivo PDF
        const response = await fetch(`pdfs/${recipe.filename}`);
        
        if (!response.ok) {
            throw new Error('Arquivo não encontrado');
        }
        
        // Converte para blob
        const blob = await response.blob();
        
        // Cria URL temporária
        const url = window.URL.createObjectURL(blob);
        
        // Cria link temporário para download
        const link = document.createElement('a');
        link.href = url;
        link.download = recipe.filename;
        link.style.display = 'none';
        
        // Adiciona ao DOM, clica e remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Libera a URL
        window.URL.revokeObjectURL(url);
        
        // Mostra sucesso
        showToast(`📥 Download de ${recipe.name} iniciado!`);
        
    } catch (error) {
        console.error('Erro no download:', error);
        showToast('❌ Erro no download. Tente novamente.', true);
    } finally {
        // Remove da lista e atualiza visual após 2 segundos
        setTimeout(() => {
            downloadingIds.delete(recipe.id);
            updateCardState(recipe.id, false);
        }, 2000);
    }
}

// Função para atualizar estado visual do card
function updateCardState(recipeId, isDownloading) {
    const card = document.querySelector(`[data-recipe-id="${recipeId}"]`);
    const button = card.querySelector('.download-btn');
    
    if (isDownloading) {
        card.classList.add('downloading');
        button.disabled = true;
        button.innerHTML = '⏳ Baixando...';
    } else {
        card.classList.remove('downloading');
        button.disabled = false;
        button.innerHTML = '📥 Baixar Apostila';
    }
}

// Função para criar card de receita
function createRecipeCard(recipe) {
    return `
        <div class="recipe-card" data-recipe-id="${recipe.id}">
            <div class="recipe-header">
                <div class="recipe-icon">${recipe.icon}</div>
                <div class="recipe-info">
                    <h3>${recipe.name}</h3>
                    <p class="recipe-description">${recipe.description}</p>
                </div>
            </div>
            
            <div class="recipe-details">
                <div class="recipe-potential">${recipe.potential}</div>
                <div class="difficulty-badge ${recipe.difficultyClass}">
                    ${recipe.difficulty}
                </div>
            </div>
            
            <button class="download-btn" onclick="downloadRecipe(${JSON.stringify(recipe)})">
                📥 Baixar Apostila
            </button>
        </div>
    `;
}

// Função para renderizar todas as receitas
function renderRecipes() {
    const grid = document.getElementById('recipeGrid');
    grid.innerHTML = recipes.map(recipe => createRecipeCard(recipe)).join('');
}

// Inicializa a página quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    renderRecipes();
});

// Adiciona animação suave ao scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Expõe função globalmente para uso nos botões
window.downloadRecipe = downloadRecipe;