import { supabase } from './supabase.js'

async function loadResults() {
  const { data: positions } = await supabase.from('positions').select('*')

  const container = document.getElementById('results')
  container.innerHTML = ""

  for (let pos of positions) {

    const { data: candidates } = await supabase
      .from('candidates')
      .select('*')
      .eq('position_id', pos.id)

    let div = document.createElement('div')
    div.className = "card"
    div.innerHTML = `<h3>${pos.title}</h3>`

    for (let c of candidates) {
      const { count } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('candidate_id', c.id)

      div.innerHTML += `<p>${c.name} - <b>${count}</b> votes</p>`
    }

    container.appendChild(div)
  }
}

// Auto refresh every 3 seconds
setInterval(loadResults, 3000000)

loadResults()