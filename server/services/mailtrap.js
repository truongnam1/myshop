const Email = require('email-templates');
const template = require('../config/template');
class MailtrapService {
    init() {
        const email = new Email({
            message: {
                from: process.env.MAILTRAP_MAIL_ADMIN
            },
            // send: true,
            transport: {
                host: 'smtp.mailtrap.io',
                port: 2525,
                ssl: false,
                tls: true,
                auth: {
                    user: process.env.MAILTRAP_USER, // your Mailtrap username
                    pass: process.env.MAILTRAP_PASSWORD //your Mailtrap password
                }
            }
        });

        return email;
    }
}

const mailtrap = new MailtrapService().init();
exports.sendEmail = async(email, type, host, data) => {

    const message = prepareTemplate(type, host, data);

    mailtrap
        .send({
            // template: 'welcome',
            message: {
                to: email,
                ...message
            },
            // locals: { firstName: 'Diana', lastName: 'One' }
        })
        .then(console.log)
        .catch(console.error);
};



const people = [
    { firstName: 'Diana', lastName: 'One' },
    { firstName: 'Alex', lastName: 'Another' }
];

// people.forEach((person) => {
//     email
//         .send({
//             template: 'welcome',
//             message: {
//                 to: 'test@example.com'
//             },
//             locals: person
//         })
//         .then(console.log)
//         .catch(console.error);
// });


const prepareTemplate = (type, host, data) => {
    let message;

    switch (type) {
        case 'reset':
            message = template.resetEmail(host, data);
            break;

        case 'reset-confirmation':
            message = template.confirmResetPasswordEmail();
            break;

        case 'signup':
            message = template.signupEmail(data);
            break;

        case 'merchant-signup':
            message = template.merchantSignup(host, data);
            break;

        case 'merchant-welcome':
            message = template.merchantWelcome(data);
            break;

        case 'newsletter-subscription':
            message = template.newsletterSubscriptionEmail();
            break;

        case 'contact':
            message = template.contactEmail();
            break;

        case 'merchant-application':
            message = template.merchantApplicationEmail();
            break;

        case 'order-confirmation':
            message = template.orderConfirmationEmail(data);
            break;

        default:
            message = '';
    }

    return message;
};