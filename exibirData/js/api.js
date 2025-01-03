const URL_BASE = "http://localhost:3000"

const converterStringParaData = (dataString) => {
  //Desitruturacao 
  const [ano, mes, dia] = dataString.split("-")
  return new Date(Date.UTC(ano, mes - 1, dia))
}

//por que utiliza mes - 1, por que o javascript trata o mês de 0 até 11 sendo assim devemos
//subtrair -1

const api = {
  async buscarPensamentos() {
    try {
      const response = await axios.get(`${URL_BASE}/pensamentos`)
      const pensamentos = await response.data
      // o map retorna um array tranformado
      return pensamentos.map(pensamento => {
        return {
          ...pensamento,
          data: new Date(pensamento.data)
        }
      })
    }
    catch {
      alert('Erro ao buscar pensamentos')
      throw error
    }
  },

  async salvarPensamento(pensamento) {
    try {
      const data = converterStringParaData(pensamento.data)
      // oque se entende com os três pontinho ...
      //significa enviar todas as propriedades do pensamento
      //mas a data convertida
      //chamado de operado de espelhamento os (...)
      const response = await axios.post(`${URL_BASE}/pensamentos`, {
        ...pensamento,
        data: data.toISOString()
      })
      return await response.data
    }
    catch {
      alert('Erro ao salvar pensamento')
      throw error
    }
  },

  async buscarPensamentoPorId(id) {
    try {
      const response = await axios.get(`${URL_BASE}/pensamentos/${id}`)
      const pensamento = await response.data

      return {
        ...pensamento,
        data: new Date(pensamento.data)
      }
    }
    catch {
      alert('Erro ao buscar pensamento')
      throw error
    }
  },

  async editarPensamento(pensamento) {
    try {
      const response = await axios.put(`${URL_BASE}/pensamentos/${pensamento.id}`, pensamento)
      return await response.data
    }
    catch {
      alert('Erro ao editar pensamento')
      throw error
    }
  },

  async excluirPensamento(id) {
    try {
      const response = await axios.delete(`${URL_BASE}/pensamentos/${id}`)
    }
    catch {
      alert('Erro ao excluir um pensamento')
      throw error
    }
  },

  async buscarPensamentosPorTermo(termo) {
    try {
      const pensamentos = await this.buscarPensamentos()
      const termoEmMinusculas = termo.toLowerCase()

      const pensamentosFiltrados = pensamentos.filter(pensamento => {
        return pensamento.conteudo.toLowerCase().includes(termoEmMinusculas) ||
          pensamento.autoria.toLowerCase().includes(termoEmMinusculas)
      })
      return pensamentosFiltrados
    } catch (error) {
      alert("Erro ao filtrar pensamentos")
      throw error
    }
  },

  async atualizarFavorito(id, favorito) {
    try {
      const response = await axios.patch(`${URL_BASE}/pensamentos/${id}`, { favorito })
      return response.data
    } catch (error) {
      alert("Erro ao atualizar favorito")
      throw error
    }
  }
}

export default api