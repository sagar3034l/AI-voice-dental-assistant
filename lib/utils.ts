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