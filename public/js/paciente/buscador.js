const contBusqueda = document.getElementById('contBusqueda');
const buscador = document.getElementById('buscador');
const filtro = document.getElementById('filtro');

window.addEventListener('load', () => {
    renderInit();
});

buscador.addEventListener('input', async() => {
    if (buscador.value.length > 0) {
        const selectFiltro = filtro.value;
        const buscar = buscador.value;
        const urlBusqueda = `/buscar/${selectFiltro}/${buscar}`;
        const getSearch = await fetch(urlBusqueda);
        const getData = await getSearch.json();
        console.log(JSON.stringify(getData));
        if (JSON.stringify(getData) == '{}') {
            const message = `
                <div class="w-100 d-flex justify-content-center align-items-center flex-wrap">
                    <p class="text-muted w-100">No encontramos a ningún profesional con tus parámetros de búsqueda</p>
                    <div class="w-25"> <img src="./img/not-found.jpg" class="img-fluid rounded-circle"> </div>
                </div>
            `;
            contBusqueda.innerHTML = message;
        } else {
            let renderDoc = '';
            getData.forEach(info => {
                const anioActual = new Date().getFullYear();
                const edad = anioActual - parseInt(info.fechaNacimiento.split('T')[0].split('-')[0]);
                renderDoc += `<div class="col-md-3 mr-1 mb-1 col-sm-5 rounded shadow-sm bg-white d-flex justify-content-between p-2 align-items-center">
                                <img src="${info.rutaImg}" alt="doctor de ubimed" width="70px" class="rounded-circle">
                                <div class="w-75 d-flex justify-content-end text-muted flex-column align-items-end">
                                    <small class="text-right">${info.nombre} ${info.apellido}</small>
                                    <small class="text-right">${info.profesion}</small>
                                    <small class="text-right" style="font-size: .7em; word-break: keep-all;">${info.especialidad}</small>
                                    <small class="text-right">${edad} Años</small>
                                </div>
                            </div>`;
            });
            contBusqueda.innerHTML = renderDoc;
        }
    } else {
        renderInit();
    }
})

async function renderInit() {
    const datosDoc = await fetch('/buscar-limit');
    const jsonDoc = await datosDoc.json();
    let renderDoc = '';
    jsonDoc.forEach(info => {
        const anioActual = new Date().getFullYear();
        const edad = anioActual - parseInt(info.fechaNacimiento.split('T')[0].split('-')[0]);
        renderDoc += `<div class="col-md-3 mr-1 mb-1 col-sm-5 rounded shadow-sm bg-white d-flex justify-content-between p-2 align-items-center">
                        <img src="${info.rutaImg}" alt="doctor de ubimed" width="70px" class="rounded-circle">
                        <div class="w-75 d-flex justify-content-end text-muted flex-column align-items-end">
                            <small class="text-right">${info.nombre} ${info.apellido}</small>
                            <small class="text-right">${info.profesion}</small>
                            <small class="text-right" style="font-size: .7em; word-break: keep-all;">${info.especialidad}</small>
                            <small class="text-right">${edad} Años</small>
                        </div>
                    </div>`;
    });
    contBusqueda.innerHTML = renderDoc;
}