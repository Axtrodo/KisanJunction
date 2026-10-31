import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Handle Meta Webhook Verification (GET)
  if (req.method === 'GET') {
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).json({ error: 'Webhook verification failed' });
  }

  // 2. Handle Inbound WhatsApp Messages (POST)
  if (req.method === 'POST') {
    try {
      const body = req.body;

      // Ensure it's a WhatsApp status update/message payload
      if (body.object) {
        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const message = value?.messages?.[0];

        if (message) {
          const senderPhone = message.from; // e.g., "919876543210"
          const messageType = message.type; // text, audio, image, interactive

          console.log(`Received ${messageType} from ${senderPhone}`);

          // Handle Text Messages
          if (messageType === 'text') {
            const textContent = message.text.body;
            
            // Example: Quick database log or parsing logic
            await supabase.from('crop_listings').insert([
              { 
                farmer_phone: senderPhone, 
                crop_type: 'Unspecified Text Listing', 
                weight_kg: 100, // placeholder or parsed value
                status: 'available' 
              }
            ]);
          }

          // Handle Interactive Button / List Replies (e.g. Driver accepting a gig)
          if (messageType === 'interactive') {
            const buttonReplyId = message.interactive.button_reply?.id || message.interactive.list_reply?.id;
            console.log(`User clicked interactive option: ${buttonReplyId}`);
            
            // TODO: Update pooling session or driver match status in Supabase
          }
        }
      }

      // Always return 200 OK quickly to Meta so it doesn't retry the webhook
      return res.status(200).json({ status: 'EVENT_RECEIVED' });
    } catch (error) {
      console.error('Error processing webhook:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
