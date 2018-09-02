// Imperative functionality, programming in more reliable es5
// very vanilla javascript is less-likely to break
(function() {
    var contactForm = document.getElementById('contact-form');
    var inputs = {
        name: contactForm.querySelector('input[name=contactName]'),
        email: contactForm.querySelector('input[name=contactEmail]'),
        message: contactForm.querySelector('textarea[name=contactMessage]'),
        submit: contactForm.querySelector('button[name=contactSubmit]')
    }

    var formStatus = {
        name: {
            noEmpty: { type: 'error', status: false, el: null, message: 'Your name, if you might.' }
        },
        email: {
            noEmpty: { type: 'error', status: false, el: null, message: "If you give me your email I can say hi." },
            wrongFormat: { type: 'error', status: false, el: null }
        },
        message: {
            noEmpty: { type: 'error', status: false, el: null, message: 'Did you not have anything to say?' }
        },
        submit: {
            waiting: { type: 'wait', status: false, el: null, message: 'Pneumatic tube is wooshin your message away.' },
            success: { type: 'success', status: false, el: null, message: "Huzzah! I'll see your message shortly." },
            failed: { type: 'error', status: false, el: null, message: "Oh no! Looks like it failed. Want to try again?" }
        }
    }

    function createElement(type = 'message', contents = '', hasIcon = true) {

        var el = document.createElement('span');
            el.classList.add('message');
        var icon = null;
        var fontIcon = null;

        if (hasIcon) {
            icon = document.createElement('strong');
            icon.classList.add('message-accent');
            fontIcon = document.createElement('i');
            fontIcon.classList.add('fas');
            icon.appendChild(fontIcon);
            el.appendChild(icon);
        }

        switch (type) {
            case 'wait':
                el.classList.add('wait-message');
                if (hasIcon) { fontIcon.classList.add('fa-spinner', 'fa-pulse'); icon.classList.add('wait-accent'); }
                break;
            case 'error':
                el.classList.add('error-message');
                if (hasIcon) { fontIcon.classList.add('fa-times'); icon.classList.add('error-accent'); }
                break;
            case 'alert':
                el.classList.add('alert-message');
                if (hasIcon) { fontIcon.classList.add('fa-exclamation-triangle'); icon.classList.add('alert-accent'); }
                break;
            case 'success':
                el.classList.add('success-message');
                if (hasIcon) { fontIcon.classList.add('fa-check'); icon.classList.add('success-accent'); }
                break;
            case 'message':
            default:
                el.classList.add('message-common');
                if (hasIcon) fontIcon.classList.add('fa-comment');
        }

        var textNode = document.createTextNode(contents);
        el.appendChild(textNode);

        return el;
    }

    function changeStatusOf(target, messageId, status) {
        var stat = formStatus[target][messageId];

        if (!status) {
            if (stat.el && stat.el instanceof HTMLElement) stat.el.parentNode.removeChild(stat.el);
            stat.status = false;

        } else {
            if (stat.status !== status){
                stat.el = createElement(stat.type, stat.message, true);
                stat.status = true;
                inputs[target].parentNode.appendChild(stat.el);
            }
        }
    }

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

    inputs.name.addEventListener('blur', function(e) {
        // if (e.target.value === '') changeStatusOf('name', 'noEmpty', true);
    });

    inputs.email.addEventListener('blur', function(e) {
        if (e.target.value === '') {
            changeStatusOf('email', 'noEmpty', true);
        } else {
            changeStatusOf('email', 'noEmpty', false);
        }
    });

    inputs.message.addEventListener('blur', function(e) {
        if (e.target.value === '') {
            changeStatusOf('message', 'noEmpty', true)
        } else {
            changeStatusOf('message', 'noEmpty', false)
        }
    });

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        changeStatusOf('submit', 'waiting', true);

        var name = sanitarize(inputs.name.value);
        var email = sanitarize(inputs.email.value);
        var message = sanitarize(inputs.message.value);

        axios.post('https://apps.donniereese.com/api/hello', { name, email, message })
        .then(function (response) {
            changeStatusOf('submit', 'waiting', false);
            changeStatusOf('submit', 'success', true);
        })
        .catch(function (error) {
            changeStatusOf('submit', 'waiting', false);
            changeStatusOf('submit', 'failed', true);
        });
    })

    var saycheese = [
        `                                                              `,
        `                         ,d                 ,d`,
        `                         88                 88`,
        `8b,dPPYba,   ,adPPYba, MM88MMM ,adPPYYba, MM88MMM ,adPPYba,`,
        `88P'    "8a a8"     "8a  88    ""     \`Y8   88   a8"     "8a`,
        `88       d8 8b       d8  88    ,adPPPPP88   88   8b       d8`,
        `88b,   ,a8" "8a,   ,a8"  88,   88,    ,88   88,  "8a,   ,a8"`,
        `88\`YbbdP"'   \`"YbbdP"'   "Y888 \`"8bbdP"Y8   "Y888 \`"YbbdP"'`,
        `88`,
        `87          100% Powered by 🥔 & ☕️ `,
        `p `,
        `   `
    ];

    var msg = saycheese.join('\n');

    console.log(msg);
})()
