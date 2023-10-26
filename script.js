// Capturar fala
const CapturarFala = () => {

    let botao = document.querySelector('#microfone');
    let input = document.querySelector('input');

    const OpenAPIKey = process.env.OPENAI_API_KEY;
    const AzureAPIKey = process.env.AZURE_API_KEY;

    // // Variáveis para controlar o estado do reconhecimento de fala
    // let reconhecimentoAtivo = false;
    // let reconhecimento; // Objeto de reconhecimento de fala

    // const ativarReconhecimento = () => {
    //     reconhecimento = new webkitSpeechRecognition();
    //     reconhecimento.lang = window.navigator.language;
    //     reconhecimento.interimResults = true;
    
    //     reconhecimento.onstart = () => {
    //         reconhecimentoAtivo = true;
    //     };
    
    //     reconhecimento.onend = () => {
    //         reconhecimentoAtivo = false;
    //         reconhecimento.start(); // Reinicia o reconhecimento após terminar
    //     };
    
    //     reconhecimento.onresult = (event) => {
    //         const result = event.results[event.results.length - 1][0].transcript.toLowerCase();
    
    //         if (result.includes('oi robô')) {
    //             // Simular um clique no botão de microfone
    //             botao.click();
    //         }
    //     };
    
    //     reconhecimento.start();
    // };
    
    // botao.addEventListener('click', () => {
    //     if (!reconhecimentoAtivo) {
    //         reconhecimento = new webkitSpeechRecognition();
    //         reconhecimento.lang = window.navigator.language;
    //         reconhecimento.interimResults = true;
    
    //         reconhecimento.onstart = () => {
    //             reconhecimentoAtivo = true;
    //         };
    
    //         reconhecimento.onend = () => {
    //             reconhecimentoAtivo = false;
    //         };
    
    //         reconhecimento.onresult = (event) => {
    //             const result = event.results[event.results.length - 1][0].transcript.toLowerCase();
    //             input.value = result; // Atualiza o valor do input com o que foi reconhecido
    //         };
    
    //         reconhecimento.start();
    //     } else {
    //         reconhecimento.stop();
    //         reconhecimentoAtivo = false;
    //     }
    // });
    

    // const ativarReconhecimentoJarvis = () => {
    //     reconhecimento = new webkitSpeechRecognition();
    //     reconhecimento.lang = window.navigator.language;
    //     reconhecimento.interimResults = true;
    
    //     reconhecimento.onstart = () => {
    //         reconhecimentoAtivo = true;
    //     };
    
    //     reconhecimento.onend = () => {
    //         reconhecimentoAtivo = false;
    //         reconhecimento.start(); // Reinicia o reconhecimento após terminar
    //     };
    
    //     reconhecimento.onresult = (event) => {
    //         const result = event.results[event.results.length - 1][0].transcript.toLowerCase();
    //         input.value = result; // Atualiza o valor do input com o que foi reconhecido
    
    //         if (result.includes('teste')) {
    //             botao.click(); // Simula um clique no botão de microfone
    //         }
    //     };
    
    //     reconhecimento.start();
    // };
    
    // Ativar o reconhecimento de fala assim que a página é carregada
    window.addEventListener('load', () => {
        AtivarJarvis();
    });

    const AtivarJarvis = () => {

        // Crie uma instância de SpeechRecognition
        const recognition = new webkitSpeechRecognition();
    
        // Defina configurações para a instância
        recognition.continuous = true; // Permite que ele continue escutando
        recognition.interimResults = false; // Define para true se quiser resultados parciais
    
        // Inicie o reconhecimento de voz
        recognition.start();
    
        // Adicione um evento de escuta para lidar com os resultados
        recognition.onresult = (event) => {
            const result = event.results[event.results.length - 1]; // Último resultado
    
            // Verifique o texto reconhecido
            const recognizedText = result[0].transcript;
    
            // Verifique se a palavra "Jarvis" está no texto
            if (recognizedText.toLowerCase().includes('oi robô')) {
    
                // Comece a salvar a pergunta quando "Jarvis" é detectado
                let array_pergunta = recognizedText.toLowerCase().split('oi robô');
                array_pergunta = array_pergunta[array_pergunta.length - 1];
    
                input.value = array_pergunta;
                PerguntarAoJarvis(array_pergunta);
    
                // Pare o reconhecimento de voz para economizar recursos
                recognition.stop();
            }
        };
    
        // Adicione um evento para reiniciar o reconhecimento após um tempo
        recognition.onend = () => {
            setTimeout(() => {
                recognition.start();
            }, 1000); // Espere 1 segundo antes de reiniciar
        };
    
    
    }

    // Objeto de reconhecimento de fala
    const recognition = new webkitSpeechRecognition();
    recognition.lang = window.navigator.language;
    recognition.interimResults = true;

    botao.addEventListener('mousedown', () => {
        recognition.start();
    });

    botao.addEventListener('mouseup', () => {
        recognition.stop();
        PerguntarAoJarvis(input.value);
        
    });

    // Capturar resultado da fala
    recognition.addEventListener('result', (e) => {
        const result = e.results[0][0].transcript;
        input.value = result;
    });


}


