const btnLlamar = document.getElementById('btnLlamar');
const medico = document.getElementById('medico');
const reloj = document.getElementById('reloj');
const renderFichaDoctor = document.getElementById('renderFichaDoctor');
const textOpinion = document.getElementById('textOpinion');
const btnOpinar = document.getElementById('btnOpinar');
const renderConsultaIdDocApoyo = document.getElementById('renderConsultaIdDocApoyo');

btnOpinar.disabled = true;

textOpinion.addEventListener('input', () => {
    if (textOpinion.value.length >= 10) {
        btnOpinar.disabled = false;
    } else {
        btnOpinar.disabled = true;
    }
})

btnOpinar.addEventListener('click', async() => {
    const datosSend = {
        opinion: textOpinion.value
    }
    const opinar = await fetch('/opinar', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosSend)
    });
    const respuesta = await opinar.json();
    if (respuesta.estado === 'ok') {
        document.getElementById('contOpinion').innerHTML = `
            <div class="d-flex justify-content-center align-items-center">
                <small class="text-center">Gracias por tu opinion</small>
            </div>
        `;
    }
});

let correoLLamar = '';

const formUploadSupport = document.getElementById('formUploadSupport');
const id_Consulta_input = document.getElementById('id_Consulta_input');
const finishConsulta = document.getElementById('finishConsulta');
const renderConsentimiento = document.getElementById('renderConsentimiento');
let derecho = false;
let datosDocGlobal = {};

renderDatosConsulta();
verificarLLamada();

btnLlamar.disabled = true;

let datosParaConsentimiento = {};

let rutaPDF = '';
let paginaPdf = 1;

async function nextPdf() {
    if (paginaPdf < 4) {
        paginaPdf++;
        renderPDF(rutaPDF, paginaPdf);
    } else {
        paginaPdf = 1;
        renderPDF(rutaPDF, paginaPdf);
    }
}

async function previusPdf() {
    if (paginaPdf == 1) {
        paginaPdf = 4;
        renderPDF(rutaPDF, paginaPdf);
    } else {
        paginaPdf--;
        renderPDF(rutaPDF, paginaPdf);
    }
}

async function aceptarConsentimiento() {
    ocultarBtnConsentimiento.innerText = 'Cargando';
    const loadPdf = document.getElementById('loadPdf');
    const my_pdf_viewer = document.getElementById('my_pdf_viewer');
    const createConsentimiento = await fetch('/crear-consentimiento', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosDocGlobal)
    });
    const respuestaConsentimiento = await createConsentimiento.json();
    if (respuestaConsentimiento.accept) {
        derecho = true;
        document.getElementById('ocultarBtnConsentimiento').classList.add('d-none');
    } else {
        $('#consentimientoRender').modal('show');
        rutaPDF = `./docs/${respuestaConsentimiento.name}`;
        paginaPdf = 1;
        renderPDF(rutaPDF, 1)
    }
    ocultarBtnConsentimiento.innerText = 'Consentimiento Informado';
}

async function aceptarConsentimientoConfirm() {
    document.getElementById('simularFirmaCompra').innerText = 'Firmando digitalmente';
    setInterval(async() => {
        $('#consentimientoRender').modal('hide');
        const aceptar = await fetch(`/aceptar-con/${datosDocGlobal.id}`);
        derecho = true;
        setInterval(() => {
            document.getElementById('simularFirmaCompra').innerText = 'Firmado.';
            document.getElementById('ocultarBtnConsentimiento').classList.add('d-none');
        }, 1000)
    }, 2000);
}

function renderPDF(ruta, pagina) {
    let myState = {
        pdf: null,
        currentPage: pagina,
        zoom: 1
    }
    pdfjsLib.getDocument(ruta).then((pdf) => {
        loadPdf.classList.add('d-none');
        my_pdf_viewer.classList.remove('d-none');
        my_pdf_viewer.classList.add('d-flex');
        myState.pdf = pdf;
        myState.pdf.getPage(myState.currentPage).then((page) => {
            var canvas = document.getElementById("pdf_renderer");
            var ctx = canvas.getContext('2d');
            var viewport = page.getViewport(myState.zoom);
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ancho = canvas.width + 10;
            document.getElementById('contRenderPdf').style.width = ancho + 'px ';
            page.render({
                canvasContext: ctx,
                viewport: viewport
            });
        });
    });
}

btnLlamar.addEventListener('click', async() => {
    medico.classList.remove('d-none');
    btnLlamar.classList.add('d-none');
    call(correoLLamar);
});

async function verificarLLamada() {
    let cond = 1;
    setInterval(async() => {
        if (cond == 1) {
            const llamar = await fetch('/verificarLlamadaEntrante');
            const respuesta = await llamar.json();
            if (JSON.stringify(respuesta) != '{}') {
                btnLlamar.disabled = false;
                cond = 0;
            } else {
                if (derecho) {
                    btnLlamar.classList.remove('btn-secondary');
                    btnLlamar.classList.add('btn-main');
                    btnLlamar.disabled = true;
                }
            }
        }
    }, 10000);
}

