'use client';

import { useEffect, useMemo, useState } from 'react';
import { mockMyBookings, type Booking } from '@/libs/mockData';
import Modal from '@/components/Modal';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { type Dayjs } from 'dayjs';

type ModalType = 'update' | 'delete' | null;

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  confirmed: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Confirmed' },
  pending:   { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400',   label: 'Pending'   },
  cancelled: { bg: 'bg-rose-50',    text: 'text-rose-700',    dot: 'bg-rose-500',    label: 'Cancelled' },
};
const FALLBACK = { bg: 'bg-slate-100', text: 'text-slate-500', dot: 'bg-slate-400', label: 'Unknown' };

// ─── Icons ────────────────────────────────────────────────────────────────────
const IcoEdit = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5
         m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
const IcoTrash = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7
         m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const IcoClose = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const IcoWarn = () => (
  <svg className="shrink-0 w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3
         L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);
const IcoChev = ({ open }: { open: boolean }) => (
  <svg className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
    fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);
const IcoCalEmpty = () => (
  <svg className="w-16 h-16 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

// ─── Main component ───────────────────────────────────────────────────────────
export default function MyBookingPage() {
  const [isMounted,       setIsMounted]       = useState(false);
  const [expandedId,      setExpandedId]      = useState<string | null>(null);
  const [activeModal,     setActiveModal]     = useState<ModalType>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [updateDate,      setUpdateDate]      = useState<Dayjs | null>(null);
  const [startTime,       setStartTime]       = useState('10:00');
  const [endTime,         setEndTime]         = useState('12:00');

  useEffect(() => { setIsMounted(true); }, []);

  const timeSlots = useMemo(
    () => Array.from({ length: 13 }, (_, i) => `${String(i + 9).padStart(2, '0')}:00`),
    []
  );

  const openModal = (type: Exclude<ModalType, null>, booking: Booking) => {
    setSelectedBooking(booking);
    setUpdateDate(dayjs(booking.bookingDate));
    setStartTime(booking.startTime);
    setEndTime(booking.endTime);
    setActiveModal(type);
  };
  const closeModal = () => { setActiveModal(null); setSelectedBooking(null); };
  const handleUpdate = () => {
    alert(`Updated "${selectedBooking?.spaceName}" → ${updateDate?.format('YYYY-MM-DD')} · ${startTime}–${endTime}`);
    closeModal();
  };
  const handleDelete = () => {
    alert(`Cancelled booking for "${selectedBooking?.spaceName}"`);
    closeModal();
  };

  if (!isMounted) return null;

  return (
    <>
      {/* ── Global styles injected via style tag ─────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .cuspace-page { font-family: 'DM Sans', sans-serif; }
        .cuspace-heading { font-family: 'DM Serif Display', serif; }

        .booking-row {
          background: #ffffff;
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.15s ease;
        }
        .booking-row:hover { background: #f8fafc; }
        .booking-row.is-open { background: #eef2ff; border-bottom-color: #c7d2fe; }

        .detail-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
        }
        .detail-field {
          border-bottom: 1px solid #f1f5f9;
          border-right: 1px solid #f1f5f9;
          padding: 16px 22px;
          overflow: hidden;
        }
        .detail-field:nth-child(even) { border-right: none; }
        .detail-field:nth-last-child(-n+2) { border-bottom: none; }
        .detail-field dt {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 5px;
          display: block;
        }
        .detail-field dd {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: block;
        }
        .detail-field dd.is-mono {
          font-size: 11px;
          font-family: monospace;
          color: #94a3b8;
          font-weight: 400;
        }
        .detail-field dd.is-accent { color: #4f46e5; font-weight: 700; }

        /* ── Modal card: clean white ── */
        .modal-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          overflow: hidden;
          box-shadow:
            0 4px 6px rgba(0,0,0,0.04),
            0 20px 60px rgba(0,0,0,0.12),
            0 0 0 1px rgba(255,255,255,0.9) inset;
        }

        /* ── Buttons ── */
        .btn-primary-blue {
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          box-shadow: 0 4px 14px rgba(99,102,241,0.35);
          transition: all 0.2s ease;
          color: white;
        }
        .btn-primary-blue:hover {
          box-shadow: 0 6px 20px rgba(99,102,241,0.5);
          transform: translateY(-1px);
        }
        .btn-primary-red {
          background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
          box-shadow: 0 4px 14px rgba(244,63,94,0.35);
          transition: all 0.2s ease;
          color: white;
        }
        .btn-primary-red:hover {
          box-shadow: 0 6px 20px rgba(244,63,94,0.5);
          transform: translateY(-1px);
        }
        .btn-ghost-light {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #64748b;
          transition: all 0.2s ease;
        }
        .btn-ghost-light:hover { background: #f1f5f9; color: #334155; }

        /* legacy ghost keep for rows */
        .btn-ghost {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.2s ease;
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.1); }

        .table-col-header {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        /* ── MUI light theme inside modal ── */
        .light-mui .MuiOutlinedInput-root {
          border-radius: 12px !important;
          background: #f8fafc;
        }
        .light-mui .MuiOutlinedInput-notchedOutline {
          border-color: #cbd5e1 !important;
        }
        .light-mui .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
          border-color: #94a3b8 !important;
        }
        .light-mui .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
          border-color: #6366f1 !important;
        }
        .light-mui .MuiInputLabel-root { color: #94a3b8 !important; }
        .light-mui .MuiInputLabel-root.Mui-focused { color: #6366f1 !important; }
        .light-mui .MuiSelect-select { color: #1e293b !important; font-weight: 500 !important; }

        /* ── Modal header stripe ── */
        .modal-stripe-blue {
          background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
          border-bottom: 1px solid #c7d2fe;
        }
        .modal-stripe-red {
          background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%);
          border-bottom: 1px solid #fecdd3;
        }

        /* ── Summary info box ── */
        .info-box-blue {
          background: #f0f4ff;
          border: 1px solid #c7d2fe;
          border-radius: 14px;
          padding: 14px 18px;
        }
        .info-box-red {
          background: #fff1f2;
          border: 1px solid #fecdd3;
          border-radius: 14px;
        }
        .info-box-warn {
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 12px;
          padding: 14px 18px;
        }
      `}</style>

      <main className="cuspace-page min-h-screen" style={{ background: '#f8fafc' }}>

        {/* ══════════════════════════════════════════
            PAGE HEADER
        ══════════════════════════════════════════ */}
        <div className="pt-28 pb-12 px-6 sm:px-10 lg:px-20 max-w-screen-2xl mx-auto">
          <p className="table-col-header mb-3" style={{ color: '#6366f1', letterSpacing: '0.2em' }}>
            CuSpace · My Account
          </p>
          <h1 className="cuspace-heading text-5xl sm:text-6xl font-normal text-slate-900 leading-tight">
            My Bookings
          </h1>
          <p className="mt-3 text-sm font-light text-slate-500">
            รายการจองทั้งหมดของคุณ · คลิกที่รายการเพื่อดูรายละเอียด แก้ไข หรือยกเลิก
          </p>
        </div>

        {/* ══════════════════════════════════════════
            FULL-WIDTH TABLE
        ══════════════════════════════════════════ */}
        <section className="w-full" style={{ borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', background: '#ffffff' }}>

          {/* Table top bar */}
          <div className="flex items-center justify-between px-6 sm:px-10 lg:px-20 py-4 max-w-screen-2xl mx-auto"
            style={{ borderBottom: '1px solid #f1f5f9' }}>
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
              <span className="table-col-header text-slate-500">
                Reservations
              </span>
            </div>
            <span className="text-xs font-medium tabular-nums text-slate-400">
              {mockMyBookings.length} {mockMyBookings.length === 1 ? 'booking' : 'bookings'}
            </span>
          </div>

          {/* Column labels — desktop */}
          <div className="hidden lg:grid max-w-screen-2xl mx-auto
                          grid-cols-[2rem_1fr_11rem_10rem_8rem_3rem]
                          px-20 py-2.5 gap-x-6"
            style={{ borderBottom: '1px solid #f8fafc', background: '#fafafa' }}>
            <span />
            <span className="table-col-header text-slate-400">Space / Booking ID</span>
            <span className="table-col-header text-slate-400 text-right">Date</span>
            <span className="table-col-header text-slate-400 text-center">Time</span>
            <span className="table-col-header text-slate-400 text-center">Status</span>
            <span />
          </div>

          {/* Empty state */}
          {mockMyBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <svg className="w-16 h-16 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-medium text-slate-400">No bookings yet</p>
            </div>
          ) : (
            <div>
              {mockMyBookings.map((booking, idx) => {
                const isOpen = expandedId === booking.id;
                const cfg    = STATUS[booking.status] ?? FALLBACK;

                return (
                  <article key={booking.id}
                    className="max-w-screen-2xl mx-auto">

                    {/* ── Summary row ── */}
                    <button
                      type="button"
                      onClick={() => setExpandedId(p => p === booking.id ? null : booking.id)}
                      className={`booking-row w-full text-left ${isOpen ? 'is-open' : ''}`}
                    >
                      <div className="px-6 sm:px-10 lg:px-20 py-5
                                      grid grid-cols-[1.5rem_1fr_auto] lg:grid-cols-[2rem_1fr_11rem_10rem_8rem_3rem]
                                      items-center gap-x-6">

                        {/* Index number */}
                        <span className="text-xs font-mono tabular-nums text-center text-slate-300">
                          {String(idx + 1).padStart(2, '0')}
                        </span>

                        {/* Name + ID */}
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h3 className="text-base font-semibold text-slate-900 truncate">
                              {booking.spaceName}
                            </h3>
                            <span className={`lg:hidden shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold
                              uppercase tracking-wider ${cfg.bg} ${cfg.text}`}>
                              {cfg.label}
                            </span>
                          </div>
                          <p className="text-[11px] font-mono mt-0.5 truncate text-slate-400">
                            {booking.id}
                          </p>
                        </div>

                        {/* Date (desktop) */}
                        <p className="hidden lg:block text-sm font-medium text-right shrink-0 tabular-nums text-slate-600">
                          {booking.bookingDate}
                        </p>

                        {/* Time (desktop) */}
                        <p className="hidden lg:block text-sm text-center shrink-0 tabular-nums text-slate-400">
                          {booking.startTime}&thinsp;–&thinsp;{booking.endTime}
                        </p>

                        {/* Status badge (desktop) */}
                        <div className="hidden lg:flex justify-center shrink-0">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                            text-[11px] font-semibold tracking-wide ${cfg.bg} ${cfg.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        </div>

                        {/* Chevron */}
                        <div className="flex justify-center shrink-0">
                          <IcoChev open={isOpen} />
                        </div>
                      </div>
                    </button>

                    {/* ── Expanded panel ── */}
                    {isOpen && (
                      <div className="px-6 sm:px-10 lg:px-20 pt-5 pb-8"
                        style={{ background: '#f0f4ff', borderBottom: '1px solid #c7d2fe' }}>

                        {/* Mobile date/time strip */}
                        <div className="flex lg:hidden items-center gap-3 mb-5 text-xs text-slate-500">
                          <span className="font-semibold text-slate-700">{booking.bookingDate}</span>
                          <span className="text-slate-300">·</span>
                          <span className="tabular-nums">{booking.startTime}–{booking.endTime}</span>
                        </div>

                        {/* Centered grid */}
                        <div className="flex justify-center">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">

                            {/* Details card */}
                            <div className="detail-card md:col-span-2 overflow-hidden">
                              <div className="px-5 py-3.5 flex items-center gap-2"
                                style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                                <span className="w-1 h-1 rounded-full bg-indigo-400 shrink-0" />
                                <p className="table-col-header text-slate-500">
                                  Booking Details
                                </p>
                              </div>
                              <div className="grid grid-cols-2">
                                {([
                                  { label: 'Name',       value: (booking as any).userName  ?? '—'                          },
                                  { label: 'Telephone',  value: (booking as any).userTel   ?? '—'                          },
                                  { label: 'Date',       value: booking.bookingDate                                         },
                                  { label: 'Time',       value: `${booking.startTime} – ${booking.endTime}`                },
                                  { label: 'Total',      value: `${(booking as any).totalPrice ?? '—'} THB`, accent: true  },
                                  { label: 'Booking ID', value: booking.id,                                  mono: true    },
                                ] as { label: string; value: string; accent?: boolean; mono?: boolean }[])
                                  .map(({ label, value, accent, mono }) => (
                                    <div key={label} className="detail-field">
                                      <dt>{label}</dt>
                                      <dd className={`${mono ? 'is-mono' : ''} ${accent ? 'is-accent' : ''}`}>
                                        {value}
                                      </dd>
                                    </div>
                                  ))
                                }
                              </div>
                            </div>

                            {/* Actions card */}
                            <div className="detail-card flex flex-col">
                              <div className="px-5 py-3.5 flex items-center gap-2"
                                style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                                <span className="w-1 h-1 rounded-full bg-indigo-400 shrink-0" />
                                <p className="table-col-header text-slate-500">
                                  Actions
                                </p>
                              </div>
                              <div className="flex-1 p-5 flex flex-col justify-between gap-5">
                                <p className="text-xs leading-relaxed text-slate-500">
                                  ต้องการแก้ไขวันที่หรือเวลา<br />หรือยกเลิกการจองนี้?
                                </p>
                                <div className="flex flex-col gap-3">
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); openModal('update', booking); }}
                                    className="btn-ghost-light w-full inline-flex items-center justify-center gap-2
                                               px-4 py-3 rounded-xl text-sm font-medium"
                                  >
                                    <IcoEdit /> Edit Booking
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); openModal('delete', booking); }}
                                    className="btn-primary-red w-full inline-flex items-center justify-center gap-2
                                               px-4 py-3 rounded-xl text-sm font-semibold text-white"
                                  >
                                    <IcoTrash /> Cancel Booking
                                  </button>
                                </div>
                              </div>
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
        </section>

        {/* ══════════════════════════════════════════
            UPDATE MODAL
        ══════════════════════════════════════════ */}
        <Modal isOpen={activeModal === 'update'} onClose={closeModal}>
          <div className="modal-card w-full max-w-lg light-mui">

            {/* Header stripe */}
            <div className="modal-stripe-blue px-8 pt-8 pb-7 relative overflow-hidden">
              {/* Decorative blob */}
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)' }} />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)' }} />

              <div className="flex items-start justify-between gap-4 relative z-10">
                <div className="min-w-0">
                  {/* Icon pill */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-3"
                    style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                    <IcoEdit />
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-600">Edit Reservation</span>
                  </div>
                  <h2 className="cuspace-heading text-2xl text-slate-900 truncate leading-tight">
                    {selectedBooking?.spaceName}
                  </h2>
                  <p className="text-sm mt-1.5 text-slate-500 tabular-nums">
                    {selectedBooking?.bookingDate}&ensp;·&ensp;
                    {selectedBooking?.startTime}–{selectedBooking?.endTime}
                  </p>
                </div>
                <button onClick={closeModal}
                  className="btn-ghost-light shrink-0 w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700"
                  aria-label="Close">
                  <IcoClose />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-8 py-7 flex flex-col gap-6 bg-white">
              <p className="text-sm text-slate-500">เลือกวันที่และช่วงเวลาใหม่สำหรับการจองนี้</p>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="New Date"
                  value={updateDate}
                  onChange={(v) => setUpdateDate(v)}
                  slotProps={{ textField: { variant: 'outlined', size: 'medium', fullWidth: true } }}
                />
              </LocalizationProvider>

              <div className="grid grid-cols-2 gap-4">
                <FormControl size="medium" fullWidth>
                  <InputLabel>Start Time</InputLabel>
                  <Select label="Start Time" value={startTime} onChange={(e) => setStartTime(e.target.value)}>
                    {timeSlots.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </Select>
                </FormControl>
                <FormControl size="medium" fullWidth>
                  <InputLabel>End Time</InputLabel>
                  <Select label="End Time" value={endTime} onChange={(e) => setEndTime(e.target.value)}>
                    {timeSlots.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </Select>
                </FormControl>
              </div>

              {/* Preview chip */}
              {updateDate && (
                <div className="info-box-blue flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                  <p className="text-sm text-indigo-700 font-medium tabular-nums">
                    {updateDate.format('DD MMM YYYY')}&ensp;·&ensp;{startTime}–{endTime}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-5 flex justify-end gap-3 bg-slate-50"
              style={{ borderTop: '1px solid #f1f5f9' }}>
              <button onClick={closeModal}
                className="btn-ghost-light px-6 py-3 rounded-xl text-base font-medium">
                Cancel
              </button>
              <button onClick={handleUpdate}
                className="btn-primary-blue px-7 py-3 rounded-xl text-base font-semibold">
                  Confirm Update  
              </button>
            </div>
          </div>
        </Modal>

        {/* ══════════════════════════════════════════
            DELETE MODAL
        ══════════════════════════════════════════ */}
        <Modal isOpen={activeModal === 'delete'} onClose={closeModal}>
          <div className="modal-card w-full max-w-lg">

            {/* Header stripe */}
            <div className="modal-stripe-red px-8 pt-8 pb-7 relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.12), transparent 70%)' }} />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.06), transparent 70%)' }} />

              <div className="flex items-start justify-between gap-4 relative z-10">
                <div className="min-w-0">
                  {/* Icon pill */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-3"
                    style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)' }}>
                    <IcoTrash />
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-rose-600">Cancel Reservation</span>
                  </div>
                  <h2 className="cuspace-heading text-2xl text-slate-900 truncate leading-tight">
                    {selectedBooking?.spaceName}
                  </h2>
                  <p className="text-sm mt-1.5 text-slate-500 tabular-nums">
                    {selectedBooking?.bookingDate}&ensp;·&ensp;
                    {selectedBooking?.startTime}–{selectedBooking?.endTime}
                  </p>
                </div>
                <button onClick={closeModal}
                  className="btn-ghost-light shrink-0 w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700"
                  aria-label="Close">
                  <IcoClose />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-8 py-7 flex flex-col gap-5 bg-white">
              <p className="text-sm text-slate-600">คุณต้องการยืนยันการยกเลิกการจองนี้ใช่ไหม?</p>

              {/* Summary box */}
              <div className="info-box-red overflow-hidden">
                <div className="grid grid-cols-2" style={{ borderBottom: '1px solid #fecdd3' }}>
                  <div className="px-6 py-5 min-w-0" style={{ borderRight: '1px solid #fecdd3' }}>
                    <p className="table-col-header mb-2 text-rose-400">Space</p>
                    <p className="text-sm font-semibold text-slate-800 truncate">{selectedBooking?.spaceName}</p>
                  </div>
                  <div className="px-6 py-5 min-w-0">
                    <p className="table-col-header mb-2 text-rose-400">Date</p>
                    <p className="text-sm font-semibold text-slate-800 truncate">{selectedBooking?.bookingDate}</p>
                  </div>
                </div>
                <div className="px-6 py-5">
                  <p className="table-col-header mb-2 text-rose-400">Time Slot</p>
                  <p className="text-sm font-semibold text-slate-800 tabular-nums">
                    {selectedBooking?.startTime} – {selectedBooking?.endTime}
                  </p>
                </div>
              </div>

              {/* Warning banner */}
              <div className="info-box-warn flex items-start gap-3">
                <IcoWarn />
                <p className="text-sm text-amber-800 leading-relaxed">
                  <span className="font-semibold">คำเตือน:</span> การยกเลิกนี้ไม่สามารถเรียกคืนได้ กรุณาตรวจสอบข้อมูลก่อนกดยืนยัน
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 flex justify-end gap-3 bg-slate-50"
              style={{ borderTop: '1px solid #f1f5f9' }}>
              <button onClick={closeModal}
                className="btn-ghost-light px-6 py-3 rounded-xl text-base font-medium">
                Go Back
              </button>
              <button onClick={handleDelete}
                className="btn-primary-red px-7 py-3 rounded-xl text-base font-semibold">
                Yes, Cancel Booking
              </button>
            </div>
          </div>
        </Modal>

      </main>
    </>
  );
}