const eps = document.getElementById('eps');
const prepagada = document.getElementById('prepagada');
const particular = document.getElementById('particular');

const radioEps = document.getElementById('activateEps');
const radioPrepa = document.getElementById('activatePre');
const radioPar = document.getElementById('activatePar');

const btnEps = document.getElementById('btnEps');
const btnPre = document.getElementById('btnPre');
const btnPar = document.getElementById('btnPar');

const formEps = document.getElementById('formEps');
const formPar = document.getElementById('formPar');
const formPre = document.getElementById('formPre');

const tipoOcupacion = document.getElementById('tipoOcupacion');
const descOcupacion = document.getElementById('descOcupacion');

const handleSalud = document.getElementById('handleSalud');
const handleOcupacion = document.getElementById('handleOcupacion');

const leyendaSalud = document.getElementById('leyendaSalud');
const leyendaOcupacion = document.getElementById('leyendaOcupacion');
const btnOcupacion = document.getElementById('btnOcupacion');

const inputAlergia = document.getElementById('inputAlergia');

const saveAlergias = document.getElementById('saveAlergias');
const handleAlergias = document.getElementById('handleAlergias');

const viewAlergias = document.getElementById('viewAlergias');
const btnSaveAntecedentes = document.getElementById('btnSaveAntecedentes');

window.addEventListener('load', async() => {

    verificarSalud();
    verificarOcupacion();
    verificarAlergias();

    const listaEps = await getDataEps();
    autocomplete(eps, listaEps);

    btnEps.disabled = true;
    btnPre.disabled = true;
    btnPar.disabled = true;
    btnOcupacion.disabled = true;
    saveAlergias.disabled = true;

    eps.addEventListener('input', () => {
        if (eps.value.length >= 2) {
            btnEps.disabled = false;
        } else {
            btnEps.disabled = true;
        }
    });

    particular.addEventListener('input', () => {
        if (particular.value.length >= 2) {
            btnPar.disabled = false;
        } else {
            btnPar.disabled = true;
        }
    });

    prepagada.addEventListener('input', () => {
        if (prepagada.value.length >= 2) {
            btnPre.disabled = false;
        } else {
            btnPre.disabled = true;
        }
    });

    descOcupacion.addEventListener('input', () => {
        if (descOcupacion.value.length >= 2) {
            btnOcupacion.disabled = false;
        } else {
            btnOcupacion.disabled = true;
        }
    });

    validador.addEventListener('input', () => {
        if (validador.value.length >= 2) {
            saveAlergias.disabled = false;
        } else {
            saveAlergias.disabled = true;
        }
    });

    btnEps.addEventListener('click',
        e => {
            e.preventDefault();
            guardarSalud('eps', eps.value);
        }
    );
    btnPre.addEventListener('click',
        e => {
            e.preventDefault();
            guardarSalud('prepagada', prepagada.value);
        }
    );
    btnPar.addEventListener('click',
        e => {
            e.preventDefault();
            guardarSalud('particular', particular.value);
        }
    );
    btnOcupacion.addEventListener('click', e => {
        e.preventDefault();
        guardarOcupacion(tipoOcupacion.value, descOcupacion.value);
    });
    radioEps.addEventListener('click', () => {
        formPar.classList.add('d-none');
        formPre.classList.add('d-none');
        formEps.classList.remove('d-none');
    });

    radioPrepa.addEventListener('click', () => {
        formEps.classList.add('d-none');
        formPar.classList.add('d-none');
        formPre.classList.remove('d-none');
    });

    radioPar.addEventListener('click', () => {
        formPre.classList.add('d-none');
        formEps.classList.add('d-none');
        formPar.classList.remove('d-none');
    });

})



async function getDataEps() {
    let eps = [];
    const consultaEps = await fetch('/consultar-eps');
    const listaEps = await consultaEps.json();
    listaEps.forEach(item => {
        eps.push(item.eps);
    });
    return eps;
}

function autocomplete(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                b = document.createElement("DIV");
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function(e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) { //up
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    document.addEventListener("click", function(e) {
        closeAllLists(e.target);
    });
}

async function guardarSalud(tipo, nombre) {
    const datosSalud = {
        tipoSalud: tipo,
        servicio: nombre
    }
    const peticion = await fetch(`/services-salud`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosSalud)
    });
    const respuesta = await peticion.json();
    if (respuesta.status == 'ok') {
        handleSalud.classList.add('d-none');
        verificarSalud();
    }
}

async function verificarSalud() {
    const consulta = await fetch('/consultar-salud');
    const resultado = await consulta.json();
    if (JSON.stringify(resultado) != '{}') {
        handleSalud.classList.add('d-none');
        leyendaSalud.innerHTML = `Tu servicio de salud es de tipo ${resultado.tipoSalud}, su nombre es ${resultado.servicio} <button class="btn"><i class="fas fa-edit " onclick="actualizarSalud()" style="color: #41E296"></i></button>`;
        leyendaSalud.classList.remove('text-muted');
    }
}

function actualizarSalud() {
    handleSalud.classList.remove('d-none');
}

async function guardarOcupacion(tipo, desc) {
    const datosOcupacion = {
        ocupacion: tipo,
        descripcion: desc
    }
    const peticion = await fetch(`/services-ocupacion`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosOcupacion)
    });
    const respuesta = await peticion.json();
    if (respuesta.status == 'ok') {
        handleOcupacion.classList.add('d-none');
        verificarOcupacion();
    }
}

