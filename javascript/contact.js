document.getElementById('contactForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    try {
        const res = await fetch('https://reshopapi.onrender.com/api/submit-contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                message
            })
        });

        if (res.ok) {
            alert('Message sent successfully');
        } else {
            alert('Failed to send message');
        }
    } catch (error) {
        alert('Failed to send message');
    }
});