export interface CoworkingSpace {
  id: string;
  name: string;
  address: string;
  capacity: number;
  pricePerHour: number;
  imageUrl: string;
  // 🎯 เพิ่มฟิลด์ใหม่ตรงนี้ 
  description?: string;
  openTime?: string;
  closeTime?: string;
  tel?: string;
}

export interface Booking {
  id: string;
  spaceId: string;
  spaceName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export const mockSpaces: CoworkingSpace[] = [
  {
    id: "1",
    name: "Hubba Ekkamai",
    address: "Ekkamai Road, Bangkok",
    capacity: 50,
    pricePerHour: 150,
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80",
    description: "A lively and creative coworking space in the heart of Ekkamai. Perfect for startups, freelancers, and small teams looking for an inspiring work environment.",
    openTime: "09:00",
    closeTime: "20:00",
    tel: "02-123-4567"
  },
  {
    id: "2",
    name: "WeWork Asia Centre",
    address: "Sathorn Road, Bangkok",
    capacity: 120,
    pricePerHour: 250,
    imageUrl: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&q=80",
    description: "Premium office spaces with stunning city views. Fully equipped with modern meeting rooms, high-speed internet, and endless coffee.",
    openTime: "08:00",
    closeTime: "22:00",
    tel: "02-987-6543"
  },
  {
    id: "3",
    name: "The Hive Thonglor",
    address: "Thonglor Soi 49, Bangkok",
    capacity: 80,
    pricePerHour: 180,
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80",
    description: "A beautiful, relaxing environment with natural light, rooftop cafe, and comfortable lounge areas. Ideal for deep work and networking.",
    openTime: "09:00",
    closeTime: "18:00",
    tel: "02-333-4444"
  }
];

export const mockMyBookings: Booking[] = [
  {
    id: "b1",
    spaceId: "1",
    spaceName: "Hubba Ekkamai",
    bookingDate: "2024-05-15",
    startTime: "10:00",
    endTime: "14:00",
    status: "confirmed"
  },
  {
    id: "b2",
    spaceId: "2",
    spaceName: "WeWork Asia Centre",
    bookingDate: "2024-05-20",
    startTime: "09:00",
    endTime: "18:00",
    status: "pending"
  }
];