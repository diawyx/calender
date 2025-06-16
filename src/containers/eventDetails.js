import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import moment from 'moment';
import emailjs from '@emailjs/browser';
import '../css/datetime.css';

var Datetime = require('react-datetime');

export default class EventDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: props.showModal,
      attachedFile: null,
      toEmail: '',
      message: '',
      eventDetail: {
        id: props.eventType === 'add' ? props.newIndex : props.eventInfo.id,
        title: props.eventInfo?.title || '',
        start: props.eventInfo?.start || moment(),
        end: props.eventInfo?.end || moment(),
        allDay: props.eventInfo?.allDay || false,
        hexColor: props.eventInfo?.hexColor || '#265985',
        notes: props.eventInfo?.notes || '',
        file: props.eventInfo?.file || null
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      showModal: nextProps.showModal,
      attachedFile: nextProps.eventInfo.file || null,
      eventDetail: {
        id: nextProps.eventType === 'add' ? nextProps.newIndex : nextProps.eventInfo.id,
        title: nextProps.eventInfo?.title || '',
        start: new Date(nextProps.eventInfo?.start || moment()),
        end: new Date(nextProps.eventInfo?.end || moment()),
        allDay: nextProps.eventInfo?.allDay || false,
        hexColor: nextProps.eventInfo?.hexColor || '#265985',
        notes: nextProps.eventInfo?.notes || '',
        file: nextProps.eventInfo?.file || null
      }
    });
  }

  changeHandler = (e, field) => {
    const updatedDetail = { ...this.state.eventDetail };
    if (field === 'start' || field === 'end') {
      updatedDetail[field] = new Date(moment(e));
    } else if (field === 'allDay') {
      updatedDetail[field] = e.target.checked;
    } else {
      updatedDetail[field] = e.target.value;
    }
    this.setState({ eventDetail: updatedDetail });
  };

  handleFileChange = (e) => {
    const file = e.target.files[0];
    this.setState(prev => ({
      attachedFile: file,
      eventDetail: { ...prev.eventDetail, file }
    }));
  };

  sendEmail = (e) => {
    if (e?.preventDefault) e.preventDefault();

    const templateParams = {
      to_email: this.state.toEmail,
      message: this.state.message,
      event_title: this.state.eventDetail.title
    };

    emailjs.send(
      'service_dzf4rqg', // ganti dengan Service ID kamu
      'template_udeia4f', // ganti dengan Template ID kamu
      templateParams,
      'TiIAUd56-gOt4yPxz' // ganti dengan Public Key kamu
    ).then((res) => {
      console.log('Email sent!', res.status, res.text);
      alert('📬 Email berhasil dikirim!');
      this.setState({ toEmail: '', message: '' });
    }).catch((err) => {
      console.error('Email failed...', err);
      alert('❌ Gagal kirim email!');
    });
  };

  scheduleEmail = () => {
    const start = new Date(this.state.eventDetail.start).getTime();
    const now = new Date().getTime();
    const delay = start - now - 60000;

    if (delay > 0) {
      setTimeout(() => {
        this.sendEmail({ preventDefault: () => {} });
      }, delay);
      console.log(`Email akan dikirim dalam ${Math.round(delay / 1000)} detik`);
    } else {
      console.log("Event terlalu dekat atau sudah lewat. Email tidak dijadwalkan.");
    }
  };

  render() {
    const { eventDetail, attachedFile, toEmail, message } = this.state;
    const { showModal } = this.state;
    const { eventType, handleHide, addEvent, updateEvent, deleteEvent } = this.props;

    return (
      <Modal show={showModal} onHide={handleHide} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>📅 Event Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <label>📌 Event Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Judul Event"
            value={eventDetail.title}
            onChange={(e) => this.changeHandler(e, "title")}
          />

          <label>🕒 Start Date</label>
          <Datetime
            value={eventDetail.start}
            dateFormat="MM-DD-YYYY"
            timeFormat={!eventDetail.allDay}
            onChange={(e) => this.changeHandler(e, "start")}
          />

          <label>🕔 End Date</label>
          <Datetime
            value={eventDetail.end}
            dateFormat="MM-DD-YYYY"
            timeFormat={!eventDetail.allDay}
            onChange={(e) => this.changeHandler(e, "end")}
          />

          <label>📝 Notes</label>
          <textarea
            className="form-control"
            placeholder="Catatan tambahan..."
            value={eventDetail.notes}
            onChange={(e) => this.changeHandler(e, "notes")}
          />

          <div style={{ marginTop: '10px' }}>
            <label>🎨 Warna Event</label>
            <input
              type="color"
              value={eventDetail.hexColor}
              onChange={(e) => this.changeHandler(e, "hexColor")}
              style={{ marginLeft: '10px' }}
            />
          </div>

          <div style={{ marginTop: '10px' }}>
            <label>
              <input
                type="checkbox"
                checked={eventDetail.allDay}
                onChange={(e) => this.changeHandler(e, "allDay")}
              /> All Day
            </label>
          </div>

          <br />
          <label>📎 Upload File</label>
          <input
            type="file"
            className="form-control"
            onChange={this.handleFileChange}
          />
          {attachedFile && <p style={{ fontSize: '0.85rem' }}>Attached: {attachedFile.name}</p>}
          {eventDetail.file && typeof eventDetail.file !== 'string' && (
            <a
              href={URL.createObjectURL(eventDetail.file)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '0.85rem', display: 'inline-block', marginTop: '5px' }}
            >
              📄 View File
            </a>
          )}

          <hr />
          <h5>✉️ Kirim Notifikasi Email</h5>
          <form onSubmit={this.sendEmail}>
            <input
              type="email"
              className="form-control"
              placeholder="Email Tujuan"
              value={toEmail}
              onChange={(e) => this.setState({ toEmail: e.target.value })}
              required
            />
            <br />
            <textarea
              className="form-control"
              placeholder="Isi Pesan"
              value={message}
              onChange={(e) => this.setState({ message: e.target.value })}
              required
            />
            <br />
            <Button type="submit" variant="info">Kirim Email Sekarang</Button>
          </form>
        </Modal.Body>

        <Modal.Footer>
          {eventType === 'add' ? (
            <Button
              variant="success"
              onClick={() => {
                this.setState({
                  toEmail: toEmail || 'email@example.com',
                  message: message || `Reminder: Event "${eventDetail.title}" akan segera dimulai.`
                }, () => {
                  addEvent(eventDetail);
                  this.scheduleEmail();
                });
              }}
            >Add</Button>
          ) : (
            <>
              <Button
                variant="warning"
                onClick={() => {
                  this.setState({
                    toEmail: toEmail || 'email@example.com',
                    message: message || `Reminder: Event "${eventDetail.title}" akan segera dimulai.`
                  }, () => {
                    updateEvent(eventDetail);
                    this.scheduleEmail();
                  });
                }}
              >Update</Button>
              <Button variant="danger" onClick={() => deleteEvent(eventDetail.id)}>Delete</Button>
            </>
          )}
          <Button variant="secondary" onClick={handleHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
