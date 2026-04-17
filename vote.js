import { supabase } from './supabase.js'

let votes = {}

async function checkUser() {

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    window.location.href = "login.html"
    return
  }

  const { data: student } = await supabase
    .from('students')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!student) {
    alert("You are not registered to vote")
    await supabase.auth.signOut()
    window.location.href = "login.html"
    return
  }

  loadPositions()
}

checkUser()

async function loadPositions() {

  const { data: positions } = await supabase.from('positions').select('*')

  const container = document.getElementById("positions")
  container.innerHTML = ""

  for (let pos of positions) {

    const { data: candidates } = await supabase
      .from('candidates')
      .select('*')
      .eq('position_id', pos.id)

    let html = `
      <div class="position" id="pos-${pos.id}">
        <h3>${pos.title}</h3>
        <div class="candidates">
    `

    candidates.forEach(c => {
      html += `
        <div class="candidate" 
          id="cand-${c.id}" 
          onclick="vote('${pos.id}', '${c.id}')">

          <img src="${c.image || 'image/image.png'}">
          <p>${c.name}</p>

        </div>
      `
    })

    html += `</div></div>`

    container.innerHTML += html
  }
}

// ✅ FIXED SELECTION LOGIC
window.vote = function(position_id, candidate_id) {

  votes[position_id] = candidate_id

  const positionDiv = document.getElementById(`pos-${position_id}`)

  positionDiv.querySelectorAll('.candidate').forEach(c => {
    c.classList.remove('selected')
  })

  const selected = document.getElementById(`cand-${candidate_id}`)
  if (selected) {
    selected.classList.add('selected')
  }
}

window.submitVotes = async function () {

  const { data } = await supabase.auth.getUser()
  const user = data.user

  if (!user) {
    alert("Session expired")
    window.location.href = "login.html"
    return
  }

  for (let position_id in votes) {

    const candidate_id = votes[position_id]

    const { error } = await supabase
      .from('votes')
      .insert([
        {
          user_id: user.id,
          position_id,
          candidate_id
        }
      ])

    if (error) {
      alert("Error: " + error.message)
      return
    }
  }

  alert("Votes submitted successfully!")
  window.location.href = "results.html"
}