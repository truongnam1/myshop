const Mailgun = require('mailgun-js');

const template = require('../config/template');
const keys = require('../config/keys');

const { key, domain, sender } = keys.mailgun;

class MailgunService {
    init() {
        try {
            // console.log("key", key);
            // console.log(`domain`, domain);
            // return new Mailgun({
            //     apiKey: key,
            //     domain: domain
            // });

            return new Mailgun({
                apiKey: `edf69740c1cc8f8ec0336fa91da241e8-02fa25a3-06304814`,
                domain: "sandbox695cf91de03c4eb2883ca9032f97980b.mailgun.org"
            });
        } catch (error) {
            console.warn('Missing mailgun keys');
        }
    }
}

const mailgun = new MailgunService().init();

exports.sendEmail = async(email, type, host, data) => {
    try {
        const message = prepareTemplate(type, host, data);

        const config = {
            from: `MERN Store! <${sender}>`,
            to: email,
            subject: message.subject,
            text: message.text
        };

        return await mailgun.messages().send(config);
    } catch (error) {
        return error;
    }
};

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