
console.log("JS is working");
import { supabase } from './supabaseClient.js';

const container = document.getElementById("studentsContainer");

// Order of levels (adjust if your DB values differ)
const levelsOrder = ["100", "200", "300", "400A", "400B"];

async function fetchStudents() {
  try {
    const { data, error } = await supabase
      .from("students_with_email")
      .select("*")
      .order("level", { ascending: true });

    if (error) {
      console.error("Fetch error:", error.message);
      container.innerHTML = "<p style='color:red;'>Failed to load students.</p>";
      return;
    }

    if (!data || data.length === 0) {
      container.innerHTML = "<p>No students found.</p>";
      return;
    }

    renderStudents(data);

  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

function renderStudents(students) {
  container.innerHTML = "";

  levelsOrder.forEach(level => {
    const filtered = students.filter(s => 
      s.level && s.level.toLowerCase().includes(level.toLowerCase())
    );

    if (filtered.length === 0) return;

    const section = document.createElement("div");
    section.classList.add("level-section");

    section.innerHTML = `
      <div class="level-title">${level} Level</div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Matric No</th>
            <th>Level</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map(student => `
            <tr>
              <td>${student.name || "-"}</td>
              <td>${student.email || "-"}</td>
              <td>${student.matric_no || "-"}</td>
              <td>${student.level || "-"}</td>
              <td>
                <button class="delete-btn" data-id="${student.id}">
                  Delete
                </button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;

    container.appendChild(section);
  });

  attachDeleteEvents();
}

function attachDeleteEvents() {
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");

      const confirmDelete = confirm("Are you sure you want to delete this student?");
      if (!confirmDelete) return;

      const { error } = await supabase
        .from("students")
        .delete()
        .eq("id", id);

      if (error) {
        alert("Delete failed: " + error.message);
      } else {
        alert("Student deleted successfully");
        fetchStudents();
      }
    });
  });
}

// Load on page start
fetchStudents();