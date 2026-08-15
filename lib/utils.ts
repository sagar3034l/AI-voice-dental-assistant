import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateAvatar(name: string, gender: "MALE" | "FEMALE"){ 
  const username = name.trim().replace(/\s+/g, "-").toLowerCase(); 
  const style = gender === "MALE" ? "male" : "female"; 
  return `https://api.dicebear.com/9.x/personas/svg?seed=${encodeURIComponent(username)}&gender=${style}`; 
}

export function formatPhoneNumber(value: string) {
  if (!value) return value;

  const phoneNumber = value.replace(/\D/g, "").slice(0, 10);

  if (phoneNumber.length <= 5) {
    return phoneNumber;
  }
  return `${phoneNumber.slice(0, 5)} ${phoneNumber.slice(5)}`;
}

export const getNext5Days = () => {
  const dates = [];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  for (let i = 0; i < 5; i++) {
    const date = new Date(tomorrow);
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split("T")[0]);
  }

  return dates;
};

export const getTimeSlots = (): string[] => {
  const slots: string[] = [];

  for (let hour = 9; hour <= 16; hour++) {
    for (let minute of [0, 30]) {
      if (hour === 16 && minute > 30) continue;

      slots.push(
        `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`
      );
    }
  }
  return slots;
};

export const APPOINTMENT_TYPES = [
  {id: "checkup", name: "Regular Checkup", duration:"60 min", price: "$120"},
  {id: "cleanup", name: "Teeth Cleaning", duration:"45 min", price: "$90"},
  {id: "consultation", name: "Consultation", duration:"30 min", price: "$75"},
  {id: "emergency", name: "Emergency Visit", duration:"30 min", price: "$150"}
]
