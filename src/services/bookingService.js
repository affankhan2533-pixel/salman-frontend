import api from './api';

export const bookingService = {
  /**
   * Submit new reservation
   * @param {Object} bookingData
   */
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  /**
   * Fetch all reservations (Admin)
   */
  getBookings: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },

  /**
   * Update reservation status (Accepted / Rejected / Completed)
   * @param {string} id
   * @param {string} status
   */
  updateStatus: async (id, status) => {
    const response = await api.patch(`/bookings/${id}`, { status });
    return response.data;
  },

  /**
   * Delete reservation record
   * @param {string} id
   */
  deleteBooking: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },
};

export default bookingService;
