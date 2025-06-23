const API_URL = "http://localhost:5001/api";
const API_KEY = "12345ABCDEF";

// Headers comunes para todas las peticiones
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${API_KEY}`,
};

//servicio para conexiones con la api.

// Funciones de estudiantes

//registra un nuevo estudiante en el servidor (post)

async function registerStudentService(student) {
  const response = await fetch(`${API_URL}/students`, {
    method: "POST",
    headers,
    body: JSON.stringify(student),
  });
  return response.json();
}

//obtiene todos los estudiantes registrados en el servidor (get)


async function getStudentAllService() {
  const response = await fetch(`${API_URL}/students`, {
    method: "GET",
    headers,
  });
  return response.json();
}

//muestra a todos los estudiantes en una tabla en el HTML

async function getStudentAll() {
  try {
    const students = await getStudentAllService();
    console.log("Students fetched:", students); // Para verificar que vienen

    const tableBody = document.getElementById("studentTableBody");
    const title = document.getElementById("studentTitle");

    if (!tableBody || !title) {
      console.log("Table body or title element not found.");
      return;
    }

    if (!Array.isArray(students)) {
      tableBody.innerHTML = `<tr><td colspan="3">Error en el formato de datos</td></tr>`;
      title.textContent = "Lista de Estudiantes (0)";
      return;
    }

    if (students.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="3">No hay estudiantes registrados.</td></tr>`;
      title.textContent = "Lista de Estudiantes (0)";
      return;
    }

    title.textContent = `Lista de Estudiantes (${students.length})`;
    tableBody.innerHTML = students
      .map(
        (student) => `
        <tr>
          <td>${student.id}</td>
          <td>${student.name}</td>
          <td>${student.career}</td>
        </tr>
      `
      )
      .join("");
  } catch (error) {
    console.error("Error fetching students:", error);
    document.getElementById("studentTableBody").innerHTML = `
      <tr><td colspan="3">Error al cargar los estudiantes</td></tr>
    `;
    document.getElementById("studentTitle").textContent =
      "Lista de Estudiantes (0)";
  }
}

//obtiene estudiantes segun la carrera (get)

async function getStudentsByCareerService(career) {
  const response = await fetch(`${API_URL}/students/?career=${career}`, {
    method: "GET",
    headers,
  });
  return response.json();
}

//elimina a un estudiante por su id de la base de datos (delete)

async function deleteStudentService(id) {
  const response = await fetch(`${API_URL}/students/${id}`, {
    method: "DELETE",
    headers,
  });
  return response.json();
}

//registra un nuevo estudiante desde el formulario HTML

async function registerStudent() {
  const name = document.getElementById("registerName").value.trim();
  const career = document.getElementById("registerCareer").value.trim();
  const resultContainer = document.getElementById("registerResult");

  if (!name || !career) {

    Swal.fire({
      icon: "success",
      title: "¡Registro exitoso!",
      text: "El estudiante fue registrado correctamente.",
      confirmButtonText: "Aceptar"
    });

    return;
  }

  try {
    const result = await registerStudentService({ name, career });

    // Mostrar la respuesta de forma permanente
    resultContainer.innerHTML = `
            <strong>Registration Successful!</strong><br><br>
            <strong>ID:</strong> ${result.student.id}<br>
            <strong>Name:</strong> ${result.student.name}<br>
            <strong>Career:</strong> ${result.student.career}
        `;

    // Limpia los inputs
    document.getElementById("registerName").value = "";
    document.getElementById("registerCareer").value = "";

    Swal.fire({
      icon: "success",
      title: "¡Registro exitoso!",
      text: "El estudiante fue registrado correctamente.",
      confirmButtonText: "Aceptar"
    });

  } catch (error) {
    console.error("Error registering student:", error);
    resultContainer.textContent = "Failed to register student.";
  }
}

//obtiene un estudiante por su id y lo muestra en el HTML

