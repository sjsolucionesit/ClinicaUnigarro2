const formUpdatePerfil = document.getElementById('formUpdatePerfil');
const btnUpdate = document.getElementById('btnMostrarPerfil');
let cond = 1;

async function mostrarPerfil(){
    if(cond){
        cond = 0;
        const inputsUpdate = document.querySelectorAll('.infoPerfilForm');
        btnUpdate.innerHTML = 'Cargando Perfil';
        const datosPatient = await fetch('/getInfoPatient');
        const info = await datosPatient.json();
        inputsUpdate[0].value = info.nombre;
        inputsUpdate[1].value = info.apellido;
        const tipoDoc = inputsUpdate[2].innerHTML;
        inputsUpdate[2].innerHTML = `<option value="${info.tipoDoc}">${info.tipoDoc}</option>` + tipoDoc;
        const fecha = info.fechaNacimiento.split('T')[0];
        const anio = fecha.split('-')[0];
        const mes = fecha.split('-')[1];
        const dia = fecha.split('-')[2];
        console.log(dia + '-' + mes + '-' + anio);
        inputsUpdate[3].value = dia + '/' + mes + '/' + anio;
        inputsUpdate[4].value = info.cedula;
        inputsUpdate[5].value = info.lugarNacimiento;
        const estadoCivil = inputsUpdate[6].innerHTML;
        inputsUpdate[6].innerHTML = `<option value="${info.estadoCivil}">${info.estadoCivil}</option>` + estadoCivil;
        const genero = inputsUpdate[7].innerHTML;
        inputsUpdate[7].innerHTML = `<option value="${info.genero}">${info.genero}</option>` + genero;
        const rh = inputsUpdate[8].innerHTML;
        inputsUpdate[8].innerHTML = `<option value="${info.rh}">${info.rh}</option>` + rh;
        inputsUpdate[9].value = info.telefono;
        inputsUpdate[10].value = info.direccion;
        inputsUpdate[11].value = info.pais;
        inputsUpdate[12].value = info.ciudad;
        btnUpdate.innerHTML = 'Cerrar Perfil';
        formUpdatePerfil.classList.remove('d-none');
    } else {
        cond = 1;
        btnUpdate.innerHTML = 'Editar Perfil';
        formUpdatePerfil.classList.add('d-none');
    }
}