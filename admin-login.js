import { supabase } from './supabase.js'

const ADMIN_EMAIL = "admin@2026.com"

const form = document.getElementById("adminLoginForm")

form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  // 🔴 Block non-admin email BEFORE login
  if (email !== ADMIN_EMAIL) {
    alert("Access denied: Not an admin")
    return
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    alert("Login failed: " + error.message)
    return
  }

  alert("Admin login successful")

  // redirect to admin dashboard
  window.location.href = "adminregistration.html"
})