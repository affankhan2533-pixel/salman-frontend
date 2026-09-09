import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.currentDate = null;
    this.listeners = new Map();
  }

  getSocketUrl() {
    if (process.env.NEXT_PUBLIC_SOCKET_URL) {
      return process.env.NEXT_PUBLIC_SOCKET_URL;
    }
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '');
    }
    if (process.env.NODE_ENV === 'production') {
      return 'https://salman-backend.onrender.com';
    }
    return 'http://localhost:5000';
  }

  connect() {
    if (this.socket && this.socket.connected) return this.socket;

    if (!this.socket) {
      const socketUrl = this.getSocketUrl();
      this.socket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 10000,
      });

      this.socket.on('connect', () => {
        if (this.currentDate) {
          this.socket.emit('subscribe_date', this.currentDate);
        }
      });

      this.socket.on('connect_error', (err) => {
        /* Silent socket fallback to HTTP polling handled gracefully */
      });
    }

    return this.socket;
  }

  subscribeToDate(dateIso) {
    this.connect();
    if (this.currentDate && this.currentDate !== dateIso) {
      this.socket.emit('unsubscribe_date', this.currentDate);
    }
    this.currentDate = dateIso;
    if (this.socket && this.socket.connected) {
      this.socket.emit('subscribe_date', dateIso);
    }
  }

  onSlotBooked(callback) {
    const s = this.connect();
    s.off('slot_booked');
    s.on('slot_booked', callback);
  }

  onSlotReleased(callback) {
    const s = this.connect();
    s.off('slot_released');
    s.on('slot_released', callback);
  }

  onBookingUpdated(callback) {
    const s = this.connect();
    s.off('booking_updated');
    s.on('booking_updated', callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

const socketService = new SocketService();
export default socketService;
