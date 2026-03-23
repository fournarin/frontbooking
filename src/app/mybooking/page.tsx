'use client';

import { useEffect, useMemo, useState } from 'react';
import { mockMyBookings, type Booking } from '@/libs/mockData';
import Modal from '@/components/Modal';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { type Dayjs } from 'dayjs';

type ModalType = 'update' | 'delete' | null;

export default function MyBookingPage() {
  // Guard to avoid hydration mismatch from MUI DatePicker
  const [isMounted, setIsMounted] = useState(false);

  // Accordion
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);

  // Modals
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Update form
  const [updateDate, setUpdateDate] = useState<Dayjs | null>(null);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const statusColors: Record<string, string> = {
    confirmed: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    cancelled: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
  };

  const timeSlots = useMemo(
    () => Array.from({ length: 13 }, (_, i) => `${i + 9}:00`.padStart(5, '0')),
    []
  );

  const toggleExpand = (id: string) => {
    setExpandedBookingId((cur) => (cur === id ? null : id));
  };

  const openModal = (type: Exclude<ModalType, null>, booking: Booking) => {
    setSelectedBooking(booking);
    setUpdateDate(dayjs(booking.bookingDate));
    setStartTime(booking.startTime);
    setEndTime(booking.endTime);
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedBooking(null);
  };

  const handleUpdate = () => {
    alert(
      `Mockup: Updated booking for ${selectedBooking?.spaceName} to ${updateDate?.format('YYYY-MM-DD')} (${startTime} - ${endTime})`
    );
    closeModal();
  };

  const handleDelete = () => {
    alert(`Mockup: Deleted booking for ${selectedBooking?.spaceName}`);
    closeModal();
  };

  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-16 px-0">
      <div className="mx-auto w-full max-w-none">
        {/* Header */}
        <div className="mb-10 text-center px-4 sm:px-6">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">My Booking</h1>
          <p className="mt-2 text-slate-600">สรุปข้อมูลการจองของคุณ พร้อมแก้ไข (Update) และยกเลิก (Delete)</p>
        </div>

        {/* Main card (full-width rectangle) */}
        <section className="w-full bg-white rounded-none shadow-sm border-y border-slate-200 overflow-hidden">
          <div className="px-6 sm:px-10 py-8 border-b border-slate-100 bg-gradient-to-b from-white to-slate-50">
            <h2 className="text-xl font-bold text-slate-900">Reservations</h2>
            <p className="text-sm text-slate-600 mt-1">คลิกที่รายการเพื่อดูรายละเอียด</p>
          </div>

          <div className="p-4 sm:p-8">
            {mockMyBookings.length === 0 ? (
              <div className="text-center text-slate-600 p-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 max-w-3xl mx-auto">
                <p className="text-lg font-semibold">You have no bookings yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 max-w-5xl mx-auto">
                {mockMyBookings.map((booking) => {
                  const isExpanded = expandedBookingId === booking.id;
                  const statusClass =
                    statusColors[booking.status] ?? 'bg-slate-100 text-slate-700 ring-1 ring-slate-200';

                  return (
                    <article key={booking.id} className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
                      {/* Row summary (full width, rectangular both sides) */}
                      <button
                        type="button"
                        onClick={() => toggleExpand(booking.id)}
                        className="w-full text-left px-5 sm:px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3 flex-wrap">
                            <h3 className="text-xl font-extrabold text-slate-900 truncate">{booking.spaceName}</h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusClass}`}
                            >
                              {booking.status}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-slate-600">
                            <span className="font-semibold text-slate-800">Booking ID:</span> {booking.id}
                          </p>
                        </div>

                        <div className="shrink-0 w-full md:w-auto md:text-right">
                          <p className="text-base font-bold text-slate-800">📅 {booking.bookingDate}</p>
                          <p className="text-sm text-slate-600 mt-1">
                            ⏰ {booking.startTime} - {booking.endTime}
                          </p>
                        </div>

                        <div className="hidden md:flex items-center justify-center w-10 text-slate-400">
                          <svg
                            className={`w-6 h-6 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>

                      {/* Expanded details */}
                      {isExpanded && (
                        <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                            {/* Left: details card */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-5">
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Booking details</p>
                              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-slate-500">Name</p>
                                  <p className="font-semibold text-slate-900">{(booking as any).userName ?? '-'}</p>
                                </div>
                                <div>
                                  <p className="text-slate-500">Tel</p>
                                  <p className="font-semibold text-slate-900">{(booking as any).userTel ?? '-'}</p>
                                </div>
                                <div>
                                  <p className="text-slate-500">Time</p>
                                  <p className="font-semibold text-slate-900">
                                    {booking.startTime} - {booking.endTime}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-slate-500">Total</p>
                                  <p className="font-extrabold text-blue-700">{(booking as any).totalPrice ?? '-'} THB</p>
                                </div>
                              </div>
                            </div>

                            {/* Right: actions */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col">
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</p>
                              <p className="text-sm text-slate-600 mt-2">ต้องการแก้ไขเวลา/วันที่ หรือยกเลิกรายการจอง?</p>

                              <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-3 justify-end">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openModal('update', booking);
                                  }}
                                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 transition-colors shadow-sm"
                                >
                                  Update
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openModal('delete', booking);
                                  }}
                                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-sm"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Update modal */}
      <Modal isOpen={activeModal === 'update'} onClose={closeModal} title="Update Booking">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-100 flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Update Booking</h2>
              <p className="text-sm text-slate-600 mt-1">ปรับวันที่และเวลาให้กับรายการจองนี้</p>
            </div>
            <button
              onClick={closeModal}
              className="shrink-0 rounded-xl px-3 py-2 text-slate-500 hover:bg-slate-100"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border">
            <p className="text-sm text-slate-600">Editing reservation for:</p>
            <p className="font-extrabold text-slate-900 text-lg">{selectedBooking?.spaceName}</p>
          </div>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select New Date"
              value={updateDate}
              onChange={(value) => setUpdateDate(value)}
              className="w-full"
              slotProps={{ textField: { variant: 'standard' } }}
            />
          </LocalizationProvider>

          <div className="grid grid-cols-2 gap-4">
            <FormControl variant="standard" fullWidth>
              <InputLabel>New Start Time</InputLabel>
              <Select value={startTime} onChange={(e) => setStartTime(e.target.value)}>
                {timeSlots.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="standard" fullWidth>
              <InputLabel>New End Time</InputLabel>
              <Select value={endTime} onChange={(e) => setEndTime(e.target.value)}>
                {timeSlots.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="flex justify-end gap-3 mt-2 pt-6 border-t">
            <button onClick={closeModal} className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100">
              Cancel
            </button>
            <button onClick={handleUpdate} className="px-6 py-2.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow">
              Confirm Update
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete modal */}
      <Modal isOpen={activeModal === 'delete'} onClose={closeModal} title="Cancel Reservation?">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-100 flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Cancel Reservation?</h2>
              <p className="text-sm text-slate-600 mt-1">ยืนยันการลบ/ยกเลิกรายการจอง</p>
            </div>
            <button
              onClick={closeModal}
              className="shrink-0 rounded-xl px-3 py-2 text-slate-500 hover:bg-slate-100"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <p className="text-slate-700">Are you sure you want to cancel your reservation for:</p>
          <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
            <p className="font-extrabold text-slate-900 text-lg">{selectedBooking?.spaceName}</p>
            <p className="text-slate-700 text-sm mt-1">📅 {selectedBooking?.bookingDate}</p>
            <p className="text-slate-700 text-sm">⏰ {selectedBooking?.startTime} - {selectedBooking?.endTime}</p>
          </div>
          <p className="text-rose-600 text-sm font-medium">Warning: This action cannot be undone.</p>

          <div className="flex justify-end gap-3 mt-2 pt-6 border-t">
            <button onClick={closeModal} className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100">
              Go Back
            </button>
            <button onClick={handleDelete} className="px-6 py-2.5 rounded-xl font-bold bg-rose-600 text-white hover:bg-rose-700 shadow">
              Yes, Cancel Booking
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
}