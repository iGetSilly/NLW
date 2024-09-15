const { select, input, checkbox } = require("@inquirer/prompts")

let meta = {
    value: "Tomar 3L de água por dia",
    checked: false,
}

let metas = [meta]

const cadastrarMeta = async () => {
    const meta = await input({ message: "Digite a meta:" })

    if (meta.length == 0) {
        console.log("A meta não pode ser vazia.")
        return
    }

    metas.push(
        { value: meta, checked: false }
    )
}

const listarMeta = async () => {
    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false,
    })

    metas.forEach((metas) => {
        metas.checked = false
    })

    if (respostas.length == 0) {
        console.log("Nenhuma meta seleciona!")
        return
    }

    respostas.forEach((respostas) => {
        const meta = metas.find((meta) => {
            return meta.value == respostas
        })
        meta.checked = true
    })
}

const metasRealizadas = async () => {
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if (realizadas.length == 0) {
        console.log("Não existem metas realizadas!")
        return
    }

    await select({
        message: "Metas Realizadas",
        choices: [...realizadas]
    })
}

const metasAbertas = async () => {
    const abertas = metas.filter((metas) => {
        return !metas.checked
    })

    if (abertas.lenght == 0) {
        console.log("Não existem metas abertas!")
        return
    }

    await select ({
        message: "Metas Abertas " + abertas.lenght,
        choices: [...abertas]
    })
}

const start = async () => {
    while (true) {
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
            case "sair":
                console.log("Saindo")
                return
        }
    }
}
start()