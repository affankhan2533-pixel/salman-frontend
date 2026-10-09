import api from './api';

export const bookingService = {
  /**
   * Fetch live slot availability for a date & service
   * Uses skipRetry: true to let BookingSection enforce the dedicated 70-second cold-start budget
   * without nested interceptor retries.
   * @param {string} date - YYYY-MM-DD
   * @param {string} [service] - Service ID, slug, or title
   * @param {Object} [config] - Axios request options (e.g. signal)
   */
  getAvailability: async (date, service = '', config = {}) => {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (service) params.append('service', service);
    const requestConfig = {
      skipRetry: true,
      ...config,
    };
    const response = await api.get('/appointments/availability?' + params.toString(), requestConfig);
    return response.data;
  },

  /**
   * Submit new reservation
   * @param {Object} bookingData
   */
  createBooking: async (bookingData) => {
    const response = await api.post('/appointments', bookingData);
    return response.data;
  },

  /**
   * Fetch all reservations (Admin)
   */
  getBookings: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },

  /**
   * Update reservation status (Confirmed / Cancelled / Completed)
   * @param {string} id
   * @param {string} status
   */
  updateStatus: async (id, status) => {
    const response = await api.patch('/appointments/' + id + '/status', { appointmentStatus: status });
    return response.data;
  },

  /**
   * Delete reservation record
   * @param {string} id
   */
  deleteBooking: async (id) => {
    const response = await api.delete('/appointments/' + id);
    return response.data;
  },
};

export default bookingService;