'use client';

import { useState } from 'react';
import Modal from '@/components/Modal';
import { TextField, FormControl, Select, MenuItem } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

export default function TestBookingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState<Dayjs | null>(dayjs());
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');

  const timeSlots = Array.from({ length: 13 }, (_, i) => `${i + 9}:00`.padStart(5, '0'));

  // ฟังก์ชันช่วยจัดสไตล์ MUI TextField ให้ดูนุ่มนวล
  const styledInput = (placeholder: string) => ({
    fullWidth: true,
    variant: 'standard' as const,
    placeholder: placeholder,
    InputProps: {
      disableUnderline: true,
      className: "bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm focus-within:ring-2 focus-within:ring-blue-100 transition-all",
    }
  });

  return (
    <main className="min-h-screen bg-slate-50 p-8 pt-24 flex flex-col items-center">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Create Booking UI</h1>
        <p className="text-slate-500 mt-2">หน้านี้จำลองปุ่มและ Pop-up สำหรับการจอง</p>
      </div>

      <button 
        onClick={() => setIsModalOpen(true)}
        className="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-4 px-12 rounded-full hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 shadow-lg"
      >
        Open Booking Form
      </button>

      {/* 🎯 Modal Create Booking */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] p-10 max-w-md w-full shadow-2xl relative border border-white/50 flex flex-col gap-6">
          
          <div className="text-center mb-2">
            <h2 className="text-3xl font-extrabold text-slate-900">Book Space</h2>
            <p className="text-slate-500 text-sm mt-1">Enter details for your reservation</p>
          </div>
          
          <div className="flex flex-col gap-4">
            <TextField {...styledInput("Your Name")} defaultValue="Narinthon"/>
            <TextField {...styledInput("Contact Number")} defaultValue="0812345678"/>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker 
                value={bookingDate} 
                onChange={(value) => setBookingDate(value)} 
                className="w-full"
                slotProps={{ textField: { ...styledInput("Select Date") } }}
              />
            </LocalizationProvider>
            
            <div className="grid grid-cols-2 gap-4">
              <FormControl variant="standard" fullWidth>
                <Select value={startTime} onChange={(e) => setStartTime(e.target.value)} disableUnderline className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-sm">
                  {timeSlots.map(time => <MenuItem key={time} value={time}>{time}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl variant="standard" fullWidth>
                <Select value={endTime} onChange={(e) => setEndTime(e.target.value)} disableUnderline className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-sm">
                  {timeSlots.map(time => <MenuItem key={time} value={time}>{time}</MenuItem>)}
                </Select>
              </FormControl>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <button 
              onClick={() => { alert('Success!'); setIsModalOpen(false); }} 
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 text-lg"
            >
              Confirm Booking
            </button>
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="w-full text-center text-slate-400 hover:text-slate-600 font-medium py-3 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
}