const PerguntarAoJarvis = (pergunta) => {
    let url = 'https://api.openai.com/v1/chat/completions';
    let header = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OpenAPIKey}`
      }

    let body = {
        "model": "ft:gpt-3.5-turbo-0613:zeros-e-um::8DDHyrh4",
        "messages": [
            {"role": "system", "content": "Jarvis é um chatbot pontual e muito simpático que ajuda as pessoas"},
            {"role": "user", "content": pergunta}
            ],
        "temperature": 0.7
      }

    let options = {
        method: 'POST',
        headers: header,
        body: JSON.stringify(body)
    }

    fetch(url, options)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log(data);
        FalarComoJarvis(data.choices[0].message.content);
    });
}

const FalarComoJarvis = (texto) => {
    var myHeaders = new Headers();
    myHeaders.append("Ocp-Apim-Subscription-Key", AzureAPIKey);
    myHeaders.append("Content-Type", "application/ssml+xml");
    myHeaders.append("X-Microsoft-OutputFormat", "audio-16khz-128kbitrate-mono-mp3");
    //myHeaders.append("User-Agent", "curl");

    var raw = "<speak version='1.0' xml:lang='pt-BR'><voice xml:lang='pt-BR' xml:gender='Male' name='pt-BR-JulioNeural'>" + texto + "</voice></speak>";

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        //redirect: 'follow'
    };

    fetch("https://brazilsouth.tts.speech.microsoft.com/cognitiveservices/v1", requestOptions)
    .then(response => response.blob())
    .then(audioBlob => {
        var audioUrl = URL.createObjectURL(audioBlob);
        var audio = new Audio(audioUrl);
        audio.play();
    })
    .catch(error => console.log('error', error));
}

CapturarFala();

const modoToggle = document.getElementById("modo-toggle");

modoToggle.addEventListener("click", () => {
    const body = document.body;

    // Verifica se o modo atual é light mode
    if (body.classList.contains("light-mode")) {
        // Alterna para dark mode
        body.classList.remove("light-mode");
        body.classList.add("dark-mode");
        modoToggle.textContent = "Light Mode"; // Altera o texto do botão
        modoToggle.style.backgroundColor = "#ffffff"; // Altera a cor de fundo para branco
        modoToggle.style.color = "#000000"; // Altera a cor do texto para preto
    } else {
        // Alterna de volta para light mode
        body.classList.remove("dark-mode");
        body.classList.add("light-mode");
        modoToggle.textContent = "Dark Mode"; // Altera o texto do botão de volta
        modoToggle.style.backgroundColor = "#333333"; // Retorna a cor de fundo para o estilo dark mode
        modoToggle.style.color = "#ffffff"; // Retorna a cor do texto para branco
    }

    
});

const microfoneButton = document.getElementById("microfone");

microfoneButton.addEventListener("mousedown", () => {
    microfoneButton.classList.add("clicked");
});

microfoneButton.addEventListener("mouseup", () => {
    microfoneButton.classList.remove("clicked");
});


