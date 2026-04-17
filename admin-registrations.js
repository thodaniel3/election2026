import { supabase } from './supabase.js'

const ADMIN_EMAIL = "admin@2026.com"

let studentsData = [] // ✅ FIXED

async function checkAdmin() {
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    window.location.href = "admin-login.html"
    return
  }

  if (data.user.email !== ADMIN_EMAIL) {
    alert("Unauthorized")
    await supabase.auth.signOut()
    window.location.href = "admin-login.html"
    return
  }

  loadStudents()
}

checkAdmin()

// 📊 LOAD STUDENTS
async function loadStudents() {
  const { data, error } = await supabase
    .from('students')
    .select('*') // ✅ safer

  if (error) {
    alert("Error loading data: " + error.message)
    console.error(error)
    return
  }

  studentsData = data || []

  document.getElementById("totalCount").innerText = studentsData.length

  const container = document.getElementById("studentsList")
  container.innerHTML = ""

  if (studentsData.length === 0) {
    container.innerHTML = "<p>No registered students yet</p>"
    return
  }

  studentsData.forEach((s, index) => {
    container.innerHTML += `
    <div class="card">

    <img 
      src="https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=0D8ABC&color=fff&size=100" 
      class="avatar"
    >

    <p><b>#${index + 1}</b></p>
    <p><b>Name:</b> ${s.name}</p>
    <p><b>Matric:</b> ${s.matric_no}</p>
    <p><b>Level:</b> ${s.level}</p>
  </div>
    `
  })
}

// 📥 DOWNLOAD CSV
window.downloadCSV = function () {

  if (studentsData.length === 0) {
    alert("No data to download")
    return
  }

  let csv = "Name,Matric Number,Level\n"

  studentsData.forEach(s => {
    csv += `${s.name},${s.matric_no},${s.level}\n`
  })

  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = "registered_students.csv"
  a.click()
}