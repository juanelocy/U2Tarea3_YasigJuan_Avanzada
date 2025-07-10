document.getElementById('form-registro').addEventListener('submit', async function (e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const edad = parseInt(document.getElementById('edad').value);
  const descripcion = document.getElementById('descripcion').value.trim();
  const password = document.getElementById('password').value;
  const confirm_password = document.getElementById('confirm_password').value;
  const producto = document.getElementById('producto').value.trim();
  const categoria = document.getElementById('categoria').value;

  let errores = [];

  // Validaciones JavaScript
  if (!/^[A-Z]/.test(password) || !/\d/.test(password)) {
    errores.push("La contraseña debe tener al menos una letra mayúscula y un número.");
  }
  if (password !== confirm_password) {
    errores.push("Las contraseñas no coinciden.");
  }

  if (errores.length > 0) {
    mostrarModal('Errores de validación', generarListaErrores(errores), 'danger');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, correo, edad, descripcion, password, confirm_password, producto, categoria })
    });

    const data = await res.json();
    if (!res.ok) {
      mostrarModal('Error en el registro', generarListaErrores(data.errores), 'danger');
    } else {
      mostrarModal('Éxito', '<p>Registro exitoso</p>', 'success');
      document.getElementById('form-registro').reset();
    }
  } catch (err) {
    mostrarModal('Error del servidor', '<p>Hubo un problema al conectar con el servidor.</p>', 'danger');
  }
});

// Función para mostrar la modal
function mostrarModal(titulo, mensajeHTML, tipo = 'info') {
  document.getElementById('modalMensajeLabel').textContent = titulo;
  document.getElementById('modalMensajeBody').innerHTML = `
    <div class="alert alert-${tipo}" role="alert">
      ${mensajeHTML}
    </div>
  `;
  const modal = new bootstrap.Modal(document.getElementById('modalMensaje'));
  modal.show();
}

// Función auxiliar para mostrar listas de errores
function generarListaErrores(errores) {
  return `<ul>${errores.map(err => `<li>${err}</li>`).join('')}</ul>`;
}
