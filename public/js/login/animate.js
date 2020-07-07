const contInfo = document.getElementById('contInfo');
const createUserBtn = document.getElementById('createUserBtn');

const emailCreate = document.getElementById('emailCreate');
const pass = document.getElementById('pass');
const confirmPass = document.getElementById('confirmPass');
const alertPass = document.getElementById('alertPass');
const successPass = document.getElementById('successPass');
const acceptTC = document.getElementById('acceptTC');

const formPac = document.getElementById('formPac');

const emailUser = document.getElementById('emailUser');
const passUser = document.getElementById('passUser');
const emailDoc = document.getElementById('emailDoc');
const passDoc = document.getElementById('passDoc');

const selectPac = document.getElementById('selectPac');
const selectDoc = document.getElementById('selectDoc');
const formPaciente = document.getElementById('formPaciente');
const formDoctor = document.getElementById('formDoctor');

contInfo.classList.remove('moverDerecha');

window.addEventListener('load', () => {
    createUserBtn.disabled = true;
});

createUserBtn.addEventListener('click', (event) => {
    event.preventDefault();
});

emailCreate.addEventListener('input', () => {
    if (emailCreate.value.length > 0 && pass.value.length > 0 && confirmPass.value.length > 0) {
        confirmPassword(pass.value, confirmPass.value, emailCreate.value);
    } else {
        createUserBtn.disabled = true;
        successPass.classList.add('d-none');
        alertPass.classList.add('d-none');
    }
});

pass.addEventListener('input', () => {
    if (emailCreate.value.length > 0 && pass.value.length > 0 && confirmPass.value.length > 0) {
        confirmPassword(pass.value, confirmPass.value, emailCreate.value);
    } else {
        createUserBtn.disabled = true;
        successPass.classList.add('d-none');
        alertPass.classList.add('d-none');
    }
});

confirmPass.addEventListener('input', () => {
    if (emailCreate.value.length > 0 && pass.value.length > 0 && confirmPass.value.length > 0) {
        confirmPassword(pass.value, confirmPass.value, emailCreate.value);
    } else {
        createUserBtn.disabled = true;
        successPass.classList.add('d-none');
        alertPass.classList.add('d-none');
    }
});

createUserBtn.addEventListener('click', (event) => {
    dataCreateUser(event);
});

selectPac.addEventListener('click', () => {
    formPaciente.submit();
})

selectDoc.addEventListener('click', () => {
    formDoctor.submit();
})

function confirmPassword(pass1, pass2, emailValue) {
    const emailValidate = document.getElementById('emailValidate');
    emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    if (emailRegex.test(emailValue)) {
        emailValidate.classList.add('d-none');
        if (pass1.length == pass2.length) {
            if (pass1 == pass2) {
                createUserBtn.disabled = false;
                successPass.classList.remove('d-none');
                alertPass.classList.add('d-none');
            } else {
                createUserBtn.disabled = true;
                successPass.classList.add('d-none');
                alertPass.classList.remove('d-none');
            }
        } else {
            successPass.classList.add('d-none');
            alertPass.classList.remove('d-none');
        }
    } else {
        console.log('correo no valido');
        emailValidate.classList.remove('d-none');
    }
}

function dataCreateUser(e) {
    e.preventDefault();
    if (!acceptTC.checked) {
        alert('Acepta los términos y condiciones.')
    } else {
        contInfo.classList.add('moverDerecha');
        const datosUser = {
            email: emailCreate.value,
            pass: pass.value
        }
        addInputs(datosUser);
    }
}

function addInputs(info) {
    emailUser.value = info.email;
    passUser.value = info.pass;
    emailDoc.value = info.email;
    passDoc.value = info.pass;
}

function mostrarRecuperacion() {
    const recuperate = document.getElementById('recuperate');
    recuperate.classList.remove('d-none');
}


const changeEma = document.getElementById('changeEma');
const emailRecuperateLenged3 = document.getElementById('emailRecuperateLenged3');
const emailRecuperateLenged4 = document.getElementById('emailRecuperateLenged4');

const btnRecuperar = document.getElementById('btnRecuperar');
btnRecuperar.addEventListener('click', async(event) => {
    event.preventDefault();
    event.stopPropagation();
    const emailRecuperateLenged = document.getElementById('emailRecuperateLenged');
    const emailArecupar = document.getElementById('emailArecupar');
    const emailRecuperateLenged2 = document.getElementById('emailRecuperateLenged2');
    const btnOlvidasteTuContraseña = document.getElementById('btnOlvidasteTuContraseña');
    const changePass = document.getElementById('changePass');

    emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    if (emailRegex.test(emailArecupar.value)) {
        const datosSend = {
            email: emailArecupar.value
        }
        emailRecuperateLenged.classList.add('d-none');
        btnRecuperar.innerText = 'Buscando';
        btnRecuperar.disabled = true;
        const dataEmail = await fetch('/recuperar-correo', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosSend)
        });
        const respuesta = await dataEmail.json();
        console.table(respuesta);
        if (JSON.stringify(respuesta) != '{}') {
            emailRecuperateLenged2.classList.add('d-none');
            emailRecuperateLenged3.classList.remove('d-none');
            changeEma.value = emailArecupar.value;
            btnRecuperar.classList.add('d-none');
            recuperate.classList.add('d-none');
            btnOlvidasteTuContraseña.classList.add('d-none');
            changePass.classList.remove('d-none');
        } else {
            emailRecuperateLenged2.classList.remove('d-none');
            btnRecuperar.innerText = 'Recuperar Contraseña';
            btnRecuperar.disabled = false;
        }

    } else {
        emailRecuperateLenged.classList.remove('d-none');
    }
});

const ressPass = document.getElementById('ressPass');
const pinInp = document.getElementById('pinInp');
const newPass = document.getElementById('newPass');
const newPass2 = document.getElementById('newPass2');
ressPass.disabled = true;

pinInp.addEventListener('input', () => {
    validarBtnSendNewPass();
})

newPass.addEventListener('input', () => {
    validarBtnSendNewPass();
})

newPass2.addEventListener('input', () => {
    validarBtnSendNewPass();
})

ressPass.addEventListener('click', async(event) => {
    event.preventDefault();
    event.stopPropagation();
    const pinInput = pinInp.value;
    const email = changeEma.value;
    const pass = newPass.value;
    const datosVerify = {
        pin: pinInput,
        email
    }
    const getVerify = await fetch('/verificar-pin', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosVerify)
    });
    const resultadoVerify = await getVerify.json();
    if (JSON.stringify(resultadoVerify) != '{}') {
        const changePass = {
            email,
            password1: pass
        }
        const setPass = await fetch('/change-pass', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(changePass)
        });
        const res = await setPass.json();
        if (res.status == 'ok') {
            location.href = '/inicio';
        }
    } else {
        emailRecuperateLenged3.classList.add('d-none');
        emailRecuperateLenged4.classList.remove('d-none');
    }
});


async function validarBtnSendNewPass() {
    if (pinInp.value.length == '6') {
        if (newPass.value.length > 1) {
            if (newPass.value == newPass2.value) {
                ressPass.disabled = false;
            } else {
                ressPass.disabled = true;
            }
        } else {
            ressPass.disabled = true;
        }
    } else {
        ressPass.disabled = true;
    }
}