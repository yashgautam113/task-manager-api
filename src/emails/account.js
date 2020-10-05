const sgMail = require('@sendgrid/mail')
//const sendgridAPIKey = ''

//sgMail.setApiKey(sendgridAPIKey)
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// Testing

// sgMail.send({
//     to : 'shikhagautam439@gmail.com',
//     from : 'yash.gautam113@gmail.com',
//     subject : 'first',
//     text : 'first'
//     to create fancy email use
//     html : dnswicdvdvve............
// })

const sendWelcomeEmail = (email,name)=>{
    sgMail.send({
        to : email,
        from: 'yash.gautam113@gmail.com',
        subject : 'Thanks',
        text : `Welcome, ${name}` // ES6 string
        })
}

const delemail = (email,name)=>{
    sgMail.send({
        to : email,
        from : 'yash.gautam113@gmail.com',
        subject : 'We will miss you',
        text : `From heavy heart, goodbye ${name} .`
    })
}

module.exports = {
    sendWelcomeEmail,
    delemail,
}