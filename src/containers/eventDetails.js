import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import moment from 'moment';
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
            }
        };
        this.changeHandler = this.changeHandler.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
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

    render() {
        return (
            <Modal show={this.state.showModal} onHide={this.props.handleHide}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title">Event Details</Modal.Title>
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
                </Modal.Body>
                <Modal.Footer>
                    {this.props.eventType === 'add' ? (
                        <Button
                            bsStyle="success"
                            onClick={() => this.props.addEvent(this.state.eventDetail)}
                        >
                            Add
                        </Button>
                    ) : (
                        <Button
                            bsStyle="warning"
                            onClick={() => this.props.updateEvent(this.state.eventDetail)}
                        >
                            Update
                        </Button>
                    )}
                    {this.props.eventType === 'add' ? null : (
                        <Button
                            bsStyle="danger"
                            onClick={() => this.props.deleteEvent(this.state.eventDetail.id)}
                        >
                            Delete
                        </Button>
                    )}
                    <Button onClick={this.props.handleHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
