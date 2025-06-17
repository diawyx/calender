import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import EventDetails from './eventDetails';

import * as eventAction from '../store/eventAction';
import * as types from '../store/eventActionTypes';

BigCalendar.momentLocalizer(moment);
let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])

class EventCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            eventType: 'add',
            newIndex: 0, 
            eventInfo: {},
            darkMode: true 
        }
        // bind semua function
        this.handleHide = this.handleHide.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
        this.addEvent = this.addEvent.bind(this);
        this.updateEvent = this.updateEvent.bind(this);
        this.toggleMode = this.toggleMode.bind(this);
    }

    componentWillMount() {
        this.props.dispatch(eventAction.GetInitialEvents());
    }

    handleHide() { this.setState({ showModal: false }); }
    handleShow(slotInfo, eventType) {
        var currentIndex = this.props.events.allEvents.length;
        this.setState({ showModal: true, eventType, eventInfo: slotInfo, newIndex: currentIndex });
    }

    deleteEvent(id){ this.props.dispatch({ type: types.REMOVE_EVENT, payload: id }); this.setState({ showModal: false }); }
    addEvent(obj){ this.props.dispatch({ type: types.ADD_EVENT, payload: obj }); this.setState({ showModal: false }); }
    updateEvent(obj){ this.props.dispatch({ type: types.UPDATE_EVENT, payload: { id: obj.id, obj } }); this.setState({ showModal: false }); }

    eventStyle(event){
        var bgColor = event.hexColor ? event.hexColor : '#265985';
        return {
            style: {
                backgroundColor: bgColor,
                borderRadius: '5px',
                opacity: 1,
                color: 'white',
                border: '0px',
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

    toggleMode(){
        this.setState(prev => ({ darkMode: !prev.darkMode }));
    }

    render() {
        this.checkReminder();

        const appClass = this.state.darkMode ? 'dark-mode' : 'light-mode';

        return (
            <div className={`bodyContainer ${appClass}`}>
                <h1>📅 Event Calendar</h1>

                <button onClick={this.toggleMode} className="mode-toggle">
                    {this.state.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </button>

                <div className="well">
                    <h3 className="instruction">Instructions</h3>
                    <strong>To add an event:</strong> Click on the day you want to add an event or drag up to the day you want to add the event for multiple day event! <br/>
                    <strong>To update and delete an event:</strong> Click on the event you wish to update or delete!
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
                    style={{ minHeight: '500px' }}
                    eventPropGetter={this.eventStyle}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { events: state.events };
}

export default connect(mapStateToProps)(EventCalendar);
