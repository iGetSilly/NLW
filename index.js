const { select, input, checkbox } = require("@inquirer/prompts")
const fs = require("fs").promises

let mensagem = "Bem vindo ao app de metas!"

let metas

const carregarMetas = async () => {
    try {
        const dados = await fs.readFile("metas.json", "utf-8")
        metas = JSON.parse(dados)
    }
    catch(erro) {
        metas = []
    }
}

const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}



const cadastrarMeta = async () => {
    const meta = await input({ message: "Digite a meta:" })

    if (meta.length == 0) {
        console.log("A meta não pode ser vazia.")
        return
    }

    metas.push(
        { value: meta, checked: false }
    )

    mensagem = "Meta cadastrada com sucesso"
}

const listarMeta = async () => {
    if (metas.lenght == 0) {
        mensagem = "Não há metas"
        return
    }
    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false,
    })

    metas.forEach((metas) => {
        metas.checked = false
    })

    if (respostas.length == 0) {
        mensagem = "Nenhuma meta seleciona!"
        return
    }

    respostas.forEach((respostas) => {
        const meta = metas.find((meta) => {
            return meta.value == respostas
        })
        meta.checked = true
    })

    mensagem = "Metas listadas com sucesso"
}

const metasRealizadas = async () => {
    if (metas.lenght == 0) {
        mensagem = "Não há metas"
        return
    }
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if (realizadas.length == 0) {
        mensagem = "Não existem metas realizadas!"
        return
    }

    await select({
        message: "Metas Realizadas",
        choices: [...realizadas]
    })

    mensagem = "Todas as metas realizadas:"
}

const metasAbertas = async () => {
    if (metas.lenght == 0) {
        mensagem = "Não há metas"
        return
    }
    const abertas = metas.filter((metas) => {
        return !metas.checked
    })

    if (abertas.lenght == 0) {
        mensagem = "Não existem metas abertas!"
        return
    }

    await select({
        message: "Metas Abertas " + abertas.lenght,
        choices: [...abertas]
    })

    mensagem = "Todas as metas abertas:"
}

const removerMetas = async () => {
    if (metas.lenght == 0) {
        mensagem = "Não há metas"
        return
    }
    const metasDesmarcadas = metas.map((meta) => {
        return { value: meta.value, checked: false }
    })

    const respostas = await checkbox({
        message: "Selecione item para remover",
        choices: [...metasDesmarcadas],
        instructions: false,
    })

    if (respostas.length == 0) {
        mensagem = "Não há itens para remover!"
        return
    }

    respostas.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        })
    })

    mensagem = "Meta(s) deletada(s) com sucesso!"
}

const mostrarMensagem = () => {
    console.clear()

    if(mensagem != "") {
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}

const start = async () => {
    await carregarMetas()
    while (true) {
        mostrarMensagem()
        await salvarMetas()
        const opcao = await select({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cadastrar"
                },
                {
                    name: "Listar Metas",
                    value: "listar"
                },
                {
                    name: "Metas Realizadas",
                    value: "realizadas"
                },
                {
                    name: "Metas abertas",
                    value: "abertas"
                },
                {
                    name: "Remover Metas",
                    value: "remover"
                },
                {
                    name: "Sair",
                    value: "sair"
                }
            ]
        })

        switch (opcao) {
            case "cadastrar":
                await cadastrarMeta()
                break
            case "listar":
                await listarMeta()
                break
            case "realizadas":
                await metasRealizadas()
                break
            case "abertas":
                await metasAbertas()
                break
            case "remover":
                await removerMetas()
                break
            case "sair":
                console.log("Saindo")
                return
        }
    }
}
start()