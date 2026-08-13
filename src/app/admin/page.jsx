'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  User,
  Scissors,
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
  LogOut,
  Phone,
  MessageCircle,
  AlertCircle,
  X,
  Check,
  ChevronRight,
  Filter,
  Layers,
  Menu,
  Plus,
  Edit,
  Trash2,
  Tag,
  DollarSign,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Upload,
} from 'lucide-react';

const getApiBaseUrl = () => {
  const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  return raw.replace(/\/api\/?$/, '');
};

const SERVICE_CATEGORIES = ['Haircuts', 'Coloring', 'Treatments', 'Styling'];
const GALLERY_CATEGORIES = ['Haircuts', 'Styling', 'Coloring', 'Treatments', 'Salon', 'Other'];

export default function AdminPage() {
  const router = useRouter();

  // Auth states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [user, setUser] = useState(null);

  // Mobile sidebar toggle
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Main navigation: 'appointments' | 'content'
  const [primaryTab, setPrimaryTab] = useState('appointments');

  // Content sub-navigation: 'services' | 'gallery'
  const [contentSubTab, setContentSubTab] = useState('services');

  // Appointments sub-navigation views: 'today' | 'upcoming' | 'pending' | 'all'
  const [apptView, setApptView] = useState('today');

  // Appointments Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  // Appointments Data & Pagination states
  const [appointments, setAppointments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, pages: 1, hasMore: false });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Selected appointment for detail drawer
  const [selectedAppt, setSelectedAppt] = useState(null);

  // Confirmation modal state for appointment cancellation
  const [confirmCancelAppt, setConfirmCancelAppt] = useState(null);

  // ==========================================
  // SERVICES CMS STATES
  // ==========================================
  const [servicesList, setServicesList] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesSearch, setServicesSearch] = useState('');
  const [debouncedServiceSearch, setDebouncedServiceSearch] = useState('');
  const [serviceStatusFilter, setServiceStatusFilter] = useState('');

  // Service Modal (Add / Edit)
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    category: 'Haircuts',
    price: '',
    duration: '60',
    description: '',
    isActive: true,
  });
  const [serviceFormErrors, setServiceFormErrors] = useState({});
  const [savingService, setSavingService] = useState(false);

  // Delete Service Confirmation Modal
  const [confirmDeleteService, setConfirmDeleteService] = useState(null);
  const [deletingServiceId, setDeletingServiceId] = useState(null);

  // ==========================================
  // GALLERY CMS STATES (Phase 19B.2)
  // ==========================================
  const [galleryList, setGalleryList] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState('');
  const [galleryVisibilityFilter, setGalleryVisibilityFilter] = useState('');

  // Gallery Modal (Add / Edit)
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState(null);
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    category: 'Haircuts',
    isVisible: true,
    order: 0,
    imageUrl: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [galleryFormErrors, setGalleryFormErrors] = useState({});
  const [savingGallery, setSavingGallery] = useState(false);

  // Delete Gallery Confirmation Modal
  const [confirmDeleteGalleryItem, setConfirmDeleteGalleryItem] = useState(null);
  const [deletingGalleryId, setDeletingGalleryId] = useState(null);

  // Toast notification
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // 1. Auth verification
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('atelier_access_token');
      if (!token || token === 'undefined' || token === 'null') {
        localStorage.removeItem('atelier_access_token');
        router.push('/admin/login');
        return;
      }

      try {
        const API_URL = getApiBaseUrl();
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok && data.data) {
          setIsAuthenticated(true);
          setUser(data.data);
        } else {
          localStorage.removeItem('atelier_access_token');
          router.push('/admin/login');
        }
      } catch (err) {
        localStorage.removeItem('atelier_access_token');
        router.push('/admin/login');
      } finally {
        setAuthChecking(false);
      }
    };

    verifyAuth();
  }, [router]);

  // Debounce appointment search input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Debounce service search input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedServiceSearch(servicesSearch.trim());
    }, 300);
    return () => clearTimeout(handler);
  }, [servicesSearch]);

  // 2. Fetch appointments
  const fetchAppointments = useCallback(
    async (isLoadMore = false) => {
      if (!isAuthenticated) return;
      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);
      setErrorMsg('');

      const token = localStorage.getItem('atelier_access_token');
      const API_URL = getApiBaseUrl();
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const fetchPage = isLoadMore ? page : 1;
        let url = `${API_URL}/api/appointments?page=${fetchPage}&limit=25`;

        let activeDateRange = '';
        let activeStatus = statusFilter;

        if (apptView === 'today') {
          activeDateRange = 'today';
        } else if (apptView === 'upcoming') {
          activeDateRange = 'upcoming';
        } else if (apptView === 'pending') {
          activeStatus = 'Pending';
        } else if (apptView === 'all') {
          activeDateRange = 'all';
        }

        if (activeDateRange) url += `&dateRange=${activeDateRange}`;
        if (activeStatus) url += `&status=${activeStatus}`;
        if (debouncedSearch) url += `&search=${encodeURIComponent(debouncedSearch)}`;

        const res = await fetch(url, { headers });
        const data = await res.json();

        if (res.ok && data.success) {
          const list = data.data || [];
          if (isLoadMore) {
            setAppointments((prev) => [...prev, ...list]);
          } else {
            setAppointments(list);
          }
          if (data.pagination) setPagination(data.pagination);
        } else {
          setErrorMsg('Unable to load appointments.');
        }
      } catch (err) {
        console.error('[Admin Fetch Error]', err);
        setErrorMsg('Unable to load appointments.');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [isAuthenticated, apptView, statusFilter, debouncedSearch, page]
  );

  useEffect(() => {
    if (isAuthenticated && primaryTab === 'appointments') {
      fetchAppointments(false);
    }
  }, [isAuthenticated, primaryTab, apptView, statusFilter, debouncedSearch]);

  const handleLoadMore = () => {
    if (pagination.hasMore && !loadingMore) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (page > 1 && primaryTab === 'appointments') {
      fetchAppointments(true);
    }
  }, [page]);

  // ==========================================
  // SERVICES CMS API FUNCTIONS
  // ==========================================
  const fetchServices = useCallback(async () => {
    if (!isAuthenticated) return;
    setServicesLoading(true);

    const token = localStorage.getItem('atelier_access_token');
    const API_URL = getApiBaseUrl();
    const headers = { Authorization: `Bearer ${token}` };

    try {
      let url = `${API_URL}/api/services?limit=100`;
      if (serviceStatusFilter) url += `&active=${serviceStatusFilter}`;
      if (debouncedServiceSearch) url += `&search=${encodeURIComponent(debouncedServiceSearch)}`;

      const res = await fetch(url, { headers });
      const data = await res.json();

      if (res.ok && data.success) {
        setServicesList(data.data || []);
      } else {
        showToast(data.message || 'Failed to load services');
      }
    } catch (err) {
      console.error('[Services Fetch Error]', err);
      showToast('Network error loading services.');
    } finally {
      setServicesLoading(false);
    }
  }, [isAuthenticated, serviceStatusFilter, debouncedServiceSearch]);

  useEffect(() => {
    if (isAuthenticated && primaryTab === 'content' && contentSubTab === 'services') {
      fetchServices();
    }
  }, [isAuthenticated, primaryTab, contentSubTab, serviceStatusFilter, debouncedServiceSearch]);

  const handleOpenAddService = () => {
    setEditingService(null);
    setServiceForm({
      title: '',
      category: 'Haircuts',
      price: '',
      duration: '60',
      description: '',
      isActive: true,
    });
    setServiceFormErrors({});
    setServiceModalOpen(true);
  };

  const handleOpenEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      title: service.title || '',
      category: service.category || 'Haircuts',
      price: service.price !== undefined ? String(service.price) : '',
      duration: service.duration !== undefined ? String(service.duration) : '60',
      description: service.description || '',
      isActive: service.isActive !== undefined ? service.isActive : true,
    });
    setServiceFormErrors({});
    setServiceModalOpen(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!serviceForm.title.trim()) errors.title = 'Service name is required';
    if (!serviceForm.category.trim()) errors.category = 'Category is required';

    const numPrice = Number(serviceForm.price);
    if (serviceForm.price === '' || isNaN(numPrice) || numPrice < 0) {
      errors.price = 'Price must be a valid non-negative number';
    }

    const numDuration = Number(serviceForm.duration);
    if (serviceForm.duration === '' || isNaN(numDuration) || numDuration <= 0) {
      errors.duration = 'Duration must be a positive number of minutes';
    }

    if (Object.keys(errors).length > 0) {
      setServiceFormErrors(errors);
      return;
    }

    setSavingService(true);
    setServiceFormErrors({});

    const token = localStorage.getItem('atelier_access_token');
    const API_URL = getApiBaseUrl();
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const payload = {
      title: serviceForm.title.trim(),
      category: serviceForm.category.trim(),
      price: numPrice,
      duration: numDuration,
      description: serviceForm.description.trim(),
      isActive: serviceForm.isActive,
    };

    try {
      const url = editingService
        ? `${API_URL}/api/services/${editingService._id}`
        : `${API_URL}/api/services`;
      const method = editingService ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(editingService ? 'Service updated successfully.' : 'Service created successfully.');
        setServiceModalOpen(false);
        fetchServices();
      } else {
        showToast(data.message || 'Failed to save service.');
      }
    } catch (err) {
      console.error('[Save Service Error]', err);
      showToast('Network error while saving service.');
    } finally {
      setSavingService(false);
    }
  };

  const handleToggleServiceActive = async (service) => {
    const token = localStorage.getItem('atelier_access_token');
    const API_URL = getApiBaseUrl();

    try {
      const res = await fetch(`${API_URL}/api/services/${service._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !service.isActive }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Service status updated to ${!service.isActive ? 'Active' : 'Inactive'}`);
        fetchServices();
      } else {
        showToast(data.message || 'Failed to update service status');
      }
    } catch (err) {
      console.error('[Toggle Service Error]', err);
      showToast('Network error');
    }
  };

  const handleDeleteService = async () => {
    if (!confirmDeleteService) return;

    setDeletingServiceId(confirmDeleteService._id);
    const token = localStorage.getItem('atelier_access_token');
    const API_URL = getApiBaseUrl();

    try {
      const res = await fetch(`${API_URL}/api/services/${confirmDeleteService._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Service deleted successfully.');
        setConfirmDeleteService(null);
        fetchServices();
      } else {
        showToast(data.message || 'Cannot delete service.');
      }
    } catch (err) {
      console.error('[Delete Service Error]', err);
      showToast('Network error while deleting service.');
    } finally {
      setDeletingServiceId(null);
    }
  };

  // ==========================================
  // GALLERY CMS API FUNCTIONS (Phase 19B.2)
  // ==========================================
  const fetchGallery = useCallback(async () => {
    if (!isAuthenticated) return;
    setGalleryLoading(true);

    const token = localStorage.getItem('atelier_access_token');
    const API_URL = getApiBaseUrl();
    const headers = { Authorization: `Bearer ${token}` };

    try {
      let url = `${API_URL}/api/gallery?limit=100`;
      if (galleryCategoryFilter) url += `&category=${encodeURIComponent(galleryCategoryFilter)}`;
      if (galleryVisibilityFilter) url += `&visible=${galleryVisibilityFilter}`;

      const res = await fetch(url, { headers });
      const data = await res.json();

      if (res.ok && data.success) {
        setGalleryList(data.data || []);
      } else {
        showToast(data.message || 'Failed to load gallery images.');
      }
    } catch (err) {
      console.error('[Gallery Fetch Error]', err);
      showToast('Network error loading gallery images.');
    } finally {
      setGalleryLoading(false);
    }
  }, [isAuthenticated, galleryCategoryFilter, galleryVisibilityFilter]);

  useEffect(() => {
    if (isAuthenticated && primaryTab === 'content' && contentSubTab === 'gallery') {
      fetchGallery();
    }
  }, [isAuthenticated, primaryTab, contentSubTab, galleryCategoryFilter, galleryVisibilityFilter]);

  // Open Add Gallery Modal
  const handleOpenAddGallery = () => {
    setEditingGalleryItem(null);
    setGalleryForm({
      title: '',
      category: 'Haircuts',
      isVisible: true,
      order: galleryList.length,
      imageUrl: '',
    });
    setSelectedFile(null);
    setFilePreview('');
    setGalleryFormErrors({});
    setGalleryModalOpen(true);
  };

  // Open Edit Gallery Modal
  const handleOpenEditGallery = (item) => {
    setEditingGalleryItem(item);
    setGalleryForm({
      title: item.title || '',
      category: item.category || 'Haircuts',
      isVisible: item.isVisible !== undefined ? item.isVisible : true,
      order: item.order !== undefined ? item.order : 0,
      imageUrl: item.imageUrl || '',
    });
    setSelectedFile(null);
    setFilePreview(item.imageUrl || '');
    setGalleryFormErrors({});
    setGalleryModalOpen(true);
  };

  // Handle File Selection with Validation & Preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      setGalleryFormErrors({ image: 'Please select a valid image file (JPEG, PNG, WebP).' });
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setGalleryFormErrors({ image: 'Image size exceeds 10MB limit.' });
      return;
    }

    setGalleryFormErrors({});
    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file));
  };

  // Save Gallery Image Handler (Add / Edit)
  const handleSaveGallery = async (e) => {
    e.preventDefault();

    if (!editingGalleryItem && !selectedFile && !galleryForm.imageUrl) {
      setGalleryFormErrors({ image: 'Please select an image file to upload.' });
      return;
    }

    setSavingGallery(true);
    setGalleryFormErrors({});

    const token = localStorage.getItem('atelier_access_token');
    const API_URL = getApiBaseUrl();

    try {
      const url = editingGalleryItem
        ? `${API_URL}/api/gallery/${editingGalleryItem._id}`
        : `${API_URL}/api/gallery`;
      const method = editingGalleryItem ? 'PUT' : 'POST';

      let res;

      if (selectedFile) {
        // Upload multipart form data
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('title', galleryForm.title);
        formData.append('category', galleryForm.category);
        formData.append('isVisible', galleryForm.isVisible);
        formData.append('order', galleryForm.order);

        res = await fetch(url, {
          method,
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      } else {
        // Send JSON metadata update
        res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(galleryForm),
        });
      }

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(editingGalleryItem ? 'Gallery image updated successfully.' : 'Gallery image added successfully.');
        setGalleryModalOpen(false);
        fetchGallery();
      } else {
        showToast(data.message || 'Failed to save gallery image.');
      }
    } catch (err) {
      console.error('[Save Gallery Error]', err);
      showToast('Network error while saving gallery image.');
    } finally {
      setSavingGallery(false);
    }
  };

  // Toggle Gallery Visibility (Visible / Hidden)
  const handleToggleGalleryVisibility = async (item) => {
    const token = localStorage.getItem('atelier_access_token');
    const API_URL = getApiBaseUrl();

    try {
      const res = await fetch(`${API_URL}/api/gallery/${item._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isVisible: !item.isVisible }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Image status updated to ${!item.isVisible ? 'Visible' : 'Hidden'}`);
        fetchGallery();
      } else {
        showToast(data.message || 'Failed to update visibility');
      }
    } catch (err) {
      console.error('[Toggle Visibility Error]', err);
      showToast('Network error');
    }
  };

  // Reorder Gallery Image (Move Up / Move Down)
  const handleMoveGalleryOrder = async (item, direction) => {
    const token = localStorage.getItem('atelier_access_token');
    const API_URL = getApiBaseUrl();

    const currentOrder = item.order !== undefined ? item.order : 0;
    const newOrder = direction === 'up' ? Math.max(0, currentOrder - 1) : currentOrder + 1;

    try {
      const res = await fetch(`${API_URL}/api/gallery/${item._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order: newOrder }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Image order position updated.');
        fetchGallery();
      } else {
        showToast(data.message || 'Failed to reorder image');
      }
    } catch (err) {
      console.error('[Reorder Error]', err);
      showToast('Network error');
    }
  };

  // Delete Gallery Image Handler
  const handleDeleteGalleryItem = async () => {
    if (!confirmDeleteGalleryItem) return;

    setDeletingGalleryId(confirmDeleteGalleryItem._id);
    const token = localStorage.getItem('atelier_access_token');
    const API_URL = getApiBaseUrl();

    try {
      const res = await fetch(`${API_URL}/api/gallery/${confirmDeleteGalleryItem._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Gallery image deleted successfully.');
        setConfirmDeleteGalleryItem(null);
        fetchGallery();
      } else {
        showToast(data.message || 'Failed to delete gallery image.');
      }
    } catch (err) {
      console.error('[Delete Gallery Error]', err);
      showToast('Network error while deleting image.');
    } finally {
      setDeletingGalleryId(null);
    }
  };

  // Handle Sub-view navigation change for Appointments
  const handleViewChange = (view) => {
    setApptView(view);
    setPage(1);
    if (view === 'pending') {
      setStatusFilter('Pending');
    } else {
      setStatusFilter('');
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('atelier_access_token');
    router.push('/admin/login');
  };

  // Appointment Status Change Handler
  const handleStatusChange = async (appointmentId, newStatus) => {
    setActionLoadingId(appointmentId);
    const token = localStorage.getItem('atelier_access_token');
    const API_URL = getApiBaseUrl();

    try {
      const res = await fetch(`${API_URL}/api/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ appointmentStatus: newStatus }),
      });

      const data = await res.json();
      if (res.ok) {
        const msg =
          newStatus === 'Confirmed'
            ? 'Appointment confirmed.'
            : newStatus === 'Cancelled'
            ? 'Appointment cancelled.'
            : newStatus === 'Completed'
            ? 'Appointment completed.'
            : `Appointment updated to ${newStatus}.`;

        showToast(msg);

        setAppointments((prev) =>
          prev.map((item) =>
            item._id === appointmentId
              ? { ...item, appointmentStatus: newStatus, effectiveStatus: newStatus }
              : item
          )
        );

        if (selectedAppt && selectedAppt._id === appointmentId) {
          setSelectedAppt((prev) =>
            prev ? { ...prev, appointmentStatus: newStatus, effectiveStatus: newStatus } : null
          );
        }
      } else {
        showToast(data?.message || `Failed to update status to ${newStatus}`);
      }
    } catch (err) {
      console.error('[Status Change Error]', err);
      showToast('Network error. Please try again.');
    } finally {
      setActionLoadingId(null);
      setConfirmCancelAppt(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return { label: 'CONFIRMED', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'Completed':
        return { label: 'COMPLETED', bg: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'Cancelled':
        return { label: 'CANCELLED', bg: 'bg-rose-50 text-rose-800 border-rose-200' };
      case 'Expired':
        return { label: 'EXPIRED', bg: 'bg-gray-100 text-gray-600 border-gray-200' };
      case 'Pending':
      default:
        return { label: 'PENDING', bg: 'bg-amber-50 text-amber-900 border-amber-200' };
    }
  };

  const getEmptyMessage = () => {
    if (debouncedSearch) return `No appointments match your search.`;
    if (apptView === 'today') return 'No appointments today.';
    if (apptView === 'upcoming') return 'No upcoming appointments.';
    if (apptView === 'pending') return 'No pending appointments.';
    return 'No appointments found.';
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#1F1F1C] flex flex-col items-center justify-center p-6 text-white font-body">
        <RefreshCw className="w-8 h-8 text-champagne animate-spin mb-4" />
        <p className="font-heading text-sm uppercase tracking-widest text-warm-gray">Verifying Session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-charcoal flex flex-col md:flex-row font-body select-none relative">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-[#1F1F1C] text-white text-xs font-medium px-5 py-3 rounded-2xl shadow-xl border border-champagne/30 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-champagne shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* MOBILE TOP BAR */}
      <div className="md:hidden bg-[#1F1F1C] text-white p-4 flex items-center justify-between z-30 shadow-md">
        <div>
          <h1 className="font-heading text-base tracking-widest uppercase text-champagne font-normal">
            SALMAN HAIR STUDIO
          </h1>
          <p className="text-[9px] text-white/50 tracking-wider uppercase">Salon Control Panel</p>
        </div>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-2 text-white/80 hover:text-white rounded-xl bg-white/10"
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`w-full md:w-64 bg-[#1F1F1C] text-white flex flex-col justify-between shrink-0 shadow-lg z-30 ${
          mobileNavOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        <div>
          <div className="hidden md:block p-6 border-b border-white/10">
            <h1 className="font-heading text-lg tracking-widest uppercase text-champagne font-normal">
              SALMAN HAIR STUDIO
            </h1>
            <p className="text-[10px] text-white/50 tracking-wider uppercase mt-0.5">
              Salon Control Panel
            </p>
          </div>

          <nav className="p-4 space-y-2">
            <button
              onClick={() => {
                setPrimaryTab('appointments');
                setMobileNavOpen(false);
              }}
              className={`w-full min-h-[44px] px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-medium flex items-center gap-3 transition-all cursor-pointer ${
                primaryTab === 'appointments'
                  ? 'bg-champagne text-charcoal font-semibold shadow'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Appointments</span>
            </button>

            <button
              onClick={() => {
                setPrimaryTab('content');
                setMobileNavOpen(false);
              }}
              className={`w-full min-h-[44px] px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-medium flex items-center gap-3 transition-all cursor-pointer ${
                primaryTab === 'content'
                  ? 'bg-champagne text-charcoal font-semibold shadow'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Content</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-white/10">
          {user && (
            <div className="px-2 py-1 mb-3">
              <p className="text-xs font-semibold text-white truncate">{user.name || 'Salon Staff'}</p>
              <p className="text-[10px] text-champagne uppercase tracking-wider">{user.role || 'Admin'}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full min-h-[44px] px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-medium bg-white/10 hover:bg-rose-900/40 text-white/80 hover:text-rose-200 transition-all flex items-center justify-center gap-2 border border-white/5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN WORKSPACE AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* PRIMARY AREA 1: APPOINTMENTS */}
        {primaryTab === 'appointments' && (
          <div className="p-4 sm:p-8 space-y-6 max-w-5xl w-full mx-auto">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-heading text-2xl sm:text-3xl text-charcoal uppercase tracking-tight">
                    Appointments
                  </h2>
                  <p className="text-xs text-warm-gray">Salon customer reservations</p>
                </div>

                <button
                  onClick={() => fetchAppointments(false)}
                  className="self-start sm:self-auto min-h-[44px] px-4 py-2 bg-white border border-charcoal/15 rounded-xl text-xs font-medium text-charcoal hover:bg-champagne/20 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                  title="Refresh Appointments"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-champagne' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-charcoal/10">
                {[
                  { key: 'today', label: 'Today' },
                  { key: 'upcoming', label: 'Upcoming' },
                  { key: 'pending', label: 'Pending' },
                  { key: 'all', label: 'All' },
                ].map((tab) => {
                  const isActive = apptView === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => handleViewChange(tab.key)}
                      className={`min-h-[44px] px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-semibold transition-all shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-[#1F1F1C] text-white shadow-md'
                          : 'bg-white text-warm-gray border border-charcoal/10 hover:text-charcoal hover:bg-ivory'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-charcoal/10 shadow-sm">
                <div className="relative sm:col-span-2">
                  <Search className="w-4 h-4 text-warm-gray absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="Search customer, phone or booking reference..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-8 min-h-[44px] bg-[#F7F4EE] border border-charcoal/15 rounded-xl text-xs text-charcoal focus:outline-none focus:border-champagne"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-3.5 text-warm-gray hover:text-charcoal cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(1);
                    }}
                    className="w-full min-h-[44px] px-4 bg-[#F7F4EE] border border-charcoal/15 rounded-xl text-xs text-charcoal focus:outline-none focus:border-champagne cursor-pointer"
                  >
                    <option value="">Status: All</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white p-4 sm:p-5 rounded-2xl border border-charcoal/10 shadow-sm animate-pulse space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-charcoal/10 rounded w-1/4" />
                      <div className="h-4 bg-charcoal/10 rounded w-1/6" />
                    </div>
                    <div className="h-5 bg-charcoal/15 rounded w-1/3" />
                    <div className="h-4 bg-charcoal/10 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : errorMsg ? (
              <div className="bg-rose-50 border border-rose-200 p-8 rounded-2xl text-center space-y-4">
                <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
                <p className="text-sm font-medium text-rose-900">{errorMsg}</p>
                <button
                  onClick={() => fetchAppointments(false)}
                  className="min-h-[44px] px-6 py-2 bg-rose-700 text-white text-xs font-semibold uppercase tracking-wider rounded-xl shadow cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            ) : appointments.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-charcoal/10 text-center space-y-3 shadow-sm">
                <Calendar className="w-10 h-10 text-warm-gray/40 mx-auto" />
                <p className="font-heading text-lg text-charcoal uppercase">{getEmptyMessage()}</p>
                <p className="text-xs text-warm-gray">New bookings will appear here automatically.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((appt) => {
                  const effectiveStatus = appt.effectiveStatus || appt.appointmentStatus;
                  const badge = getStatusBadge(effectiveStatus);
                  const serviceTitle = appt.service?.title || 'Hair Styling';
                  const duration = appt.duration ? `${appt.duration} min` : '60 min';

                  return (
                    <div
                      key={appt._id}
                      onClick={() => setSelectedAppt(appt)}
                      className="bg-white p-4 sm:p-5 rounded-2xl border border-charcoal/10 hover:border-champagne/60 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2.5 relative"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 font-num text-sm sm:text-base font-bold text-charcoal">
                          <Clock className="w-4 h-4 text-champagne shrink-0" />
                          <span>{appt.startTime}</span>
                          <span className="text-xs font-normal text-warm-gray">
                            · {appt.date}
                          </span>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${badge.bg}`}
                        >
                          {badge.label}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-heading text-lg sm:text-xl text-charcoal font-normal">
                            {appt.clientName}
                          </h3>
                          <div className="text-xs text-warm-gray flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                            <span className="font-medium text-charcoal">{serviceTitle}</span>
                            <span>· {duration}</span>
                            <span>· {appt.clientPhone}</span>
                          </div>
                        </div>

                        {appt.bookingRef && (
                          <span className="font-num text-xs font-bold text-champagne tracking-widest shrink-0 pt-1">
                            {appt.bookingRef}
                          </span>
                        )}
                      </div>

                      <div className="pt-1.5 border-t border-charcoal/5 flex items-center justify-between text-xs text-champagne font-medium">
                        <span>Tap to view details &amp; actions</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  );
                })}

                {pagination.hasMore && (
                  <div className="pt-4 text-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="min-h-[44px] px-8 py-3 bg-white border border-charcoal/20 hover:bg-champagne/10 text-charcoal font-semibold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
                    >
                      {loadingMore ? 'Loading More...' : 'Load More Appointments'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* PRIMARY AREA 2: CONTENT (SERVICES & GALLERY CMS) */}
        {primaryTab === 'content' && (
          <div className="p-4 sm:p-8 space-y-6 max-w-5xl w-full mx-auto">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-heading text-2xl sm:text-3xl text-charcoal uppercase tracking-tight">
                    Content Management
                  </h2>
                  <p className="text-xs text-warm-gray">Maintain salon services, pricing &amp; gallery</p>
                </div>

                {contentSubTab === 'services' ? (
                  <button
                    onClick={handleOpenAddService}
                    className="self-start sm:self-auto min-h-[44px] px-5 py-2.5 bg-[#1F1F1C] text-white hover:bg-champagne hover:text-charcoal rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 shadow cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Service</span>
                  </button>
                ) : (
                  <button
                    onClick={handleOpenAddGallery}
                    className="self-start sm:self-auto min-h-[44px] px-5 py-2.5 bg-[#1F1F1C] text-white hover:bg-champagne hover:text-charcoal rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 shadow cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Image</span>
                  </button>
                )}
              </div>

              {/* CONTENT SUB-NAV TABS */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-charcoal/10">
                <button
                  onClick={() => setContentSubTab('services')}
                  className={`min-h-[44px] px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-semibold transition-all shrink-0 cursor-pointer ${
                    contentSubTab === 'services'
                      ? 'bg-[#1F1F1C] text-white shadow-md'
                      : 'bg-white text-warm-gray border border-charcoal/10 hover:text-charcoal hover:bg-ivory'
                  }`}
                >
                  Services
                </button>

                <button
                  onClick={() => setContentSubTab('gallery')}
                  className={`min-h-[44px] px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-semibold transition-all shrink-0 cursor-pointer ${
                    contentSubTab === 'gallery'
                      ? 'bg-[#1F1F1C] text-white shadow-md'
                      : 'bg-white text-warm-gray border border-charcoal/10 hover:text-charcoal hover:bg-ivory'
                  }`}
                >
                  Gallery
                </button>
              </div>
            </div>

            {/* SUB-TAB 1: SERVICES CMS */}
            {contentSubTab === 'services' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-charcoal/10 shadow-sm">
                  <div className="relative sm:col-span-2">
                    <Search className="w-4 h-4 text-warm-gray absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="Search services by name or category..."
                      value={servicesSearch}
                      onChange={(e) => setServicesSearch(e.target.value)}
                      className="w-full pl-10 pr-8 min-h-[44px] bg-[#F7F4EE] border border-charcoal/15 rounded-xl text-xs text-charcoal focus:outline-none focus:border-champagne"
                    />
                    {servicesSearch && (
                      <button
                        onClick={() => setServicesSearch('')}
                        className="absolute right-3 top-3.5 text-warm-gray hover:text-charcoal cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <select
                      value={serviceStatusFilter}
                      onChange={(e) => setServiceStatusFilter(e.target.value)}
                      className="w-full min-h-[44px] px-4 bg-[#F7F4EE] border border-charcoal/15 rounded-xl text-xs text-charcoal focus:outline-none focus:border-champagne cursor-pointer"
                    >
                      <option value="">Status: All</option>
                      <option value="true">Active Only</option>
                      <option value="false">Inactive Only</option>
                    </select>
                  </div>
                </div>

                {servicesLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white p-5 rounded-2xl border border-charcoal/10 animate-pulse space-y-2">
                        <div className="h-5 bg-charcoal/15 rounded w-1/3" />
                        <div className="h-4 bg-charcoal/10 rounded w-1/4" />
                      </div>
                    ))}
                  </div>
                ) : servicesList.length === 0 ? (
                  <div className="bg-white p-12 rounded-2xl border border-charcoal/10 text-center space-y-3 shadow-sm">
                    <Scissors className="w-10 h-10 text-warm-gray/40 mx-auto" />
                    <p className="font-heading text-lg text-charcoal uppercase">No services found</p>
                    <p className="text-xs text-warm-gray">Click "+ ADD SERVICE" to create a new salon service.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {servicesList.map((srv) => (
                      <div
                        key={srv._id}
                        className="bg-white p-4 sm:p-5 rounded-2xl border border-charcoal/10 hover:border-champagne/60 shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4">
                            <h3 className="font-heading text-lg sm:text-xl text-charcoal font-medium break-words leading-snug">
                              {srv.title}
                            </h3>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border shrink-0 ${
                                srv.isActive
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : 'bg-gray-100 text-gray-600 border-gray-200'
                              }`}
                            >
                              {srv.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-warm-gray">
                            <span className="font-medium text-charcoal bg-[#F7F4EE] px-2 py-0.5 rounded border border-charcoal/5">
                              {srv.category}
                            </span>
                            <span className="font-num font-bold text-champagne">
                              ₹{Number(srv.price).toLocaleString('en-IN')}
                            </span>
                            <span>· {srv.duration} min</span>
                          </div>

                          {srv.description && (
                            <p className="text-xs text-warm-gray line-clamp-1 italic mt-1">
                              &ldquo;{srv.description}&rdquo;
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-charcoal/5">
                          <button
                            onClick={() => handleToggleServiceActive(srv)}
                            className={`min-h-[44px] px-3 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                              srv.isActive
                                ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            }`}
                            title="Toggle Active Status"
                          >
                            {srv.isActive ? 'Deactivate' : 'Activate'}
                          </button>

                          <button
                            onClick={() => handleOpenEditService(srv)}
                            className="min-h-[44px] px-3.5 py-2 bg-gray-100 hover:bg-charcoal hover:text-white text-charcoal rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => setConfirmDeleteService(srv)}
                            className="min-h-[44px] px-3.5 py-2 bg-rose-50 hover:bg-rose-700 hover:text-white text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SUB-TAB 2: GALLERY CMS (Phase 19B.2) */}
            {contentSubTab === 'gallery' && (
              <div className="space-y-4">
                {/* GALLERY FILTERS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-charcoal/10 shadow-sm">
                  <div>
                    <select
                      value={galleryCategoryFilter}
                      onChange={(e) => setGalleryCategoryFilter(e.target.value)}
                      className="w-full min-h-[44px] px-4 bg-[#F7F4EE] border border-charcoal/15 rounded-xl text-xs text-charcoal focus:outline-none focus:border-champagne cursor-pointer"
                    >
                      <option value="">Category: All</option>
                      {GALLERY_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <select
                      value={galleryVisibilityFilter}
                      onChange={(e) => setGalleryVisibilityFilter(e.target.value)}
                      className="w-full min-h-[44px] px-4 bg-[#F7F4EE] border border-charcoal/15 rounded-xl text-xs text-charcoal focus:outline-none focus:border-champagne cursor-pointer"
                    >
                      <option value="">Visibility: All</option>
                      <option value="true">Visible Only</option>
                      <option value="false">Hidden Only</option>
                    </select>
                  </div>
                </div>

                {/* GALLERY GRID */}
                {galleryLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="bg-white rounded-2xl p-3 border border-charcoal/10 animate-pulse space-y-2">
                        <div className="w-full aspect-[4/3] bg-charcoal/15 rounded-xl" />
                        <div className="h-4 bg-charcoal/10 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : galleryList.length === 0 ? (
                  <div className="bg-white p-12 rounded-2xl border border-charcoal/10 text-center space-y-3 shadow-sm">
                    <ImageIcon className="w-10 h-10 text-warm-gray/40 mx-auto" />
                    <p className="font-heading text-lg text-charcoal uppercase">No gallery images found</p>
                    <p className="text-xs text-warm-gray">Click "+ ADD IMAGE" to upload gallery showcase images.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {galleryList.map((item, idx) => (
                      <div
                        key={item._id}
                        className="bg-white rounded-2xl p-4 border border-charcoal/10 hover:border-champagne/60 shadow-sm transition-all flex flex-col justify-between space-y-3"
                      >
                        {/* Thumbnail & Badges */}
                        <div className="space-y-2.5">
                          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-charcoal/5 border border-charcoal/10">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.title || 'Gallery showcase'}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-warm-gray/40">
                                <ImageIcon className="w-8 h-8" />
                              </div>
                            )}

                            <span
                              className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border shadow-sm ${
                                item.isVisible
                                  ? 'bg-emerald-900/90 text-emerald-100 border-emerald-500'
                                  : 'bg-gray-900/90 text-gray-300 border-gray-600'
                              }`}
                            >
                              {item.isVisible ? 'Visible' : 'Hidden'}
                            </span>

                            <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-black/70 text-white backdrop-blur-xs">
                              Order #{item.order !== undefined ? item.order : idx}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <h4 className="font-heading text-base text-charcoal font-medium line-clamp-1">
                              {item.title || 'Showcase Image'}
                            </h4>
                            <span className="text-[11px] font-medium text-warm-gray bg-[#F7F4EE] px-2 py-0.5 rounded border border-charcoal/5">
                              {item.category}
                            </span>
                          </div>
                        </div>

                        {/* Actions (Reorder, Visibility, Edit, Delete) */}
                        <div className="pt-2 border-t border-charcoal/5 flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleMoveGalleryOrder(item, 'up')}
                              className="w-9 h-9 bg-gray-100 hover:bg-charcoal hover:text-white rounded-lg flex items-center justify-center text-charcoal transition-all cursor-pointer"
                              title="Move Up in Order"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleMoveGalleryOrder(item, 'down')}
                              className="w-9 h-9 bg-gray-100 hover:bg-charcoal hover:text-white rounded-lg flex items-center justify-center text-charcoal transition-all cursor-pointer"
                              title="Move Down in Order"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleToggleGalleryVisibility(item)}
                              className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                                item.isVisible
                                  ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                              }`}
                              title={item.isVisible ? 'Hide from Public Gallery' : 'Show on Public Gallery'}
                            >
                              {item.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>

                            <button
                              onClick={() => handleOpenEditGallery(item)}
                              className="w-9 h-9 bg-gray-100 hover:bg-charcoal hover:text-white text-charcoal rounded-lg flex items-center justify-center transition-all cursor-pointer"
                              title="Edit Image Metadata"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setConfirmDeleteGalleryItem(item)}
                              className="w-9 h-9 bg-rose-50 hover:bg-rose-700 hover:text-white text-rose-700 border border-rose-200 rounded-lg flex items-center justify-center transition-all cursor-pointer"
                              title="Delete Image"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* APPOINTMENT DETAILS DRAWER */}
      {selectedAppt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="absolute inset-0" onClick={() => setSelectedAppt(null)} />

          <div className="relative w-full sm:max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto p-6 sm:p-8 space-y-6 z-10">
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 border-b border-charcoal/10 pb-4">
                <div>
                  <span className="text-[10px] text-champagne font-bold tracking-widest uppercase block mb-1">
                    APPOINTMENT DETAILS
                  </span>
                  <h3 className="font-heading text-2xl text-charcoal font-normal">
                    {selectedAppt.clientName}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedAppt(null)}
                  className="w-10 h-10 rounded-full bg-[#F7F4EE] hover:bg-[#1F1F1C] hover:text-white transition-all flex items-center justify-center cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-between bg-[#F7F4EE] p-4 rounded-2xl border border-charcoal/5">
                <div>
                  <span className="text-[10px] text-warm-gray uppercase tracking-wider block">
                    Booking Reference
                  </span>
                  <span className="font-num font-bold text-lg text-charcoal tracking-wider">
                    {selectedAppt.bookingRef || '—'}
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                    getStatusBadge(selectedAppt.effectiveStatus || selectedAppt.appointmentStatus).bg
                  }`}
                >
                  {getStatusBadge(selectedAppt.effectiveStatus || selectedAppt.appointmentStatus).label}
                </span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm font-body">
                <div className="flex justify-between py-1.5 border-b border-charcoal/5">
                  <span className="text-warm-gray">Service:</span>
                  <strong className="text-charcoal font-medium">
                    {selectedAppt.service?.title || 'Hair Styling'}
                  </strong>
                </div>

                <div className="flex justify-between py-1.5 border-b border-charcoal/5">
                  <span className="text-warm-gray">Duration:</span>
                  <strong className="text-charcoal font-medium">
                    {selectedAppt.duration ? `${selectedAppt.duration} min` : '60 min'}
                  </strong>
                </div>

                <div className="flex justify-between py-1.5 border-b border-charcoal/5">
                  <span className="text-warm-gray">Date &amp; Time:</span>
                  <strong className="text-charcoal font-medium">
                    {selectedAppt.date} at {selectedAppt.startTime}
                  </strong>
                </div>

                <div className="flex justify-between py-1.5 border-b border-charcoal/5">
                  <span className="text-warm-gray">Stylist:</span>
                  <strong className="text-charcoal font-medium">
                    {selectedAppt.stylist?.name || 'Salman Malik'}
                  </strong>
                </div>

                <div className="flex justify-between py-1.5 border-b border-charcoal/5">
                  <span className="text-warm-gray">Price:</span>
                  <strong className="text-champagne font-bold font-num">
                    ₹{selectedAppt.price || selectedAppt.service?.price || '3,500'}
                  </strong>
                </div>
              </div>

              <div className="bg-[#F7F4EE] p-4 rounded-2xl border border-charcoal/10 space-y-3">
                <span className="text-[10px] text-warm-gray uppercase tracking-wider font-semibold block">
                  Customer Contact
                </span>

                <div className="flex items-center justify-between">
                  <a
                    href={`tel:${selectedAppt.clientPhone}`}
                    className="font-medium text-charcoal hover:text-champagne underline"
                  >
                    {selectedAppt.clientPhone}
                  </a>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${selectedAppt.clientPhone}`}
                      className="min-h-[44px] px-3 py-2 bg-[#1F1F1C] text-white rounded-xl hover:bg-champagne hover:text-charcoal transition-all text-xs flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-champagne" />
                      <span>Call</span>
                    </a>

                    <a
                      href={`https://wa.me/${selectedAppt.clientPhone.replace(
                        /\D/g,
                        ''
                      )}?text=${encodeURIComponent(
                        `Hello ${selectedAppt.clientName}, regarding your appointment at Salman Hair Studio on ${selectedAppt.date} at ${selectedAppt.startTime} (Ref: ${selectedAppt.bookingRef}).`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] px-3 py-2 bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 transition-all text-xs flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

                {selectedAppt.clientEmail && (
                  <p className="text-xs text-warm-gray">{selectedAppt.clientEmail}</p>
                )}
              </div>

              {selectedAppt.notes && (
                <div className="space-y-1">
                  <span className="text-[10px] text-warm-gray uppercase tracking-wider font-semibold block">
                    Customer Notes
                  </span>
                  <p className="text-xs text-charcoal bg-[#F7F4EE] p-3 rounded-xl border border-charcoal/10 leading-relaxed">
                    {selectedAppt.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-charcoal/10">
              {(() => {
                const currentStatus = selectedAppt.effectiveStatus || selectedAppt.appointmentStatus;
                const isUpdating = actionLoadingId === selectedAppt._id;

                if (isUpdating) {
                  return (
                    <div className="flex items-center justify-center gap-2 text-xs text-warm-gray py-3">
                      <RefreshCw className="w-4 h-4 animate-spin text-champagne" />
                      <span>Updating appointment...</span>
                    </div>
                  );
                }

                if (currentStatus === 'Pending') {
                  return (
                    <div className="grid grid-cols-2 gap-3 w-full">
                      <button
                        onClick={() => handleStatusChange(selectedAppt._id, 'Confirmed')}
                        className="min-h-[44px] px-4 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow"
                      >
                        <Check className="w-4 h-4" />
                        <span>Confirm</span>
                      </button>

                      <button
                        onClick={() => setConfirmCancelAppt(selectedAppt)}
                        className="min-h-[44px] px-4 py-3 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  );
                }

                if (
                  currentStatus === 'Confirmed' ||
                  currentStatus === 'Checked In' ||
                  currentStatus === 'In Progress'
                ) {
                  return (
                    <div className="grid grid-cols-2 gap-3 w-full">
                      <button
                        onClick={() => handleStatusChange(selectedAppt._id, 'Completed')}
                        className="min-h-[44px] px-4 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Complete</span>
                      </button>

                      <button
                        onClick={() => setConfirmCancelAppt(selectedAppt)}
                        className="min-h-[44px] px-4 py-3 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="text-center py-2 text-xs text-warm-gray italic">
                    No actions available for {currentStatus} status.
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM CANCELLATION MODAL */}
      {confirmCancelAppt && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 text-center space-y-4 shadow-2xl border border-rose-200">
            <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
            <div className="space-y-1">
              <h4 className="font-heading text-xl text-charcoal uppercase">Cancel Appointment?</h4>
              <p className="text-xs text-warm-gray">
                This will release the time slot ({confirmCancelAppt.startTime}) back into salon availability.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setConfirmCancelAppt(null)}
                className="min-h-[44px] px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-charcoal rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                Keep
              </button>
              <button
                onClick={() => handleStatusChange(confirmCancelAppt._id, 'Cancelled')}
                className="min-h-[44px] px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer shadow"
              >
                Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT SERVICE MODAL */}
      {serviceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-champagne/30 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-charcoal/10 pb-4">
              <div>
                <span className="text-[10px] text-champagne font-bold tracking-widest uppercase block mb-1">
                  SERVICES CMS
                </span>
                <h3 className="font-heading text-2xl text-charcoal uppercase">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h3>
              </div>
              <button
                onClick={() => setServiceModalOpen(false)}
                className="w-10 h-10 rounded-full bg-[#F7F4EE] hover:bg-[#1F1F1C] hover:text-white transition-all flex items-center justify-center cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-charcoal uppercase tracking-wider">
                  Service Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bespoke Precision Haircut"
                  value={serviceForm.title}
                  onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                  className="w-full min-h-[44px] px-4 bg-[#F7F4EE] border border-charcoal/15 rounded-xl text-xs text-charcoal focus:outline-none focus:border-champagne"
                />
                {serviceFormErrors.title && (
                  <p className="text-[11px] text-rose-600 font-medium mt-0.5">{serviceFormErrors.title}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-charcoal uppercase tracking-wider">
                  Category <span className="text-rose-600">*</span>
                </label>
                <select
                  value={serviceForm.category}
                  onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                  className="w-full min-h-[44px] px-4 bg-[#F7F4EE] border border-charcoal/15 rounded-xl text-xs text-charcoal focus:outline-none focus:border-champagne cursor-pointer"
                >
                  {SERVICE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {serviceFormErrors.category && (
                  <p className="text-[11px] text-rose-600 font-medium mt-0.5">{serviceFormErrors.category}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-charcoal uppercase tracking-wider">
                    Price (₹) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 3500"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    className="w-full min-h-[44px] px-4 bg-[#F7F4EE] border border-charcoal/15 rounded-xl text-xs text-charcoal focus:outline-none focus:border-champagne font-num"
                  />
                  {serviceFormErrors.price && (
                    <p className="text-[11px] text-rose-600 font-medium mt-0.5">{serviceFormErrors.price}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-charcoal uppercase tracking-wider">
                    Duration (mins) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 60"
                    value={serviceForm.duration}
                    onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                    className="w-full min-h-[44px] px-4 bg-[#F7F4EE] border border-charcoal/15 rounded-xl text-xs text-charcoal focus:outline-none focus:border-champagne font-num"
                  />
                  {serviceFormErrors.duration && (
                    <p className="text-[11px] text-rose-600 font-medium mt-0.5">{serviceFormErrors.duration}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-charcoal uppercase tracking-wider">
                  Short Description
                </label>
                <textarea
                  rows="3"
                  placeholder="e.g. Architectural precision sculpting tailored to facial bone structure."
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  className="w-full p-3 bg-[#F7F4EE] border border-charcoal/15 rounded-xl text-xs text-charcoal focus:outline-none focus:border-champagne leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#F7F4EE] rounded-xl border border-charcoal/10">
                <span className="text-xs font-semibold text-charcoal">Active Status</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={serviceForm.isActive}
                    onChange={(e) => setServiceForm({ ...serviceForm, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-champagne focus:ring-champagne cursor-pointer"
                  />
                  <span className="text-xs font-medium text-charcoal">
                    {serviceForm.isActive ? 'Active (Selectable)' : 'Inactive (Hidden)'}
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-charcoal/10">
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
                  className="min-h-[44px] px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-charcoal rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingService}
                  className="min-h-[44px] px-4 py-2.5 bg-[#1F1F1C] hover:bg-champagne hover:text-charcoal text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {savingService ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingService ? 'Update Service' : 'Save Service'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE SERVICE MODAL */}
      {confirmDeleteService && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 text-center space-y-4 shadow-2xl border border-rose-200">
            <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
            <div className="space-y-1">
              <h4 className="font-heading text-xl text-charcoal uppercase">Delete Service?</h4>
              <p className="text-xs text-warm-gray font-medium">
                &ldquo;{confirmDeleteService.title}&rdquo;
              </p>
              <p className="text-[11px] text-warm-gray">
                If this service is linked to existing appointments, deletion will be blocked safely.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setConfirmDeleteService(null)}
                className="min-h-[44px] px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-charcoal rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteService}
                disabled={deletingServiceId === confirmDeleteService._id}
                className="min-h-[44px] px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer shadow flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {deletingServiceId === confirmDeleteService._id ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Service</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT GALLERY IMAGE MODAL (Phase 19B.2) */}
      {galleryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-champagne/30 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-charcoal/10 pb-4">
              <div>
                <span className="text-[10px] text-champagne font-bold tracking-widest uppercase block mb-1">
                  GALLERY CMS
                </span>
                <h3 className="font-heading text-2xl text-charcoal uppercase">
                  {editingGalleryItem ? 'Edit Gallery Image' : 'Add Gallery Image'}
                </h3>
              </div>
              <button
                onClick={() => setGalleryModalOpen(false)}
                className="w-10 h-10 rounded-full bg-[#F7F4EE] hover:bg-[#1F1F1C] hover:text-white transition-all flex items-center justify-center cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGallery} className="space-y-4">
              {/* Image Upload Input & Live Preview */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-charcoal uppercase tracking-wider block">
                  Gallery Image <span className="text-rose-600">*</span>
                </label>

                {filePreview ? (
                  <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-charcoal/5 border border-charcoal/15 shadow-inner group">
                    <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setFilePreview('');
                      }}
                      className="absolute top-3 right-3 p-2 bg-black/70 text-white rounded-full hover:bg-rose-700 transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-charcoal/20 hover:border-champagne bg-[#F7F4EE] hover:bg-white rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all">
                    <Upload className="w-8 h-8 text-champagne" />
                    <span className="text-xs font-semibold text-charcoal">Click to upload image file</span>
                    <span className="text-[10px] text-warm-gray">Supports JPEG, PNG, WebP (Max 10MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}

                {galleryFormErrors.image && (
                  <p className="text-[11px] text-rose-600 font-medium mt-0.5">{galleryFormErrors.image}</p>
                )}
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-charcoal uppercase tracking-wider">
                  Optional Title / Collection Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Architectural Sculpted Waves"
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  className="w-full min-h-[44px] px-4 bg-[#F7F4EE] border border-charcoal/15 rounded-xl text-xs text-charcoal focus:outline-none focus:border-champagne"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-charcoal uppercase tracking-wider">
                  Category <span className="text-rose-600">*</span>
                </label>
                <select
                  value={galleryForm.category}
                  onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                  className="w-full min-h-[44px] px-4 bg-[#F7F4EE] border border-charcoal/15 rounded-xl text-xs text-charcoal focus:outline-none focus:border-champagne cursor-pointer"
                >
                  {GALLERY_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Order Position */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-charcoal uppercase tracking-wider">
                  Display Order Position
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 0"
                  value={galleryForm.order}
                  onChange={(e) => setGalleryForm({ ...galleryForm, order: e.target.value })}
                  className="w-full min-h-[44px] px-4 bg-[#F7F4EE] border border-charcoal/15 rounded-xl text-xs text-charcoal focus:outline-none focus:border-champagne font-num"
                />
              </div>

              {/* Visibility Toggle */}
              <div className="flex items-center justify-between p-3 bg-[#F7F4EE] rounded-xl border border-charcoal/10">
                <span className="text-xs font-semibold text-charcoal">Public Visibility</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={galleryForm.isVisible}
                    onChange={(e) => setGalleryForm({ ...galleryForm, isVisible: e.target.checked })}
                    className="w-4 h-4 rounded text-champagne focus:ring-champagne cursor-pointer"
                  />
                  <span className="text-xs font-medium text-charcoal">
                    {galleryForm.isVisible ? 'Visible (Public)' : 'Hidden (Private)'}
                  </span>
                </label>
              </div>

              {/* Form Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-charcoal/10">
                <button
                  type="button"
                  onClick={() => setGalleryModalOpen(false)}
                  className="min-h-[44px] px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-charcoal rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingGallery}
                  className="min-h-[44px] px-4 py-2.5 bg-[#1F1F1C] hover:bg-champagne hover:text-charcoal text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {savingGallery ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving Image...</span>
                    </>
                  ) : (
                    <span>{editingGalleryItem ? 'Update Image' : 'Publish Image'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE GALLERY ITEM MODAL */}
      {confirmDeleteGalleryItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 text-center space-y-4 shadow-2xl border border-rose-200">
            <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
            <div className="space-y-1">
              <h4 className="font-heading text-xl text-charcoal uppercase">Delete Gallery Image?</h4>
              <p className="text-xs text-warm-gray font-medium">
                This record will be permanently deleted from the database.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setConfirmDeleteGalleryItem(null)}
                className="min-h-[44px] px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-charcoal rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteGalleryItem}
                disabled={deletingGalleryId === confirmDeleteGalleryItem._id}
                className="min-h-[44px] px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer shadow flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {deletingGalleryId === confirmDeleteGalleryItem._id ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
