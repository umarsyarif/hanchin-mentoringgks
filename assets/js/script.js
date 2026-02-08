/**
 * Meta Pixel Tracking Enhancement
 * Hashes email with SHA256 and stores in cookie for better tracking quality
 */

// SHA256 hash function
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Set cookie with specified name, value, and expiry days
function setCookie(name, value, days = 90) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-submit');

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Get form values
            const nama = document.getElementById('fullname').value.trim();
            const email = document.getElementById('email').value.trim().toLowerCase();
            const wa = document.getElementById('whatsapp').value.trim();

            // Hash email and store in cookie
            const hashedEmail = await sha256(email);
            setCookie('em', hashedEmail);
            // Build WhatsApp redirect URL with form values
            const waText = `Halo admin saya mau daftar Mentoring GKS\n\nNama: ${nama}\nEmail: ${email}\nNo. WA: ${wa}`;
            const encodedText = encodeURIComponent(waText);
            const whatsappUrl = `https://api.whatsapp.com/send?phone=821021824790&text=${encodedText}`;

            // Redirect to WhatsApp
            window.location.href = whatsappUrl;
        });
    }
});
