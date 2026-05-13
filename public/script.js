const modal = document.getElementById('responseModal');
const responseEl = document.getElementById('message');
const submitBtn = document.getElementById('submit');
const closeBtn = document.getElementById('closeBtn'); 
const escalateBtn = document.getElementById('escalateBtn');

// Open modal and show solution
function openResponseModal(event) {
    document.getElementById('responseModal').style.display = 'flex';
    const response = event.target.getAttribute('data-response');
    responseEl.textContent = response;      

}

// Close modal
closeBtn.addEventListener('click', () => {
    document.getElementById('responseModal').style.display = 'none';
});

document.querySelector('#userForm form').addEventListener('submit', async (event) => {

    event.preventDefault();

    const query = document.getElementById('query').value;

    const res = await fetch('/getResponse', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
    });

    const data = await res.json();

    document.getElementById('message').textContent = data.response;

    document.getElementById('responseModal').style.display = 'flex';
});