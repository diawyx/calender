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
    var currentIndex = this.props.events.allEvents.length;
    this.setState({
      showModal: true,
      eventType: eventType,
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
    const bgColor = event.hexColor || '#4A90E2';
    return {
      style: {
        backgroundColor: bgColor,
        borderRadius: '8px',
        padding: '4px',
        color: 'white',
        border: 'none',
        fontWeight: 'bold',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
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
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>📅 Petunjuk Penggunaan</h2>
          <p style={styles.instruction}>➕ Menambahkan event: Klik tanggal yang diinginkan atau drag event multi-hari</p>
          <p style={styles.instruction}>✏️ Mengedit / 🗑 Menghapus event: Klik event yang ingin diedit atau dihapus</p>
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

        <div style={styles.calendarWrapper}>
          <BigCalendar
            selectable
            events={this.props.events.allEvents}
            views={allViews}
            step={60}
            showMultiDayTimes
            defaultDate={new Date(moment())}
            onSelectEvent={event => this.handleShow(event, 'edit')}
            onSelectSlot={slotInfo => this.handleShow(slotInfo, 'add')}
            style={styles.calendar}
            eventPropGetter={this.eventStyle}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    events: state.events
  };
}

export default connect(mapStateToProps)(EventCalendar);

// 🎨 Styling Elegan (dark mode)
const styles = {
  container: {
    backgroundColor: '#121212',
    minHeight: '100vh',
    padding: '30px',
    color: '#E0E0E0',
    fontFamily: 'Segoe UI, sans-serif',
  },
  header: {
    marginBottom: '20px',
    padding: '20px',
    backgroundColor: '#1F1F1F',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  title: {
    margin: 0,
    color: '#90CAF9',
    fontSize: '24px',
    fontWeight: '600'
  },
  instruction: {
    margin: '8px 0',
    color: '#B0BEC5',
    fontSize: '14px'
  },
  calendarWrapper: {
    backgroundColor: '#1E1E1E',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 3px 10px rgba(0,0,0,0.5)',
  },
  calendar: {
    minHeight: '600px',
    color: 'white'
  }
};
