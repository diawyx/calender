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
            darkMode: true,  
            time: new Date()
        }
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

    componentDidMount() {
        // ✅ update jam tiap detik
        this.timer = setInterval(() => this.setState({ time: new Date() }), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    handleHide() {
        this.setState({ showModal: false });
    }

    handleShow(slotInfo, eventType) {
        var currentIndex = this.props.events.allEvents.length;
        this.setState(
            { showModal: true, eventType: eventType, eventInfo: slotInfo, newIndex: currentIndex }
        );
    }

    deleteEvent(id){
        this.props.dispatch({
            type: types.REMOVE_EVENT,
            payload: id
        });
        this.setState({showModal: false});
    }

    addEvent(obj){
        this.props.dispatch({
            type: types.ADD_EVENT,
            payload: obj
        });
        this.setState({showModal: false});
    }

    updateEvent(obj){
        this.props.dispatch({
            type: types.UPDATE_EVENT,
            payload: { id: obj.id, obj: obj }
        });
        this.setState({showModal: false});
    }

    eventStyle(event){
        var bgColor = event.hexColor ? event.hexColor : '#4caf50';
        return {
            style: {
                backgroundColor: bgColor,
                borderRadius: '8px',
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
                        body: `Event "${event.title}" dimulai dalam ${Math.ceil(timeDiff)} menit!`,
                        icon: '/icon.png'
                    });
                }
                event.notified = true;
            }
        });
    }

    toggleMode() {
        this.setState(prev => ({ darkMode: !prev.darkMode }));
    }

    render() {
        this.checkReminder();
        const appClass = this.state.darkMode ? 'dark-mode' : 'light-mode';

        return (
            <div className={`bodyContainer ${appClass}`}>
                <div className="header">
                    <div className="clock">{this.state.time.toLocaleTimeString()}</div>
                    <label className="switch">
  <input
    type="checkbox"
    checked={this.state.darkMode}
    onChange={this.toggleMode}
  />
  <span className="slider round"></span>
</label>

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
                    style={{ minHeight: '600px' }}
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
