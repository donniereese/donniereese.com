// Imperative functionality, programming in more reliable es5
// very vanilla javascript is less-likely to break
console.log('bananaroaming');

(function() {
    function sanitarize(string) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            "/": '&#x2F;',
        };
        const reg = /[&<>"'/]/ig;
        return string.replace(reg, (match)=>(map[match]));
    }

    var contactForm = document.getElementById('contact-form');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        var name = contactForm.querySelector('input[name=contactName]').value;
        var email = contactForm.querySelector('input[name=contactEmail]').value;
        var message = contactForm.querySelector('textarea[name=contactMessage]').value;

        name = sanitarize(name);
        email = sanitarize(email);
        message = sanitarize(message);

        axios.post('http://localhost:3000/api/hello', { name, email, message })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    })

    const message = [
        `          `,
        `          `,
        `          `,
        `          `,
        `          `,
    ];
})()
