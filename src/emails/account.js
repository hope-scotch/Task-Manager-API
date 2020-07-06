// sendgrid allows us to send emails
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

/* sgMail.send({ // Here we configure the email as an object
    to: 'sayantan.biswas7653@gmail.com',
    from: 'sayantan.biswas7653@gmail.com',
    subject: 'This is my first creation!',
    // We can use html based email
    text: 'I hope this one actually gets to me.'
}) */

const welcomeEmail = (email, name) => {

    const firstName = name.split(' ')[0]

    sgMail.send({
        to: email,
        from: 'sayantan.biswas7653@gmail.com',
        subject: 'Thanks for joining in!',
        // The injected property can be used only with '`' (back ticks) and not with quotes
        text: `Welcome to the app, ${firstName}. Let me know how you get along with the app`
    })
}

const goodbyeEmail = (email, name) => {

    const firstName = name.split(' ')[0]
    
    sgMail.send({
        to: email,
        from: 'sayantan.biswas7653@gmail.com',
        subject: 'Goodbye',
        text: `Goodbye, ${firstName}. We are sorry for any inconvinience caused. We wish you wouldn't leave us`
    })
}

export { welcomeEmail, goodbyeEmail }