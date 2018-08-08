const transporter = require('./transporter');
const fs = require('fs');
const path = require('path');
const mjml = require('mjml');
const hbs = require('handlebars');

const sendMail = (username, email, confirmUrl, confirmation) => {

  const templateFile = path.join(__dirname, `./templates/confirmation.mjml`);
  const mjmlTemplate = fs.readFileSync(templateFile,'utf8');
  const { html } = mjml(mjmlTemplate, {});
  const templateData = hbs.compile(html);
  const compiledHTML = templateData({username, confirmUrl, confirmation});

  return transporter.sendMail({
    from: `"SeeFood" <${process.env.EMAIL}>`,
    to: email,
    subject: 'Confirm your account',
    html: compiledHTML
  })
  .then(info => console.log(info))
  .catch(error => console.log(error))
}

module.exports = sendMail;
