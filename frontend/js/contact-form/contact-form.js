import { sendData } from "./contact-form-api.js";

const form = document.getElementById("contact-form");
const submitBtn = form.querySelector('button[type="submit"]');
const endpoint = "http://localhost:8787/api/contact";

function validateForm(form) {
  if (!form.checkValidity()) {
    form.reportValidity();
    return false;
  }
  return true;
}

function getFormData(form) {
  const formData = new FormData(form);
  return {
    name: formData.get("name").trim(),
    email: formData.get("email").trim(),
    message: formData.get("message").trim(),
    company: formData.get("company") || "",
  };
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.textContent = isLoading ? "Sending..." : "Send";
}

function setSuccess() {
  submitBtn.textContent = "Message Sent!";
}

function setError() {
  submitBtn.textContent = "Error ❌";
}

function resetButton() {
  submitBtn.disabled = false;
  submitBtn.textContent = "Send";
}

form.addEventListener("submit", handleSubmit);

async function handleSubmit(e) {
  e.preventDefault();

  if (submitBtn.disabled) return;

  if (!validateForm(form)) return;

  const data = getFormData(form);
  console.log(data);
  setLoading(true);

  try {
    // simulación de envío
    await sendData(endpoint, data);

    setSuccess(); // muestra mensaje de éxito

    form.reset(); // limpia el formulario
  } catch (err) {
    console.error(err);
    setError();
  } finally {
    setTimeout(resetButton, 2000);
  }
}
