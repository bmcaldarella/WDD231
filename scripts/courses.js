// Replace with the official Course List Array from the assignment.
// Minimal starter data (structure example):
const courses = [
    { code: 'CSE 212', name: 'Programming with Data Structures', credits: 2, subject: 'CSE', completed: false },
    { code: 'WDD 231', name: 'Web Frontend Development I', credits: 2, subject: 'WDD', completed: false },
    { code: 'WDD 330', name: 'Web Frontend Development II', credits: 3, subject: 'WDD', completed: false },
    { code: 'CSE 340', name: 'Web Backend Development', credits: 3, subject: 'CSE', completed: false },
    { code: 'CIT111', name: "Introduction to Databases", credits: 3, subject: "CIT", completed: true },
    { code: 'CSE111', name: "Programming with Functions", credits: 2, subject: "CSE", completed: true },
    { code: 'CSE210', name: "Programming with Classes", credits: 2, subject: "CSE", completed: true },
    { code: 'CSEPC110', name: "Introduction to Programming (EQUIV)", credits: 2, subject: "CSEPC", completed: true },
    { code: 'WDD130', name: "Web Fundamentals", credits: 2, subject: "WDD", completed: true },
    { code: 'WDD131', name: "Dynamic Web Fundamentals", credits: 2, subject: "WDD", completed: true },

];

const grid = document.getElementById('courses');
const creditEl = document.getElementById('creditTotal');

function render(list) {
    grid.innerHTML = '';
    list.forEach(c => {
        const card = document.createElement('div');
        card.className = `course ${c.completed ? 'completed' : ''}`;
        card.textContent = c.code;
        grid.appendChild(card);
    });
    const total = list.reduce((sum, c) => sum + (Number(c.credits) || 0), 0);
    creditEl.textContent = total;
}

function filter(kind) {
    if (kind === 'WDD' || kind === 'CSE' || kind ==="CIT" || kind ==="CSEPC") return courses.filter(c => c.subject === kind);
    return courses;
}

document.querySelectorAll('.filters .chip').forEach(btn => {
    btn.addEventListener('click', () => {
        render(filter(btn.dataset.filter));
    });
});


render(courses);
