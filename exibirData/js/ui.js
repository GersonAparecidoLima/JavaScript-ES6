import api from "./api.js"

const ui = {

  async preencherFormulario(pensamentoId) {
    const pensamento = await api.buscarPensamentoPorId(pensamentoId)
    document.getElementById("pensamento-id").value = pensamento.id
    document.getElementById("pensamento-conteudo").value = pensamento.conteudo
    document.getElementById("pensamento-autoria").value = pensamento.autoria
    //toUTCString(): converte a data em uma string no formato UTC, 
    // que é fácil de ler e entender;

    //toISOString(): retorna a data no formato ISO 8601, que é uma representação 
    //padrão e amplamente utilizada para troca de dados.
    //split("T")[0] e uma quebra e pegando o primeiro elemento
    document.getElementById("pensamento-data").value = pensamento.data.
      toISOString().split("T")[0]
    document.getElementById("form-container").scrollIntoView()
  },

  //scrollIntoView() este metodo faz que quando voce clicar no icone a pagina 
  //seja direcionado para o lacal da tela

  limparFormulario() {
    document.getElementById("pensamento-form").reset()
  },

  async renderizarPensamentos(pensamentosFiltrados = null) {
    const listaPensamentos = document.getElementById("lista-pensamentos")
    const mensagemVazia = document.getElementById("mensagem-vazia")
    listaPensamentos.innerHTML = ""

    try {
      let pensamentosParaRenderizar

      if (pensamentosFiltrados) {
        pensamentosParaRenderizar = pensamentosFiltrados
      } else {
        pensamentosParaRenderizar = await api.buscarPensamentos()
      }

      if (pensamentosParaRenderizar.length === 0) {
        mensagemVazia.style.display = "block"
      } else {
        mensagemVazia.style.display = "none"
        pensamentosParaRenderizar.forEach(ui.adicionarPensamentoNaLista)
      }
    }
    catch {
      alert('Erro ao renderizar pensamentos')
    }
  },

  adicionarPensamentoNaLista(pensamento) {
    const listaPensamentos = document.getElementById("lista-pensamentos")
    const li = document.createElement("li")
    li.setAttribute("data-id", pensamento.id)
    li.classList.add("li-pensamento")

    const iconeAspas = document.createElement("img")
    iconeAspas.src = "assets/imagens/aspas-azuis.png"
    iconeAspas.alt = "Aspas azuis"
    iconeAspas.classList.add("icone-aspas")

    const pensamentoConteudo = document.createElement("div")
    pensamentoConteudo.textContent = pensamento.conteudo
    pensamentoConteudo.classList.add("pensamento-conteudo")

    const pensamentoAutoria = document.createElement("div")
    pensamentoAutoria.textContent = pensamento.autoria
    pensamentoAutoria.classList.add("pensamento-autoria")

    const pensamentoData = document.createElement("div")

    //pensamento.data.toLocaleDateString('pt-BR', options)
    //a opçao options
    /*
     weekday: 'long', vai passar o dia da semana por extenso
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC' para não ter problema com o fuso horario
    */
    var options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    }

    //pensamento.data.toLocaleDateString('pt-BR', options)
    //Formatando a data

    const dataFormatada = pensamento.data.toLocaleDateString('pt-BR', options)
    pensamentoData.textContent = dataFormatada
    pensamentoData.classList.add("pensamento-data")

    const botaoEditar = document.createElement("button")
    botaoEditar.classList.add("botao-editar")
    botaoEditar.onclick = () => ui.preencherFormulario(pensamento.id)

    const iconeEditar = document.createElement("img")
    iconeEditar.src = "assets/imagens/icone-editar.png"
    iconeEditar.alt = "Editar"
    botaoEditar.appendChild(iconeEditar)

    const botaoExcluir = document.createElement("button")
    botaoExcluir.classList.add("botao-excluir")
    botaoExcluir.onclick = async () => {
      try {
        await api.excluirPensamento(pensamento.id)
        ui.renderizarPensamentos()
      } catch (error) {
        alert("Erro ao excluir pensamento")
      }
    }

    const iconeExcluir = document.createElement("img")
    iconeExcluir.src = "assets/imagens/icone-excluir.png"
    iconeExcluir.alt = "Excluir"
    botaoExcluir.appendChild(iconeExcluir)

    const botaoFavorito = document.createElement("button")
    botaoFavorito.classList.add("botao-favorito")
    botaoFavorito.onclick = async () => {
      try {
        await api.atualizarFavorito(pensamento.id, !pensamento.favorito)
        ui.renderizarPensamentos()
      } catch (error) {
        alert("Erro ao atualizar pensamento")
      }
    }

    const iconeFavorito = document.createElement("img")
    iconeFavorito.src = pensamento.favorito ?
      "assets/imagens/icone-favorito.png" :
      "assets/imagens/icone-favorito_outline.png"
    iconeFavorito.alt = "Ícone de favorito"
    botaoFavorito.appendChild(iconeFavorito)

    const icones = document.createElement("div")
    icones.classList.add("icones")
    icones.appendChild(botaoFavorito)
    icones.appendChild(botaoEditar)
    icones.appendChild(botaoExcluir)

    li.appendChild(iconeAspas)
    li.appendChild(pensamentoConteudo)
    li.appendChild(pensamentoAutoria)
    li.appendChild(pensamentoData)
    li.appendChild(icones)
    listaPensamentos.appendChild(li)
  }
}

export default ui