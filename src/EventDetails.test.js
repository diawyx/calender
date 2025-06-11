import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import moment from 'moment';
import emailjs from '@emailjs/browser';

import EventDetails from './containers/eventDetails'; // Komponen yang diuji

// --- MOCKING ---

// FIX: Menggunakan pendekatan auto-mocking Jest yang lebih andal.
// Jest akan secara otomatis mengganti semua fungsi di dalam modul dengan mock kosong.
jest.mock('@emailjs/browser');

// Mock library `react-datetime`
jest.mock('react-datetime', () => {
  const moment = require('moment'); 
  return (props) => (
    <input
        data-testid="datetime-mock"
        value={moment(props.value).format('YYYY-MM-DD')}
        onChange={(e) => props.onChange(moment(e.target.value))}
    />
  );
});

// Mock library `react-bootstrap`
jest.mock('react-bootstrap', () => {
  const MockComponent = ({ children, ...props }) => <div {...props}>{children}</div>;
  
  const MockModal = ({ show, onHide, children }) => show ? <div data-testid="modal">{children}</div> : null;
  MockModal.Header = (props) => <MockComponent {...props} />;
  MockModal.Title = (props) => <MockComponent {...props} />;
  MockModal.Body = (props) => <MockComponent {...props} />;
  MockModal.Footer = (props) => <MockComponent {...props} />;

  return {
    Modal: MockModal,
    Button: ({ onClick, children, ...props }) => <button onClick={onClick} {...props}>{children}</button>,
  };
});

// --- TES UNTUK EVENTDETAILS.JS ---

describe('EventDetails Component', () => {
    // Mock window.alert() sebelum semua tes berjalan
    beforeAll(() => {
        jest.spyOn(window, 'alert').mockImplementation(() => {});
    });

    // Siapkan props default yang akan digunakan di banyak tes
    const mockHandleHide = jest.fn();
    const mockAddEvent = jest.fn();
    const mockUpdateEvent = jest.fn();
    const mockDeleteEvent = jest.fn();

    const defaultAddProps = {
        showModal: true,
        handleHide: mockHandleHide,
        eventType: 'add',
        eventInfo: { start: new Date(), end: new Date() },
        newIndex: 10,
        addEvent: mockAddEvent,
        updateEvent: mockUpdateEvent,
        deleteEvent: mockDeleteEvent,
    };

    const defaultEditProps = {
        ...defaultAddProps,
        eventType: 'edit',
        eventInfo: {
            id: 1,
            title: 'Existing Event',
            start: new Date(),
            end: new Date(),
            notes: 'Some notes here',
        },
    };

    // Bersihkan semua mock setelah setiap tes
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the form correctly in "add" mode', () => {
        render(<EventDetails {...defaultAddProps} />);
        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter the Event Name')).toHaveValue('');
        expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
    });

    it('renders the form with event data in "edit" mode', () => {
        render(<EventDetails {...defaultEditProps} />);
        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter the Event Name')).toHaveValue('Existing Event');
        expect(screen.getByPlaceholderText('Event Notes')).toHaveValue('Some notes here');
        expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });

    it('updates state when user types in the event name input', () => {
        render(<EventDetails {...defaultAddProps} />);
        const eventNameInput = screen.getByPlaceholderText('Enter the Event Name');
        fireEvent.change(eventNameInput, { target: { value: 'My New Event' } });
        expect(eventNameInput).toHaveValue('My New Event');
    });

    it('calls addEvent prop function when "Add" button is clicked', () => {
        render(<EventDetails {...defaultAddProps} />);
        fireEvent.click(screen.getByRole('button', { name: 'Add' }));
        expect(mockAddEvent).toHaveBeenCalledTimes(1);
    });

    it('calls updateEvent prop function when "Update" button is clicked', () => {
        render(<EventDetails {...defaultEditProps} />);
        fireEvent.click(screen.getByRole('button', { name: 'Update' }));
        expect(mockUpdateEvent).toHaveBeenCalledTimes(1);
    });

    it('calls deleteEvent prop function when "Delete" button is clicked', () => {
        render(<EventDetails {...defaultEditProps} />);
        fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
        expect(mockDeleteEvent).toHaveBeenCalledWith(defaultEditProps.eventInfo.id);
    });

    it('calls handleHide prop function when "Close" button is clicked', () => {
        render(<EventDetails {...defaultAddProps} />);
        fireEvent.click(screen.getByText('Close'));
        expect(mockHandleHide).toHaveBeenCalledTimes(1);
    });

    it('sends an email when email form is submitted', async () => {
        // FIX: Tentukan implementasi mock di dalam tes untuk memastikan ia mengembalikan Promise
        emailjs.send.mockResolvedValue({ status: 200, text: 'OK' });

        render(<EventDetails {...defaultEditProps} />);
        const emailInput = screen.getByPlaceholderText('Email Penerima');
        const messageInput = screen.getByPlaceholderText('Pesan');
        const sendButton = screen.getByRole('button', { name: 'Kirim Email' });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(messageInput, { target: { value: 'Ini adalah pesan tes' } });
        fireEvent.click(sendButton);

        // Tunggu hingga pemanggilan fungsi selesai
        await waitFor(() => {
            expect(emailjs.send).toHaveBeenCalledTimes(1);
        });
        
        expect(emailjs.send).toHaveBeenCalledWith(
            'service_dzf4rqg',
            'template_udeia4f',
            {
                to_email: 'test@example.com',
                message: 'Ini adalah pesan tes',
                event_title: 'Existing Event'
            },
            'TiIAUd56-gOt4yPxz'
        );
    });
});