async function verificarOcupacion() {
    const consulta = await fetch('/consultar-ocupacion');
    const resultado = await consulta.json();
    if (JSON.stringify(resultado) != '{}') {
        handleOcupacion.classList.add('d-none');
        leyendaOcupacion.innerHTML = `Tu ocupación es de tipo ${resultado.ocupacion}, Descripción: ${resultado.descripcion} <button class="btn"><i class="fas fa-edit " onclick="actualizarOcupacion()" style="color: #41E296"></i></button>`;
        leyendaOcupacion.classList.remove('text-muted');
    }
}

function actualizarOcupacion() {
    handleOcupacion.classList.remove('d-none');
}

function addAlergia() {
    const contInput = document.createElement('div');
    contInput.classList.add('w-100');
    contInput.classList.add('mt-2');
    contInput.innerHTML = '<input type="text" class="form-control casillaAlergia" placeholder="Alergia descripción">';
    inputAlergia.appendChild(contInput);
}

async function guardarAlergias() {
    viewAlergias.innerHTML = '';
    let alergiaslista = '';
    const casillaAlergia = document.querySelectorAll('.casillaAlergia');
    casillaAlergia.forEach(item => {
        if (item.value.length >= 1) {
            alergiaslista += item.value + '-*-';
        }
    });
    const listaAlergias = {
        list: alergiaslista
    }
    handleAlergias.classList.add('d-none');
    await fetch(`/services-alergias`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(listaAlergias)
    });
    await verificarAlergias()
}

async function verificarAlergias() {
    const alergias = await fetch('/consultar-alergias');
    const resultado = await alergias.json();
    const ul = document.createElement('ul');
    ul.classList.add('list-group');
    if (JSON.stringify(resultado) != '{}') {
        resultado.forEach(alergia => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.classList.add('list-group-item-danger');
            li.classList.add('d-flex');
            li.classList.add('justify-content-between');
            li.classList.add('align-items-center');
            li.classList.add('borrarAlergia');
            const button = document.createElement('button');
            button.classList.add('btn');
            const nameAlergia = document.createElement('p');
            nameAlergia.classList.add('m-0')
            nameAlergia.innerText = alergia.descripcion;
            button.innerHTML = `<i onclick="deleteAlergia('${alergia.id}', '${alergia.descripcion}')" class="fas fa-trash-alt"></i>`;
            li.appendChild(nameAlergia);
            li.appendChild(button);
            ul.appendChild(li);
        });
    }
    viewAlergias.appendChild(ul);
}

async function deleteAlergia(id, descripcion) {
    const descicionBorrar = confirm(`Estas seguro que deseas eliminar tu alergia sobre ${descripcion}, estos datos son solo para uso de los especialistas de la salud que cuidan de ti!`);
    viewAlergias.innerHTML = '';
    if (descicionBorrar) {
        //si
        const borrar = {
            id,
            descripcion
        }

        const updateAlergias = await fetch(`/consultar-alergias/${borrar.id}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(borrar)
        });

        verificarAlergias();
    }
}

btnSaveAntecedentes.disabled = true;
const inputAntecedentes = document.getElementById('inputAntecedentes');

inputAntecedentes.addEventListener('input', ()=>{
    if(inputAntecedentes.value.length >= 3){
        btnSaveAntecedentes.disabled = false;
    } else {
        btnSaveAntecedentes.disabled = true;
    }
});

function addAntecedentes(){
    const contInputs = document.getElementById('contInputs');
    const input = document.createElement('input');
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "Descripcion");
    input.classList.add('form-control');
    input.classList.add('antecedentesOtros');
    input.classList.add('mt-2');
    contInputs.appendChild(input);
}

async function saveAntecedentes(){
    const inputAntecedentes = document.querySelectorAll('.antecedentesOtros');
    let datos = '';
    inputAntecedentes.forEach(item => {
        if(item.value.length >= 2){
            datos += item.value + '*-*-*-*';
        }
    });

    const enviar = {
        ante: datos
    }

    const saveDatos = await fetch('/antecedentes-pacientes', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(enviar)
    });
    const respuesta = await saveDatos.json();
    renderAnte()
}

renderAnte();

async function renderAnte(){
    document.getElementById('contAntecedentes').innerHTML = '';
    const estado = await fetch('/solicitar-antecedentes');
    const respuesta = await estado.json();
    if(typeof respuesta.accept == 'undefined'){
        respuesta.forEach(item => {
            document.getElementById('contAntecedentes').innerHTML += `
                                            <div class="alert alert-primary mt-1 mx-0 mb-0 d-flex justify-content-between align-items-center" role="alert">
                                                <small>Antecedente: ${item.antecedentes}</small>
                                                <button class="btn" onclick="eliminarAntecedente('${item.id}')"><i class="fas fa-trash"></i></button>
                                            </div>
                                            `;
            
        });
    }
}

async function eliminarAntecedente(id){
    const choose = confirm('Estas seguro que deseas eliminar este antecedente');
    if(choose){
        const eliminar = await fetch(`/eliminar-antecedente/${id}`);
        const respuesta = await eliminar.json();
        if(respuesta.accept == 'ok'){
            renderAnte();
        }
    } 
}