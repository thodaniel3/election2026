import { supabase } from './supabase.js'

const form = document.getElementById('loginForm')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  // ✅ Correct way to get input values
  const emailInput = document.getElementById('email')
  const passwordInput = document.getElementById('password')

  const email = emailInput.value
  const password = passwordInput.value

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    alert("Login failed: " + error.message)
    return
  }

  alert("Login successful!")

  // optional: store session info
  localStorage.setItem("user", JSON.stringify(data.user))

  window.location.href = "logins.html"
})