import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { MongoClient } from "npm:mongodb@6.3.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

let MONGODB_URI = Deno.env.get("MONGODB_URI");
// Ensure the URI has the correct scheme prefix
if (MONGODB_URI && !MONGODB_URI.startsWith("mongodb://") && !MONGODB_URI.startsWith("mongodb+srv://")) {
  MONGODB_URI = "mongodb+srv://" + MONGODB_URI;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!MONGODB_URI) {
    return new Response(
      JSON.stringify({ error: "MONGODB_URI is not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db("cloudvault");
    const files = db.collection("files");

    const { action, user_id, file_id, file_data, new_name } = await req.json();

    switch (action) {
      case "list": {
        const userFiles = await files.find({ user_id }).sort({ created_at: -1 }).toArray();
        return new Response(
          JSON.stringify({ files: userFiles }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "create": {
        const newFile = {
          _id: crypto.randomUUID(),
          user_id,
          name: file_data.name,
          original_name: file_data.original_name,
          size: file_data.size,
          type: file_data.type,
          cloudinary_public_id: file_data.cloudinary_public_id,
          cloudinary_url: file_data.cloudinary_url,
          thumbnail_url: file_data.thumbnail_url,
          is_starred: false,
          is_deleted: false,
          deleted_at: null,
          created_at: new Date(),
          updated_at: new Date(),
        };

        await files.insertOne(newFile);
        return new Response(
          JSON.stringify({ file: newFile }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "update": {
        const updateData: Record<string, unknown> = { updated_at: new Date() };
        if (new_name) updateData.name = new_name;
        if (file_data?.is_starred !== undefined) updateData.is_starred = file_data.is_starred;
        if (file_data?.is_deleted !== undefined) {
          updateData.is_deleted = file_data.is_deleted;
          updateData.deleted_at = file_data.is_deleted ? new Date() : null;
        }

        await files.updateOne({ _id: file_id, user_id }, { $set: updateData });
        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "delete": {
        await files.deleteOne({ _id: file_id, user_id });
        return new Response(
          JSON.stringify({ success: true }),
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
    console.error("MongoDB Files Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } finally {
    await client.close();
  }
});
