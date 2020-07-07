const contSolicitudes = document.getElementById('contSolicitudes');

window.addEventListener('load', async() => {
    comprobarSignalsPending();
    proximaAgenda();
});

async function comprobarSignalsPending() {
    contSolicitudes.innerHTML = '';
    const datosSignals = await fetch('/signals-pendientes');
    const jsonSignals = await datosSignals.json();
    if (JSON.stringify(jsonSignals) != '{}') {
        renderSignalsPending(jsonSignals);
    } else {
        contSolicitudes.innerHTML = '<p class="text-muted">No hay nuevas solicitudes.</p>'
    }
}

function renderSignalsPending(datos) {
    datos.forEach(info => {
        const anioActual = new Date().getFullYear();
        const Edad = anioActual - parseInt(info.fechaNacimiento.split('T')[0].split('-')[0]);
        contSolicitudes.innerHTML += `
        <div class="col-md-5 mr-1 mb-1 col-sm-5 shadow-sm bg-white d-flex flex-wrap justify-content-between p-2 align-items-center" style="border-left: solid 5px #41E296;">
            <div class="w-100 d-flex justify-content-between p-2 align-items-center">
                <img src="${info.rutaImg}" alt="doctor de ubimed" width="70px" class="rounded-circle">
                <div class="w-75 d-flex justify-content-end text-muted flex-column align-items-end">
                    <small class="text-right" style="word-break: break-word;">${info.nombre} ${info.apellido}</small>
                    <small class="text-right" style="word-break: break-word;">${info.profesion}</small>
                    <small class="text-right" style="word-break: break-word;">${info.especialidad}</small>
                    <small class="text-right" style="word-break: break-word;">${Edad} Años</small>
                    <small class="text-right">${info.email}</small>
                </div>
            </div>
            <div class="w-100 d-flex align-items-center justify-content-center flex-column">
                <div class="btn-group" role="group" aria-label="Basic example">
                    <button type="button" onclick="aceptarSolicitud('${info.email}')" class="aceptarSolicitud btn btn-sec">Aceptar</button>
                    <button type="button" onclick="rechazarSolicitud('${info.email}')" class="rechazarSolicitud btn btn-danger">Rechazar</button>
                </div>
            </div>
        </div>
        `;
    });
}

async function aceptarSolicitud(correo) {
    const datosSend = {
        correo
    }
    const accept = await fetch('/signals-accept', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosSend)
    });
    comprobarSignalsPending();
}

async function rechazarSolicitud(correo) {
    const result = confirm('estas seguro que desear rechazar la solicitud del profesional de la salud');
    if (result) {
        const datosSend = {
            correo
        }
        const accept = await fetch('/signals-rechazar', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosSend)
        });
        comprobarSignalsPending();
    }
}

async function proximaAgenda() {
    const consultas = await fetch('/consultas-agendadas');
    const respuesta = await consultas.json();
    if (JSON.stringify(respuesta) != '{}') {
        respuesta.forEach(info => {
            contRenderConsultas.innerHTML += `
                        <div class="col-md-4 mr-1 mb-1 col-sm-5 shadow-sm bg-white d-flex justify-content-between p-2 align-items-center" style="border-left: solid 5px #3AB0F0;">
                            <img src="${info.rutaImg}" alt="doctor de ubimed" width="70px" class="rounded-circle">
                            <div class="w-75 d-flex justify-content-end text-muted flex-column align-items-end">
                                <small class="text-right">Motivo: ${info.motivo}</small>
                                <small class="text-right">Nombre(s): ${info.nombre} ${info.apellido}</small>
                                <small class="text-right">Fecha: ${info.fechaConsulta.split('T')[0]}</small>
                                <small class="text-right">Hora: ${info.horaConsulta}</small>
                                <small class="text-right">${info.correoDoctor}</small>
                            </div>
                        </div>
                        `;
        });
    } else {

    }
}