async function getStudentById() {
  const id = document.getElementById("studentId").value.trim();
  const resultContainer = document.getElementById("getResult");

  if (!id) {
    Swal.fire({
      icon: "warning",
      title: "Campo vacío",
      text: "Por favor ingresa el ID del estudiante.",
      confirmButtonText: "Aceptar",
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
    return;
  }

  try {
    const student = await getStudentByIdService(id);
    resultContainer.innerHTML = `
      <strong>ID:</strong> ${student.id} <br>
      <strong>Nombre:</strong> ${student.name} <br>
      <strong>Carrera:</strong> ${student.career}
    `;

    Swal.fire({
      icon: "success",
      title: "Estudiante encontrado",
      text: `Detalles del estudiante con ID ${id} mostrados correctamente.`,
      confirmButtonText: "Aceptar",
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

  } catch (error) {
    resultContainer.textContent = error.message;

    Swal.fire({
      icon: "error",
      title: "Error",
      text: `No se encontró el estudiante con ID ${id}.`,
      confirmButtonText: "Aceptar",
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
  }
}


//filtra y muestra estudiantes por carrera en el HTML

async function getStudentsByCareer() {
  const career = document.getElementById("careerFilter").value.trim();
  const resultContainer = document.getElementById("careerResult");

  if (!career) {
    
    Swal.fire({
      icon: "warning",
      title: "Campo vacío",
      text: "Por favor ingresa una carrera para buscar.",
      confirmButtonText: "Aceptar",
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
    return;
  }

  try {
    const students = await getStudentsByCareerService(career);

    if (!students || students.length === 0) {
      resultContainer.textContent = "";
      Swal.fire({
        icon: "info",
        title: "No encontrado",
        text: `No se encontraron estudiantes para la carrera "${career}".`,
        confirmButtonText: "Aceptar",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      return;
    }

    // Limpiar resultados anteriores
    resultContainer.innerHTML = "";

    students.forEach((student) => {
      const studentDiv = document.createElement("div");
      studentDiv.classList.add("student-card");
      studentDiv.innerHTML = `
        <strong>ID:</strong> ${student.id}<br>
        <strong>Nombre:</strong> ${student.name}<br>
        <strong>Carrera:</strong> ${student.career}
      `;
      resultContainer.appendChild(studentDiv);

      const hr = document.createElement("hr");
      resultContainer.appendChild(hr);
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    resultContainer.textContent = "";
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error al buscar estudiantes, intenta de nuevo.",
      confirmButtonText: "Aceptar",
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
  }
}


//elimina un estudiante por su id desde el formulario HTML

async function deleteStudent() {
  const id = document.getElementById("deleteId").value.trim();

  if (!id) {
    Swal.fire({
      icon: "warning",
      title: "Campo vacío",
      text: "Por favor ingresa el ID del estudiante a borrar.",
      confirmButtonText: "Aceptar",
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
    return;
  }

  try {
    const result = await deleteStudentService(id);
    document.getElementById("deleteResult").textContent = JSON.stringify(
      result,
      null,
      2
    );

    Swal.fire({
      icon: "success",
      title: "Estudiante borrado",
      text: `El estudiante con ID ${id} fue borrado correctamente.`,
      confirmButtonText: "Aceptar",
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

  } catch (error) {
    console.error("Error deleting student:", error);
    document.getElementById("deleteResult").textContent =
      "Failed to delete student.";

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo borrar el estudiante. Intenta nuevamente.",
      confirmButtonText: "Aceptar",
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
  }
}


//Obtiene los datos de un estudiante a partir de su ID haciendo una solicitud GET a la API.


async function getStudentByIdService(id) {
  const response = await fetch(`${API_URL}/students/${id}`, {
    method: "GET",
    headers,
  });
  


  return response.json();
}

// ============================
//  Carreras
// ============================

//Envía una solicitud POST al endpoint /careers con el nombre de la carrera.





//Envía una lista de carreras al servidor mediante una solicitud POST.

async function verCarreras(carreras) {
  const response = await fetch(`${API_URL}/careers`, {
    method: "POST",
    headers,
    body: JSON.stringify({ carreras }),
  });
  return response.json();
}

//Elimina una carrera del sistema enviando una solicitud DELETE al servidor.

async function deleteCarrerService(id) {
  const response = await fetch(`${API_URL}/careers/${id}`, {
    method: "DELETE",
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    // Lanza un error si la respuesta no fue exitosa
    throw new Error(data.error || "Error al borrar la carrera.");
  }

  return data;
}


//Registra una nueva carrera en el sistema enviando los datos al servidor.

async function registerCarrerServicio(carrer) {
  const response = await fetch(`${API_URL}/careers`, {
    method: "POST",
    headers,
    body: JSON.stringify(carrer),
  });
  return response.json();
}

//obtiene los datos de una carrera espesifica usando su id

async function getCarrerByIdService(id) {
  const response = await fetch(`${API_URL}/careers/${id}`, {
    method: "GET",
    headers,
  });
  return response.json();
}

//obtiene todas las carreras registradas en la base de datos

async function getCarrerAllService() {
  const response = await fetch(`${API_URL}/careers`, {
    method: "GET",
    headers,
  });
  return response.json();
}

//Función encargada de registrar una nueva carrera desde el formulario de la interfaz.

async function registerCarrer() {
  const name = document.getElementById("careerName").value.trim();
  const resultContainer = document.getElementById("careerResult");

  if (!name) {
    Swal.fire({
      icon: "warning",
      title: "Campo vacío",
      text: "Por favor, seleccioná o ingresá una carrera.",
      confirmButtonText: "Aceptar",
      allowOutsideClick: false
    });
    return;
  }

  try {
    const result = await registerCarrerServicio({ name });

    // Mostrar resultado debajo
    resultContainer.innerHTML = `
      <strong>¡Carrera registrada exitosamente!</strong><br><br>
      <strong>Carrera:</strong> ${result.name}
    `;

    // Limpiar input
    document.getElementById("careerName").value = "";

    // Mostrar alerta SweetAlert
    Swal.fire({
      icon: "success",
      title: "¡Registro exitoso!",
      text: "La carrera fue registrada correctamente.",
      confirmButtonText: "Aceptar",
      allowOutsideClick: false
    });

    // Refrescar tabla si existe
    if (typeof getCarrerAll === "function") {
      getCarrerAll();
    }

  } catch (error) {
    console.error("Error registering careers:", error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Hubo un problema al registrar la carrera.",
      confirmButtonText: "Aceptar"
    });

    resultContainer.textContent = "Error al registrar la carrera.";
  }
}

//Función que obtiene una carrera por su ID desde el formulario de la interfaz


async function getCarrerById() {
  const id = document.getElementById("carrerId").value.trim();

  if (!id) {
    Swal.fire({
      icon: 'warning',
      title: 'Campo vacío',
      text: 'Por favor, ingresa un ID de carrera.'
    });
    return;
  }

  try {
    const carrer = await getCarrerByIdService(id);
    const resultContainer = document.getElementById("getResult");

    if (carrer.error) {
      Swal.fire({
        icon: 'error',
        title: 'No encontrado',
        text: carrer.error
      });
      resultContainer.textContent = '';
    } else {
      resultContainer.innerHTML = `
        <strong>ID:</strong> ${carrer.id}<br>
        <strong>Nombre:</strong> ${carrer.name}<br>
      `;
    }
  } catch (error) {
    console.error("Error fetching careers:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron obtener los datos de la carrera.'
    });
    document.getElementById("getResult").textContent = "";
  }
}



//Obtiene todas las carreras desde el servidor y actualiza la tabla en la interfaz.

async function getCarrerAll() {
  try {
    const carreras = await getCarrerAllService();

    const tableBody = document.getElementById("careerTableBody");
    const title = document.getElementById("careerTitle");

    if (!tableBody || !title) {
      console.log("Table body or title element not found.");
      return;
    }

    if (carreras.error) {
      tableBody.innerHTML = `<tr><td colspan="2">${carreras.error}</td></tr>`;
      title.textContent = "Lista de Carreras (0)";
    } else {
      // Actualizar título con la cantidad de carreras
      title.textContent = `Lista de Carreras (${carreras.length})`;

      // Generar filas
      tableBody.innerHTML = carreras
        .map(
          (carrera) => `
        <tr>
          <td>${carrera.id}</td>
          <td>${carrera.name}</td>
        </tr>
      `
        )
        .join("");
    }
  } catch (error) {
    console.error("Error fetching careers:", error);
    document.getElementById("careerTableBody").innerHTML = `
      <tr><td colspan="2">Error al cargar las carreras</td></tr>
    `;
    document.getElementById("careerTitle").textContent =
      "Lista de Carreras (0)";
  }
}

//Elimina una carrera utilizando su ID ingresado en el formulario.

async function deletCarrer() {
  const id = document.getElementById("deleteId").value.trim();

  if (!id) {
    Swal.fire({
      icon: 'warning',
      title: 'Campo vacío',
      text: 'Por favor, ingresa un ID de carrera para borrar.'
    });
    return;
  }

  try {
    const result = await deleteCarrerService(id);
    document.getElementById("deleteResult").textContent = JSON.stringify(result, null, 2);

    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Carrera eliminada con éxito.'
    });
  } catch (error) {
    console.error("Error borrando carrera:", error);
    document.getElementById("deleteResult").textContent = "No se pudo borrar la carrera.";

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error al borrar la carrera. Intenta de nuevo.'
    });
  }
}


// ============================
//  Categorias
// ============================


//Registra una nueva categoría en el sistema enviando los datos al servidor.

async function getCategoryAll() {
  try {
    const categories = await getCategoryAllService();
    console.log("Categories fetched:", categories); // Para verificar que vienen
    const tableBody = document.getElementById("categoriesTableBody");
    const title = document.getElementById("categoryTitle");

    if (!tableBody || !title) {
      console.log("Table body or title element not found.");
      return;
    }

    if (categories.error) {
      tableBody.innerHTML = `<tr><td colspan="2">${categories.error}</td></tr>`;
      title.textContent = "Lista de Categorias (0)";
    } else {
      // Actualizar título con la cantidad de categories
      title.textContent = `Lista de Categorias (${categories.length})`;

      // Generar filas
      tableBody.innerHTML = categories
        .map(
          (category) => `
        <tr>
          <td>${category.id}</td>
          <td>${category.name}</td>
        </tr>
      `
        )
        .join("");
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    document.getElementById("categoriesTableBody").innerHTML = `
      <tr><td colspan="2">Error al cargar las categorias</td></tr>
    `;
    document.getElementById("categoryTitle").textContent =
      "Lista de Categorias (0)";
  }
}

//Función para eliminar una categoría usando el ID proporcionado en el input "deleteId".

async function deleteCategory() {
  const id = document.getElementById("deleteId").value.trim();

  if (!id) {
    Swal.fire({
      icon: 'warning',
      title: 'Campo vacío',
      text: 'Por favor, ingresa un ID de categoría para eliminar.'
    });
    return;
  }

  try {
    const result = await deleteCategoryService(id);
    document.getElementById("deleteResult").textContent = JSON.stringify(result, null, 2);

    Swal.fire({
      icon: 'success',
      title: 'Eliminado',
      text: `Categoría con ID ${id} eliminada correctamente.`
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    document.getElementById("deleteResult").textContent = "Failed to delete category.";

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo eliminar la categoría.'
    });
  }
}


//Función que envía una solicitud POST para registrar una nueva categoría en el servidor

async function registerCategoryServicio(category) {
  const response = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers,
    body: JSON.stringify(category),
  });
  return response.json();
}

// Función para buscar una categoría por su ID usando el backend. 


async function getCategoryById() {
  const idInput = document.getElementById("categoryId");
  const resultContainer = document.getElementById("categoryQueryResult");
  const id = idInput.value.trim();

  if (!id) {
    Swal.fire({
      icon: 'warning',
      title: 'ID inválido',
      text: 'Por favor ingresa un ID válido.'
    });
    return;
  }

  try {
    const category = await getCategoryByIdService(id);

    resultContainer.textContent = `ID: ${category.id}\nCategoría: ${category.name}`;
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Categoría no encontrada.'
    });
    resultContainer.textContent = "Categoría no encontrada.";
  }
}

// Consulta una categoría por ID desde el backend


async function getCategoryByIdService(id) {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error(`Categoría con ID ${id} no encontrada`);
  }

  return response.json();
}

//Función que gestiona el registro de una nueva categoría desde el formulario en la interfaz.


async function registerCategory() {
  const nameInput = document.getElementById("categoryName");
  const resultContainer = document.getElementById("categoryResult");

  if (!nameInput) {
    console.error("No se encontró el input con id 'categoryName'.");
    return;
  }

  const name = nameInput.value.trim();

  if (!name) {
    Swal.fire({
      icon: 'warning',
      title: 'Campo vacío',
      text: 'Por favor, ingresa el nombre de la categoría.'
    });
    return;
  }

  try {
    const response = await registerCategoryServicio({ name });

    resultContainer.innerHTML = `
      <strong>¡Categoría registrada con éxito!</strong><br><br>
      <strong>Categoría:</strong> ${response.name}
    `;

    nameInput.value = ""; // Limpiar input

    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Categoría registrada con éxito.'
    });

    if (typeof getCategoryAll === "function") {
      getCategoryAll(); // refrescar tabla si existe
    }
  } catch (error) {
    if (error?.message?.includes("409")) {
      Swal.fire({
        icon: 'error',
        title: 'Conflicto',
        text: 'Ya existe una categoría con ese nombre.'
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al registrar la categoría.'
      });
    }

    console.error("Error registering category:", error);
    resultContainer.textContent = "Error al registrar la categoría.";
  }
}

//Función que realiza la eliminación de una categoría en el servidor.

async function deleteCategoryService(id) {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
    headers,
  });
  return response.json();
}

//Función que obtiene todas las categorías desde el servidor.

async function getCategoryAllService() {
  const response = await fetch(`${API_URL}/categories`, {
    method: "GET",
    headers,
  });
  return response.json();
}


//Evento de carga inicial

// Al cargar el DOM, ejecuta las funciones para obtener y mostrar:
// todas las carreras, categorías y estudiantes desde el servidor

//cargar carreras, categorías y estudiantes al cargar el documento.

document.addEventListener("DOMContentLoaded", async () => {

  await getCarrerAll();
  await getCategoryAll();
  await getStudentAll();
});



// funcion para cargar las carreras en el datalist en el formulario de registro de estudiantes.


async function loadCareerDatalist() {
  try {
    const carreras = await getCarrerAllService(); // función que ya tienes
    const datalist = document.getElementById("careerList");
    datalist.innerHTML = ""; // limpia opciones anteriores

    carreras.forEach(carrera => {
      const option = document.createElement("option");
      option.value = carrera.name;
      datalist.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading career options:", error);
  }
}


// Función para cargar las categorías en el datalist en carreras.




// Cuando el documento se ha cargado completamente, se ejecutan las funciones
// que llenan los <datalist> con las opciones disponibles de carreras y categorías.

document.addEventListener("DOMContentLoaded", () => {
  loadCareerDatalist();

});




// se ejecutan cuando el DOM esta completo


document.addEventListener("DOMContentLoaded", () => {
  getStudentAll(); // ahora sí se ejecuta cuando el DOM está completo
  getCarrerAll(); // ahora sí se ejecuta cuando el DOM está completo
  getCategoryAll(); // ahora sí se ejecuta cuando el DOM está completo

});