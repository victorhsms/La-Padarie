const Modal = {
    open(){
        //Abrir o Modal
        //Adicionar a class active ao modal
        document.querySelector('.modal-overlay')
        .classList
        .add('active')
    },
    close(){
        //Fechar o Modal
        //remover a class active do modal
        document.querySelector('.modal-overlay')
        .classList
        .remove('active')
    }
}

const Storage = {
    get () {
        return JSON.parse(localStorage.getItem("lapadarie:cards")) || []
    },
    set (cards) {
        localStorage.setItem("lapadarie:cards", JSON.stringify(cards))
    }
}

const Transaction = {
    all: Storage.get(),

    add(cards){
        Transaction.all.push(cards)

        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },
    customers() {
        // Retornar número de clientes
        return Transaction.all.length
    },
    sales() {
        // Retornar pães vendidos
        let sale = 0
        Transaction.all.forEach(transaction => {
            sale += transaction.paes
        })
        return sale
    },
    total() {
        let montante = 0;
        Transaction.all.forEach(transaction => {
            montante += transaction.pagamento
        })
        return montante
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#historic'),

    addTransaction(cards, index) {
        const historicItems = document.createElement('section')
        historicItems.innerHTML = DOM.innerHTMLTransaction(cards, index)
        historicItems.dataset.index = index
        DOM.transactionsContainer.appendChild(historicItems)
    },

    innerHTMLTransaction(cards, index) {
        const html = `
        <div id="historic-items">
            <div class="historic-text">
                <h3>${cards.pessoa}</h3>
                <div class="historic-text-paragraphs">
                    <p>Total de pães:&nbsp;<span>${cards.paes} pães</span></p>
                    <p>Total a pagar:&nbsp;<span>${cards.pagamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></p>
                </div>
            </div>
            <a href="#" onclick="Transaction.remove(${index})"><img src="./imagens/trash.svg" alt="icone de uma Lixeira"></a>
        </div>
        `

        return html
    },

    updateBalance() {
        document
            .getElementById('custumersDisplay')
            .innerHTML = Transaction.customers()
        document
            .getElementById('salesDisplay')
            .innerHTML = Transaction.sales()
        document
            .getElementById('totalDisplay')
            .innerHTML = Transaction.total().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = `
        <a href="#" onclick="Modal.open()">+ Adicionar pessoa a fila</a>
        `
    }
}

const Form = {
    who: document.querySelector('input#nova-pessoa'),
    howMuch: document.querySelector('input#qnt-paes'),

    getValues() {
        return {
            pessoa: Form.who.value,
            paes: parseInt(Form.howMuch.value),
            pagamento: Form.howMuch.value * 0.50,
        }
    },

    validateFields() {
        const { pessoa, paes, pagamento } = Form.getValues()

        if(pessoa.trim() === "" || toString(paes).trim() === "") {
            throw new Error("Por favor, preencha todos os campos")
        }
    },

    saveTransaction(cards) {
        Transaction.add(cards)
    },

    clearFields() {
        Form.who.value = ""
        Form.howMuch.value = ""
    },

    submit(event){
        event.preventDefault()

        try {

            //Verificar se tudo foi preenchido
            Form.validateFields()

            const cards = Form.getValues()
            //Salvar
            Form.saveTransaction(cards)

            //Apagar os dados do formulário
            Form.clearFields()

            //Fechar modal
            Modal.close()
        } catch (error) {
            alert(error.message)
        }

        
    }
}

const App = {
    init(){
        Transaction.all.forEach((historic, index) => {
            DOM.addTransaction(historic, index)
        })
        
        DOM.updateBalance()

        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    }
}

App.init()
