// EventCalendar.js (dark mode)
import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import EventDetails from './eventDetails';

import * as eventAction from '../store/eventAction';
import * as types from '../store/eventActionTypes';

BigCalendar.momentLocalizer(moment);
let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);

class EventCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            eventType: 'add',
            newIndex: 0,
            eventInfo: {}
        };
        this.handleHide = this.handleHide.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
        this.addEvent = this.addEvent.bind(this);
        this.updateEvent = this.updateEvent.bind(this);
    }

    componentWillMount() {
        this.props.dispatch(eventAction.GetInitialEvents());
    }

    handleHide() {
        this.setState({ showModal: false });
    }

    handleShow(slotInfo, eventType) {
        const currentIndex = this.props.events.allEvents.length;
        this.setState({
            showModal: true,
            eventType,
            eventInfo: slotInfo,
            newIndex: currentIndex
        });
    }

    deleteEvent(id) {
        this.props.dispatch({
            type: types.REMOVE_EVENT,
            payload: id
        });
        this.setState({ showModal: false });
    }

    addEvent(obj) {
        this.props.dispatch({
            type: types.ADD_EVENT,
            payload: obj
        });
        this.setState({ showModal: false });
    }

    updateEvent(obj) {
        this.props.dispatch({
            type: types.UPDATE_EVENT,
            payload: {
                id: obj.id,
                obj: obj
            }
        });
        this.setState({ showModal: false });
    }

    eventStyle(event, start, end, isSelected) {
        const bgColor = event.hexColor || '#265985';
        return {
            style: {
                backgroundColor: bgColor,
                borderRadius: '5px',
                opacity: 0.9,
                color: '#ffffff',
                border: '1px solid #444',
                display: 'block'
            }
        };
    }

    checkReminder() {
        const now = new Date();
        this.props.events.allEvents.forEach(event => {
            const startTime = new Date(event.start);
            const timeDiff = (startTime - now) / 60000;

            if (timeDiff > 0 && timeDiff <= 10 && !event.notified) {
                if (Notification.permission === 'granted') {
                    new Notification("📅 Event Reminder", {
                        body: `Event "${event.title}" akan dimulai dalam ${Math.ceil(timeDiff)} menit!`,
                        icon: '/icon.png'
                    });
                }
                event.notified = true;
            }
        });
    }

    render() {
        this.checkReminder();

        return (
            <div className="bodyContainer" style={{
                backgroundColor: '#121212',
                color: '#f0f0f0',
                minHeight: '100vh',
                padding: '20px'
            }}>
                <div className="well well-sm" style={{
                    backgroundColor: '#1e1e1e',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    padding: '15px',
                    marginBottom: '20px'
                }}>
                    <h3 className="instruction" style={{ color: '#000000' }}>Calender PSO Kelompok 11</h3>
                </div>

                <EventDetails
                    showModal={this.state.showModal}
                    handleHide={this.handleHide}
                    eventType={this.state.eventType}
                    eventInfo={this.state.eventInfo}
                    newIndex={this.state.newIndex}
                    deleteEvent={this.deleteEvent}
                    addEvent={this.addEvent}
                    updateEvent={this.updateEvent}
                />

                <BigCalendar
                    selectable
                    events={this.props.events.allEvents}
                    views={allViews}
                    step={60}
                    showMultiDayTimes
                    defaultDate={new Date(moment())}
                    onSelectEvent={event => this.handleShow(event, 'edit')}
                    onSelectSlot={slotInfo => this.handleShow(slotInfo, 'add')}
                    style={{
                        minHeight: '500px',
                        backgroundColor: '#1e1e1e',
                        color: '#f0f0f0',
                        border: '1px solid #444',
                        padding: '10px',
                        borderRadius: '8px'
                    }}
                    eventPropGetter={this.eventStyle}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { events } = state;
    return { events };
}

export default connect(mapStateToProps)(EventCalendar);
