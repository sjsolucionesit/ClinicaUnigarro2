const docApoyoInput = document.getElementById('docApoyoInput');
const mostrarElementosApoyo = document.getElementById('mostrarElementosApoyo');
const btnEnviarArchivos = document.getElementById('btnEnviarArchivos');

btnEnviarArchivos.disabled = true;

docApoyoInput.addEventListener('input', () => {
    const ArchivosSubidos = docApoyoInput.files;
    btnEnviarArchivos.disabled = false;
    let data = new FormData();
    data.append('idConsulta', renderConsultaIdDocApoyo.innerText);

    for(let i = 0; i < ArchivosSubidos.length; i++){
        const link = URL.createObjectURL(ArchivosSubidos[i]);
        mostrarElementosApoyo.innerHTML += `<small><a href="${link}" download>${ArchivosSubidos[i].name}</a></small>`;
        data.append('file', ArchivosSubidos[i]);
    }

    btnEnviarArchivos.addEventListener('click', async () => {
        const envioArchivos = await fetch('/uploads-support', {
            method: 'POST',
            headers: {
                'Accept': '*.*',
            },
            body: data
        });
        const respuesta = await envioArchivos.json();
        if(respuesta.estado === 'ok'){
            mostrarElementosApoyo.innerHTML = `<small class="text-success">Documentos cargados, tu profesional de la salud ya puede verlos, no tienes que repetir este procedimiento a menos que quieras cargar un documento nuevo.</small>`
        }
    });
});

