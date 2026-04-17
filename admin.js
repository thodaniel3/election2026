import { supabase } from './supabase.js'

const ADMIN_EMAIL = "adminelection@2026"

// ==========================
// 🔐 AUTH + ADMIN CHECK
// ==========================
async function checkAdmin() {
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    // Not logged in
    alert("Please login first")
    window.location.href = "login.html"
    return
  }

  const user = data.user

  // 🔴 Check admin email
  if (user.email !== ADMIN_EMAIL) {
    alert("Unauthorized access")
    await supabase.auth.signOut()
    window.location.href = "login.html"
    return
  }

  // ✅ If admin → load dashboard
  loadVotes()
}

// Run immediately when page loads
checkAdmin()

// ==========================
// ➕ ADD POSITION
// ==========================
window.addPosition = async function () {
  const title = document.getElementById('positionTitle').value.trim()

  if (!title) {
    alert("Enter position title")
    return
  }

  const { error } = await supabase.from('positions').insert({ title })

  if (error) {
    alert("Error: " + error.message)
  } else {
    alert("Position added successfully")
    document.getElementById('positionTitle').value = ""
  }
}

// ==========================
// ➕ ADD CANDIDATE
// ==========================
window.addCandidate = async function () {
  const name = document.getElementById('candidateName').value.trim()
  const position_id = document.getElementById('positionId').value.trim()

  if (!name || !position_id) {
    alert("Fill all fields")
    return
  }

  const { error } = await supabase
    .from('candidates')
    .insert({ name, position_id })

  if (error) {
    alert("Error: " + error.message)
  } else {
    alert("Candidate added successfully")
    document.getElementById('candidateName').value = ""
    document.getElementById('positionId').value = ""
  }
}

// ==========================
// 📊 LOAD VOTES (IMPROVED)
// ==========================
async function loadVotes() {
  const { data, error } = await supabase
    .from('votes')
    .select(`
      id,
      user_id,
      position_id,
      candidate_id,
      created_at
    `)

  if (error) {
    console.error(error)
    return
  }

  const div = document.getElementById('votes')
  div.innerHTML = ""

  if (!data || data.length === 0) {
    div.innerHTML = "<p>No votes yet</p>"
    return
  }

  data.forEach(v => {
    div.innerHTML += `
      <div class="card">
        <p><b>User:</b> ${v.user_id}</p>
        <p><b>Candidate:</b> ${v.candidate_id}</p>
        <p><b>Position:</b> ${v.position_id}</p>
        <p><small>${new Date(v.created_at).toLocaleString()}</small></p>
      </div>
    `
  })
}