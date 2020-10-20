'use strict';

import { NodeMailgun } from 'ts-mailgun';
import { MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_FROM_EMAIL, MAILGUN_FROM_TITLE } from './config';

const mailer = new NodeMailgun();
mailer.apiKey = MAILGUN_API_KEY; // Set your API key
mailer.domain = MAILGUN_DOMAIN; // Set the domain you registered earlier
mailer.fromEmail = MAILGUN_FROM_EMAIL; // Set your from email
mailer.fromTitle = MAILGUN_FROM_TITLE; // Set the name you would like to send from

mailer.init();

export const sendMail = async (to: string, subject: string, message: string) => {
  mailer
    .send(to, subject, message)
    .then(result => console.log('Done', result))
    .catch(error => console.error('Error: ', error));
};
