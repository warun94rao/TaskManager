const sgMail = require('@sendgrid/mail')

console.log(process.env.SENDGRID_API_KEY)

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email,name)=>{
    console.log(email)
    sgMail.send({
        to:email,
        from:'monkvedic@gmail.com',
        subject:'Welome Mail from Task Manager',
        text:`Hi ${name}, Welcome to task app. Let me know how you get along with app by rating.`
    })
}

const sendClosingMail = (email,name)=>{
    console.log("Email",email)
    sgMail.send({
        to:email,
        from:'monkvedic@gmail.com',
        subject:'Account Closing Mail from Task Manager',
        text:`Hi ${name}, Let me know why yo discontinued. Your feedback is valuable.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendClosingMail
}
