import { supabase } from './supabase.js'

async function loadResults() {

  try {

    // LOAD POSITIONS
    const { data: positions, error: positionError } = await supabase
      .from('position')
      .select('*')

    if (positionError) {
      console.error(positionError)
      return
    }

    console.log("Positions:", positions)

    const container = document.getElementById('results')

    container.innerHTML = ""

    // LOOP POSITIONS
    for (let pos of positions) {

      // LOAD CANDIDATES
      const { data: candidates, error: candidateError } = await supabase
        .from('candidate')
        .select('*')
        .eq('position_id', pos.id)

      if (candidateError) {
        console.error(candidateError)
        continue
      }

      console.log("Candidates:", candidates)

      let div = document.createElement('div')

      div.className = "card"

      div.innerHTML = `
        <h3>${pos.title}</h3>
      `

      // LOOP CANDIDATES
      for (let c of candidates) {

        // COUNT VOTES
        const { count, error: voteError } = await supabase
          .from('vote')
          .select('*', {
            count: 'exact',
            head: true
          })
          .eq('candidate_id', c.id)

        if (voteError) {
          console.error(voteError)
          continue
        }

        div.innerHTML += `
          <p>
            ${c.name} - 
            <b>${count || 0}</b> vote(s)
          </p>
        `
      }

      container.appendChild(div)
    }

  } catch (err) {

    console.error("Unexpected Error:", err)
  }
}

// LOAD IMMEDIATELY
loadResults()

// AUTO REFRESH EVERY 3 SECONDS
setInterval(loadResults, 3000000)