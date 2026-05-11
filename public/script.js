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
const responseEl = document.getElementById('response');
const submitBtn = document.getElementById('submit');
const closeBtn = document.getElementById('closeBtn'); 
const escalateBtn = document.getElementById('escalateBtn');

let currentQrr

// Open modal and show solution
function openResponseModal(event) {
    event.preventDefault();
    const name = document.getElementById('name').value || "User";
    const email = document.getElementById('email').value || "";
    const enquiry = document.getElementById('enquiry').value.trim();

    if (!enquiry) {
        alert("Please enter your enquiry.");
        return;
    }

    fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials:'include',
        body: JSON.stringify({ name, email, enquiry })
    })
    .then(res => res.json())
    .then(data => {
        responseEl.innerHTML = `
            <strong>Category:</strong> ${data.category} <br>
            <strong>Solution:</strong> ${data.solution} <br>
        `;
        currentQrr=data.queryid
        console.log(currentQrr)
        // Show modal
        modal.style.display = 'flex';
        // Show Escalate button only on solution
        escalateBtn.style.display = 'inline-block';
    })
    .catch(err => {
        console.error(err);
        responseEl.textContent = "Something went wrong!";
        modal.style.display = 'flex';
        escalateBtn.style.display = 'none';
    });
}

// Close modal
function closeModal() {
    modal.style.display = 'none';
}

// Escalate issue
function escalateIssue() {
    const name = document.getElementById('name').value || "User";
    const enquiry = document.getElementById('enquiry').value.trim();
    const enquiryID = currentQrr

    if (!enquiry) {
        responseEl.innerHTML = "Cannot escalate an empty enquiry!";
        modal.style.display = 'flex';
        return;
    }

    fetch('/api/escalate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, enquiry,enquiryID })
    })
    .then(res => res.json())
    .then(data => {
        // Show escalation message inside modal
        responseEl.innerHTML = `<strong>${data.message}</strong>`;
        modal.style.display = 'flex';
        // Hide Escalate button after showing escalation message
        escalateBtn.style.display = 'none';
    })
    .catch(err => {
        console.error(err);
        responseEl.innerHTML = "Failed to escalate issue.";
        modal.style.display = 'flex';
        escalateBtn.style.display = 'none';
    });
}

// Event listeners
submitBtn.addEventListener('click', openResponseModal);
closeBtn.addEventListener('click', closeModal);
escalateBtn.addEventListener('click', escalateIssue);

// Intercept button clicks
document.getElementById('submit').addEventListener('click', async () => {
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

document.getElementById('closeBtn').addEventListener('click', () => {
    document.getElementById('responseModal').style.display = 'none';
});