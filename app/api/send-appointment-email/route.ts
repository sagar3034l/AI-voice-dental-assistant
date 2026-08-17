import AppointmentConfermationEmail from "@/components/emails/AppointmentConfermationEmail";
import resend from "@/lib/resend";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      userEmail,
      doctorName,
      appointmentDate,
      appointmentTime,
      appointmentType,
      duration,
      price,
    } = body;

    if (
      !userEmail ||
      !doctorName ||
      !appointmentDate ||
      !appointmentTime ||
      !appointmentType ||
      !duration ||
      !price
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send email
    const { data, error } = await resend.emails.send({
      from: "Dentwise <no-reply@resend.dev>",
      to: [userEmail],
      subject: "Appointment Confirmation",
      react: AppointmentConfermationEmail({
        doctorName,
        appointmentDate,
        appointmentTime,
        appointmentType,
        duration,
        price,
      }), 
    });

    if (error) {
      console.error("Resend error:", error);

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Email sent successfully",
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected email error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to send email",
      },
      { status: 500 }
    );
  }
}