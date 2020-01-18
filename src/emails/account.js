const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (name, email) => {
    sgMail.send({
        to: email,
        from: 'shivanshindia@gmail.com',
        subject: 'Welcome to Task Manager',
        text: `Hello, ${name}! A thousand greetings from task manager company.`
    })
}

const sendFinalEmail = (name, email) => {
    sgMail.send({
        to: email,
        from: 'shivanshindia@gmail.com',
        subject: 'Had a great journey with you',
        text: `Goodbye, ${name}! We would like to know your reason for leaving. Sorry to see you go.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendFinalEmail
}