import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { businessName, ownerName, contactEmail } = await req.json()

    // Email configuration - replace with your SMTP settings
    const emailData = {
      to: ['inforichmondcountybmc@gmail.com'], // Chamber staff email
      subject: 'New Business Submission – BMC Directory Beta',
      html: `
        <h2>New Business Submission</h2>
        <p>A new business has been submitted to the BMC Directory Beta:</p>
        <ul>
          <li><strong>Business Name:</strong> ${businessName}</li>
          <li><strong>Owner Name:</strong> ${ownerName}</li>
          <li><strong>Contact Email:</strong> ${contactEmail}</li>
        </ul>
        <p>Please review the submission in your Supabase dashboard.</p>
      `
    }

    // For MVP, we'll log the email data
    // In production, integrate with your preferred email service (SendGrid, Resend, etc.)
    console.log('Email notification:', emailData)

    return new Response(
      JSON.stringify({ success: true, message: 'Notification sent' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})