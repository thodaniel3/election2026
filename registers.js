import { supabase } from './supabase.js'

const form = document.getElementById("registerForm")

if (!form) {
  alert("Form not found. Check your form ID.")
}

const button = form.querySelector("button")

form.addEventListener("submit", async (e) => {
  e.preventDefault()

  button.disabled = true
  button.innerText = "Registering..."

  const name = document.getElementById("name").value
  const matric = document.getElementById("matric").value
  const email = document.getElementById("email").value
  const level = document.getElementById("level").value
  const password = document.getElementById("password").value

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      throw error
    }

    const user = data.user

    if (!user) {
      alert("Check your email to confirm your account.")
      button.disabled = false
      button.innerText = "Register"
      return
    }

    const { error: insertError } = await supabase
      .from("students")
      .insert([
        {
          id: user.id,
          name,
          matric_no: matric,
          level
        }
      ])

    if (insertError) {
      throw insertError
    }

    alert("Registration successful!")
    window.location.href = "successpage.html"

  } catch (err) {
    alert("Error: " + err.message)
    console.error(err)

    button.disabled = false
    button.innerText = "Register"
  }
})