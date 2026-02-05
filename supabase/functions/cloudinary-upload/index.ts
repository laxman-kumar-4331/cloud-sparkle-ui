import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createHash, createHmac } from "https://deno.land/std@0.177.0/node/crypto.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CLOUDINARY_CLOUD_NAME = Deno.env.get("CLOUDINARY_CLOUD_NAME");
const CLOUDINARY_API_KEY = Deno.env.get("CLOUDINARY_API_KEY");
const CLOUDINARY_API_SECRET = Deno.env.get("CLOUDINARY_API_SECRET");

function generateSignature(params: Record<string, string>, apiSecret: string): string {
  const sortedKeys = Object.keys(params).sort();
  const stringToSign = sortedKeys.map((key) => `${key}=${params[key]}`).join("&");
  return createHash("sha1").update(stringToSign + apiSecret).digest("hex");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return new Response(
      JSON.stringify({ error: "Cloudinary credentials are not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { action, public_id, user_id, file_data } = await req.json();

    switch (action) {
      case "get_signature": {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const folder = `cloudvault/${user_id}`;
        
        const params: Record<string, string> = {
          folder,
          timestamp,
        };

        const signature = generateSignature(params, CLOUDINARY_API_SECRET);

        return new Response(
          JSON.stringify({
            signature,
            timestamp,
            api_key: CLOUDINARY_API_KEY,
            cloud_name: CLOUDINARY_CLOUD_NAME,
            folder,
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "delete": {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        
        const params: Record<string, string> = {
          public_id,
          timestamp,
        };

        const signature = generateSignature(params, CLOUDINARY_API_SECRET);

        const formData = new FormData();
        formData.append("public_id", public_id);
        formData.append("signature", signature);
        formData.append("api_key", CLOUDINARY_API_KEY);
        formData.append("timestamp", timestamp);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`,
          { method: "POST", body: formData }
        );

        const result = await response.json();
        
        return new Response(
          JSON.stringify(result),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    console.error("Cloudinary Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
