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
            showModal: this.props.showModal,
            attachedFile: null,
            eventDetail: {
                id: this.props.eventType === 'add' ? this.props.newIndex : this.props.eventInfo.id,
                title: this.props.eventInfo && this.props.eventInfo.title ? this.props.eventInfo.title : '',
                start: this.props.eventInfo && this.props.eventInfo.start ? this.props.eventInfo.start : moment(),
                end: this.props.eventInfo && this.props.eventInfo.end ? this.props.eventInfo.end : moment(),
                allDay: this.props.eventInfo.allDay ? true : false,
                hexColor: this.props.eventInfo.hexColor ? this.props.eventInfo.hexColor : '#265985',
                notes: this.props.eventInfo.notes ? this.props.eventInfo.notes : '',
                file: this.props.eventInfo.file || null
            },
            // tambahan buat form email
            toEmail: '',
            message: ''
        };
        this.changeHandler = this.changeHandler.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.sendEmail = this.sendEmail.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            showModal: nextProps.showModal,
            attachedFile: nextProps.eventInfo.file || null,
            eventDetail: {
                id: nextProps.eventType === 'add' ? nextProps.newIndex : nextProps.eventInfo.id,
                title: nextProps.eventInfo && nextProps.eventInfo.title ? nextProps.eventInfo.title : '',
                start: new Date(nextProps.eventInfo && nextProps.eventInfo.start ? nextProps.eventInfo.start : moment()),
                end: new Date(nextProps.eventInfo && nextProps.eventInfo.end ? nextProps.eventInfo.end : moment()),
                allDay: nextProps.eventInfo.allDay ? true : false,
                hexColor: nextProps.eventInfo.hexColor ? nextProps.eventInfo.hexColor : '#265985',
                notes: nextProps.eventInfo.notes ? nextProps.eventInfo.notes : '',
                file: nextProps.eventInfo.file || null
            }
        });
    }

    changeHandler(e, ref) {
        var eventDetail = this.state.eventDetail;
        var val = '';
        if (ref !== "allDay") {
            if (ref === "start" || ref === "end") {
                val = new Date(moment(e));
            } else {
                val = e.target.value;
            }
        } else {
            val = e.target.checked;
        }

        eventDetail[ref] = val;
        this.setState({ eventDetail });
    }

    handleFileChange(e) {
        const file = e.target.files[0];
        this.setState(prevState => ({
            attachedFile: file,
            eventDetail: {
                ...prevState.eventDetail,
                file: file
            }
        }));
    }

    sendEmail(e) {
        if (e && e.preventDefault) e.preventDefault();

        const templateParams = {
            to_email: this.state.toEmail,
            message: this.state.message,
            event_title: this.state.eventDetail.title
        };

        emailjs.send(
            'service_dzf4rqg', // ganti service ID
            'template_udeia4f', // ganti template ID
            templateParams,
            'TiIAUd56-gOt4yPxz' // ganti Public Key kamu
        )
        .then((response) => {
            console.log('SUCCESS!', response.status, response.text);
            alert('Email berhasil dikirim!');
            this.setState({ toEmail: '', message: '' });
        }, (err) => {
            console.log('FAILED...', err);
            alert('Gagal kirim email!');
        });
    }

    scheduleEmail() {
        const { start } = this.state.eventDetail;
        const eventStart = new Date(start).getTime();
        const now = new Date().getTime();
        const oneMinuteBefore = eventStart - 60000;

        const timeUntilSend = oneMinuteBefore - now;

        if (timeUntilSend > 0) {
            setTimeout(() => {
                this.sendEmail({ preventDefault: () => {} }); // Kirim otomatis
            }, timeUntilSend);
            console.log(`Email akan dikirim dalam ${Math.round(timeUntilSend / 1000)} detik`);
        } else {
            console.log("Event mulai dalam kurang dari 1 menit atau sudah lewat, tidak menjadwalkan email.");
        }
    }

    render() {
        return (
            <Modal show={this.state.showModal} onHide={this.props.handleHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Event Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label> Event Name </label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter the Event Name"
                        value={this.state.eventDetail.title}
                        onChange={(e) => this.changeHandler(e, "title")}
                    />

                    <label> Start Date </label>
                    {this.state.eventDetail.allDay ? (
                        <Datetime
                            value={this.state.eventDetail.start}
                            dateFormat="MM-DD-YYYY"
                            timeFormat={false}
                            onChange={(e) => this.changeHandler(e, "start")}
                        />
                    ) : (
                        <Datetime
                            value={this.state.eventDetail.start}
                            onChange={(e) => this.changeHandler(e, "start")}
                        />
                    )}

                    <label> End Date </label>
                    {this.state.eventDetail.allDay ? (
                        <Datetime
                            value={this.state.eventDetail.end}
                            dateFormat="MM-DD-YYYY"
                            timeFormat={false}
                            onChange={(e) => this.changeHandler(e, "end")}
                        />
                    ) : (
                        <Datetime
                            value={this.state.eventDetail.end}
                            onChange={(e) => this.changeHandler(e, "end")}
                        />
                    )}

                    <label> Event Notes </label>
                    <textarea
                        className="form-control"
                        placeholder="Event Notes"
                        value={this.state.eventDetail.notes}
                        onChange={(e) => this.changeHandler(e, "notes")}
                    />

                    <label> Event Color </label>
                    <input
                        type="color"
                        value={this.state.eventDetail.hexColor}
                        onChange={(e) => this.changeHandler(e, "hexColor")}
                        style={{ marginRight: '20px', marginLeft: '5px' }}
                    />

                    <input
                        type="checkBox"
                        name="all_Day"
                        value={this.state.eventDetail.id}
                        checked={this.state.eventDetail.allDay}
                        onChange={(e) => this.changeHandler(e, "allDay")}
                    />
                    <label> All Day </label>

                    <br /><br />
                    <label>Attach File</label>
                    <input
                        type="file"
                        className="form-control"
                        onChange={this.handleFileChange}
                    />
                    {this.state.attachedFile && (
                        <p style={{ fontSize: '0.85rem' }}>
                            Attached: {this.state.attachedFile.name}
                        </p>
                    )}
                    {this.state.eventDetail.file && typeof this.state.eventDetail.file !== 'string' && (
                        <a
                            href={URL.createObjectURL(this.state.eventDetail.file)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '0.85rem', display: 'inline-block', marginTop: '5px' }}
                        >
                            📎 View Attached File
                        </a>
                    )}

                    {/* ======================= FORM EMAIL ========================== */}
                    <hr />
                    <h5>Kirim Notifikasi Email by PSO kel 11</h5>
                    <form onSubmit={this.sendEmail}>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email Penerima"
                            value={this.state.toEmail}
                            onChange={(e) => this.setState({ toEmail: e.target.value })}
                            required
                        />
                        <br />
                        <textarea
                            className="form-control"
                            placeholder="Pesan"
                            value={this.state.message}
                            onChange={(e) => this.setState({ message: e.target.value })}
                            required
                        />
                        <br />
                        <Button type="submit" bsStyle="info">Kirim Email</Button>
                    </form>
                    {/* ======================= END FORM EMAIL ========================== */}

                </Modal.Body>
                <Modal.Footer>
                    {this.props.eventType === 'add' ? (
                        <Button
                            bsStyle="success"
                            onClick={() => {
                                this.setState({
                                    toEmail: this.state.toEmail || 'email@example.com', // ganti email default
                                    message:
                                        this.state.message ||
                                        `Reminder: Event "${this.state.eventDetail.title}" akan segera dimulai.`
                                }, () => {
                                    this.props.addEvent(this.state.eventDetail);
                                    this.scheduleEmail();
                                });
                            }}
                        >
                            Add
                        </Button>
                    ) : (
                        <Button
                            bsStyle="warning"
                            onClick={() => {
                                this.setState({
                                    toEmail: this.state.toEmail || 'email@example.com',
                                    message:
                                        this.state.message ||
                                        `Reminder: Event "${this.state.eventDetail.title}" akan segera dimulai.`
                                }, () => {
                                    this.props.updateEvent(this.state.eventDetail);
                                    this.scheduleEmail();
                                });
                            }}
                        >
                            Update
                        </Button>
                    )}
                    {this.props.eventType === 'add' ? null : (
                        <Button bsStyle="danger" onClick={() => this.props.deleteEvent(this.state.eventDetail.id)}>
                            Delete
                        </Button>
                    )}
                    <Button onClick={this.props.handleHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
