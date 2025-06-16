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

  componentDidMount() {
    this.interval = setInterval(() => this.checkReminder(), 60000);
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
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

  eventStyle(event, start, end, isSelected) {
    const bgColor = event.hexColor || '#00C9A7';
    const textColor = this.getContrastYIQ(bgColor);

    return {
      style: {
        background: `linear-gradient(135deg, ${bgColor}, #333333)`,
        color: textColor,
        borderRadius: '12px',
        padding: '6px',
        border: '1px solid rgba(255,255,255,0.2)',
        fontWeight: 'bold',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        transition: 'transform 0.2s ease',
      }
    };
  }

  getContrastYIQ(hexcolor) {
    hexcolor = hexcolor.replace('#', '');
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#000000' : '#FFFFFF';
  }

  render() {
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
            eventPropGetter={this.eventStyle.bind(this)}
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

// 🎨 Styling Elegan, Colorful, Glassy, Joss Gandos
const styles = {
  container: {
    background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
    minHeight: '100vh',
    padding: '30px',
    color: '#ffffff',
    fontFamily: 'Segoe UI, sans-serif',
  },
  header: {
    marginBottom: '20px',
    padding: '20px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '15px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    transition: '0.3s ease',
  },
  title: {
    margin: 0,
    color: '#FFCC70',
    fontSize: '26px',
    fontWeight: '700',
    letterSpacing: '1px',
    textShadow: '1px 1px 3px rgba(0,0,0,0.6)'
  },
  instruction: {
    margin: '8px 0',
    color: '#B0BEC5',
    fontSize: '14px',
    lineHeight: '1.6',
    transition: 'color 0.2s ease-in',
  },
  calendarWrapper: {
    background: 'rgba(255, 255, 255, 0.06)',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.12)',
    transition: 'all 0.3s ease-in-out',
  },
  calendar: {
    minHeight: '600px',
    color: '#ffffff',
  }
};
