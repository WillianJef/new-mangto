export function valida(input) {
    const TipodeInput = input.dataset.tipo
    if (Validares[TipodeInput]) {
        Validares[TipodeInput](input);
    }

    if (input.validity.valid) {
        input.parentElement.classList.remove('input-container--invalido');
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = '';
    } else {
        input.parentElement.classList.add('input-container--invalido');
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = mostrarMensagemdeErro(TipodeInput, input)
    }

}
const tipoDeErros = [
    'valueMissing',
    'typeMismatch',
    'patternMismatch',
    'customError'
]

const MensagemdeErro = {
    nome: {
        valueMissing: 'O campo não esta preenchido corretamente.'
    },
    email: {
        valueMissing: 'O campo não esta preenchido corretamente.',
        typeMismatch: 'O email digitado não e valido.'
    },
    senha: {
        valueMissing: 'O campo não esta preenchido corretamente.',
        patternMismatch: 'A senha deve conter pelo menos de 6 a 12 dígitos, deve conter uma letra maiscula e uma miniscula, e nao deve conter símbolos.'
    },
    Datadenascimento: {
        valueMissing: 'O campo não esta preenchido corretamente.',
        customError: 'Voce deve ser maior que 18 anos para se cadastrar.'
    },
    cpf: {
        valueMissing: 'O campo não esta preenchido corretamente.',
        customError: 'O CPF não esta digitado corretamente.'
    },
    cep: {
        valueMissing: 'O campo não esta preenchido corretamente.',
        patternMismatch: 'O cep não esta digitado corretamente.',
        customError: 'Erro ao consultar o CEP'
    },
    Logradouro: {
        valueMissing: 'O campo não esta preenchido corretamente.',
        patternMismatch: 'O Logradouro não esta digitado corretamente.'
    },
    cidade: {
        valueMissing: 'O campo não esta preenchido corretamente.',
        patternMismatch: 'O cidade não esta digitado corretamente.'
    },
    estado: {
        valueMissing: 'O campo não esta preenchido corretamente.',
        patternMismatch: 'O estado não esta digitado corretamente.'
    },
    preco: {
        valueMissing: 'O campo não esta preenchido corretamente.',
    },

}
const Validares = {
    DataNascimento: input => validaDatadeNascismento(input),
    cpf: input => validaCPF(input),
    cep: input => recuperarCep(input)
}

function mostrarMensagemdeErro(TipoDeInput, input) {
    let mensagem = '';
    tipoDeErros.forEach(erro => {
        if (input.validity[erro]) {
            mensagem = MensagemdeErro[TipoDeInput][erro]
        }
    })
    return mensagem;
}

function validaDatadeNascismento(input) {
    const dataRecebida = new Date(input.value)
    let mensagem = '';

    if (!maiorque18(dataRecebida)) {
        mensagem = 'Voce deve ser maior que 18 anos para se cadastrar.';
    };


    input.setCustomValidity(mensagem);
}

function maiorque18(data) {
    const dataDeHoje = new Date()
    const dataMaioque18 = new Date(data.getUTCFullYear() + 18, data.getUTCMonth(), data.getUTCDate())
    return dataMaioque18 <= dataDeHoje;
}
/*
function validaCPF(input) {
    const CPFformatado = input.value.replace(/\D/g, '');
    let mensagem = '';
    if (!checaCPFrepetidos(CPFformatado) || !checacpf(CPFformatado)) {
        mensagem = 'O CPF não esta digitado corretamente.'
    }
    input.setCustomValidity(mensagem)
}

function checaCPFrepetidos(cpf) {
    const valorRepetido = [
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444'
    ]
    let cpfvalido = true;
    valorRepetido.forEach(valor => {
        if (valor == cpf) {
            cpfvalido = false
        }
    })
    return cpfvalido

}

function checacpf(cpf) {
    const multiplicador = 10;
    return checamultiplicadoresCpf(cpf, multiplicador)
}

function checamultiplicadoresCpf(cpf, multiplicador) {
    if (multiplicador >= 12) {
        return true
    }
    let soma = 0
    let multiplicadorinicial = multiplicador;
    const CpfsemDigitos = cpf.substr(0, multiplicador - 1).split('')
    const Digitoverificador = cpf.charAt(multiplicador - 1)
    for (let contador = 0; multiplicador > 1; multiplicadorinicial--) {
        soma = soma + CpfsemDigitos[contador] * multiplicadorinicial
        contador++
    }
    if (Digitoverificador == confirmaDigitador(soma)) {
        return checamultiplicadoresCpf(cpf, multiplicador + 1)
    }
}
function confirmaDigitador(soma) {
    return 11 - (soma % 11)
}*/
function validaCPF(input) {
    const CPFformatado = input.value.replace(/\D/g, '');
    let mensagem = '';
    if (!checaCPFrepetidos(CPFformatado) || !checaCPFvalido(CPFformatado)) {
        mensagem = 'O CPF não está digitado corretamente.';
    }
    input.setCustomValidity(mensagem);
}

function checaCPFrepetidos(cpf) {
    const valorRepetido = [
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999'
    ];
    return !valorRepetido.includes(cpf);
}

function checaCPFvalido(cpf) {
    if (cpf.length !== 11) {
        return false;
    }

    function calculaDigito(cpf, multiplicadorInicial) {
        let soma = 0;
        for (let i = 0; i < multiplicadorInicial - 1; i++) {
            soma += parseInt(cpf[i]) * (multiplicadorInicial - i);
        }
        let resto = (soma * 10) % 11;
        return resto === 10 || resto === 11 ? 0 : resto;
    }

    const digito1 = calculaDigito(cpf, 10);
    const digito2 = calculaDigito(cpf, 11);

    return digito1 === parseInt(cpf[9]) && digito2 === parseInt(cpf[10]);
}

function recuperarCep(input) {
    const cep = input.value.replace(/\D/g, '');
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'content-type': 'application/json;charset=UTF-8'
        }
    }
    if (!input.validity.patternMismatch && !input.validity.valueMissing) {
        fetch(url,options).then(
            response => response.json()
        ).then(
            data => {
                if (data.erro){
                    input.setCustomValidity('Erro ao consultar o CEP') 
                    return
                }
                input.setCustomValidity('')
                preencheoCep(data)
                return
            }

        )
    }
}

function preencheoCep(data){
    const logradouro = document.querySelector('[data-tipo="logradouro"]')
    const cidade = document.querySelector('[data-tipo="cidade"]')
    const estado = document.querySelector('[data-tipo="estado"]')

    logradouro.value = data.logradouro
    cidade.value = data.localidade
    estado.value = data.uf
}


/*
// O CEP que você deseja consultar
const cep = '01001000';

// URL da API do ViaCEP
const url = `https://viacep.com.br/ws/${cep}/json/`;

// Fazendo a requisição para a API
fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao consultar o CEP');
    }
    return response.json();
  })
  .then(data => {
    // Aqui você pode utilizar os dados retornados pela API
    console.log('Dados do CEP:', data);
  })
  .catch(error => {
    console.error('Erro:', error);
  });*/

