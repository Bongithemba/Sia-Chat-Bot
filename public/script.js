// function closeModal(){
//     document.getElementById('responseModal').style.display = 'none';
// }

// function openResponseModal(){
//     //get user input
//     let sentence = document.getElementById('enquiry').value;

//     document.getElementById('responseModal').style.display = 'flex';

//     //display response in modal
//     document.getElementById('response').textContent = response;

// }

const modal = document.getElementById('responseModal');
const responseEl = document.getElementById('message');
const submitBtn = document.getElementById('submit');
const closeBtn = document.getElementById('closeBtn'); 
const escalateBtn = document.getElementById('escalateBtn');

let currentQrr

// Open modal and show solution
function openResponseModal(event) {
    document.getElementById('responseModal').style.display = 'flex';
    const response = event.target.getAttribute('data-response');
    responseEl.textContent = response;      

}

// Event listeners
document.getElementById('submit').addEventListener('click', async (event) => {
    event.preventDefault();

    const query = document.getElementById('query').value;
    const name = document.getElementById('name').value;

    const res = await fetch('/getResponse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, name })
    });

    const data = await res.json();

    document.getElementById('message').textContent = data.response;
    document.getElementById('responseModal').style.display = 'flex';
});