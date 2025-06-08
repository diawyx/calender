import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
const SendEmail = ({ eventTitle }) => {
  const [toEmail, setToEmail] = useState('');
  const [message, setMessage] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();

    const templateParams = {
      to_email: toEmail,
      message: message,
      event_title: eventTitle,
    };

    emailjs.send(
      'service_dzf4rqg', // ganti pakai service ID kamu
      'template_udeia4f', // ganti pakai template ID kamu
      templateParams,
      'TiIAUd56-gOt4yPxz' // ganti pakai Public Key kamu (bukan private ya)
    )
    .then((response) => {
      console.log('SUCCESS!', response.status, response.text);
      alert('Email berhasil dikirim!');
      setToEmail('');
      setMessage('');
    }, (err) => {
      console.log('FAILED...', err);
      alert('Gagal kirim email!');
    });
  };

  return (
    <form onSubmit={sendEmail}>
      <h4>Kirim Notifikasi Email</h4>
      <input
        type="email"
        placeholder="Email Penerima"
        value={toEmail}
        onChange={(e) => setToEmail(e.target.value)}
        required
      />
      <br />
      <textarea
        placeholder="Pesan"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      <br />
      <button type="submit">Kirim Email</button>
    </form>
  );
};

export default SendEmail;
