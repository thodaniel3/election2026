// 🔑 Replace with your Supabase credentials
const SUPABASE_URL = "https://okxnnbryvxsdpadlhlos.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9reG5uYnJ5dnhzZHBhZGxobG9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMzA4NDIsImV4cCI6MjA5MTkwNjg0Mn0.zcpScxFict36y_NQLCtLvmk78W-Tneou59p_IwXfixk";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById("resetForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;

    message.style.color = "black";
    message.textContent = "Sending reset link...";

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:3000/update-password.html"
    });

    if (error) {
        message.style.color = "red";
        message.textContent = error.message;
    } else {
        message.style.color = "green";
        message.textContent = "Password reset link sent! Check your email.";
    }
});