async function renderDatosConsulta() {
    const datosLlamada = await fetch('/AquienLlamo');
    const dataCal = await datosLlamada.json();
    datosParaConsentimiento = dataCal;
    if (JSON.stringify(dataCal) != '{}') {
        renderFecha.innerHTML = `
                            <div class="w-100 justify-content-between d-flex">
                                <small>Fecha Consulta</small>
                                <small> ${dataCal.fechaConsulta.split('T')[0]}</small>
                            </div>
                            <div class="w-100 justify-content-between d-flex">
                                <small>Hora Consulta</small>
                                <small> ${dataCal.horaConsulta.split(':')[0] + ':' + dataCal.horaConsulta.split(':')[1]}</small>
                            </div>
                            `;
        const date = new Date().getFullYear();
        const fechaNac = dataCal.fechaNacimiento.split('T')[0].split('-')[0];
        const edad = date - fechaNac;
        datosDocGlobal = dataCal;
        renderConsultaIdDocApoyo.innerText = datosDocGlobal.id;
        renderFichaDoctor.innerHTML = `
                            <div class="w-75 d-flex justify-content-start align-items-start flex-column">
                                <div class="w-75 d-flex justify-content-between">
                                    <div class="w-50">
                                        <small>${dataCal.nombre} ${dataCal.apellido}</small>
                                    </div>
                                    <div class="w-50">
                                        <small>${edad} Años</small>
                                    </div>
                                </div>
                                <div class="w-75 d-flex justify-content-between">
                                    <div class="w-50 ">
                                        <small>${dataCal.profesion}</small>
                                    </div>
                                    <div class="w-50">
                                        <small>${dataCal.especialidad}</small>
                                    </div>
                                </div>
                                <div class="w-75 d-flex justify-content-between">
                                    <div class="w-50">
                                        <small>${dataCal.genero}</small>
                                    </div>
                                </div>
                                <small>${dataCal.email}</small>
                            </div>
                            <img src="${dataCal.rutaImg}" width="100px" height="100px" class="rounded-circle" alt="img paciente">
                            `;
        correoLLamar = dataCal.email;
        // id_Consulta_input.value = dataCal.id;
    } else {
        contenedorPrincipal.innerHTML = `<div class="w-75 p-4">
        <small>Aun no tienes citas agendas</small>
        </div>`
    }
}

async function call(idLlamada) {
    const datosLlamada = {
        doctor: idLlamada
    }

    const call = await fetch('/llamar/contestar', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosLlamada)
    });

    const respuesta = await call.json();
    initializeSession(respuesta.api, respuesta.sesion_id, respuesta.token);
    console.table(respuesta);
}

function initializeSession(apiKey, sessionId, token) {
    var session = OT.initSession(apiKey, sessionId);

    // Subscribe to a newly created stream
    session.on('streamCreated', function streamCreated(event) {
        var subscriberOptions = {
            insertMode: 'append',
            width: '100%',
            height: '100%'
        };
        session.subscribe(event.stream, 'medico', subscriberOptions, handleError);
    });

    session.on('sessionDisconnected', function sessionDisconnected(event) {
        console.log('You were disconnected from the session.', event.reason);
    });

    // initialize the publisher
    var publisherOptions = {
        insertMode: 'append',
        width: '100%',
        height: '100%'
    };
    var publisher = OT.initPublisher('paciente', publisherOptions, handleError);

    // Connect to the session
    session.connect(token, function callback(error) {
        if (error) {
            handleError(error);
        } else {
            // If the connection is successful, publish the publisher to the session
            session.publish(publisher, handleError);
            iniciarReloj();
        }
    });

    finishConsulta.addEventListener('click', () => {
        const decision = confirm('Finalizar la consulta, cerrara la comunicación con tu profesional de forma permanente');
        if (decision) {
            session.disconnect();
            paciente.classList.add('d-none');
        }
    });

}

function handleError(error) {
    if (error) {
        alert(error.message);
    }
}


function iniciarReloj() {
    let minutos = 24;
    let segundos = 59;
    setInterval(() => {
        if (minutos != 0 || segundos != 1) {
            if (segundos == 0) {
                segundos = 60;
                minutos--;
            }
            if (minutos <= 9 && segundos <= 9) {
                reloj.innerText = '0' + minutos + ':0' + segundos;
            } else {
                if (minutos <= 9 && segundos > 9) {
                    reloj.innerText = '0' + minutos + ':' + segundos;
                } else {
                    if (minutos > 9 && segundos <= 9) {
                        reloj.innerText = minutos + ':0' + segundos;
                    } else {
                        reloj.innerText = minutos + ':' + segundos;
                    }
                }
            }
            segundos--;
        } else {
            reloj.innerText = '00:00';
            reloj.classList.add('text-danger');
        }
    }, 1000);
}

