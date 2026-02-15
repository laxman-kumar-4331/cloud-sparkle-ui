import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { MongoClient } from "npm:mongodb@6.3.0";
import { createHash } from "https://deno.land/std@0.177.0/node/crypto.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

let MONGODB_URI = Deno.env.get("MONGODB_URI");
console.log("MONGODB_URI raw value:", JSON.stringify(MONGODB_URI));
// Ensure the URI has the correct scheme prefix
if (MONGODB_URI && !MONGODB_URI.startsWith("mongodb://") && !MONGODB_URI.startsWith("mongodb+srv://")) {
  MONGODB_URI = "mongodb+srv://" + MONGODB_URI;
}
console.log("MONGODB_URI final value:", JSON.stringify(MONGODB_URI));

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
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
    const users = db.collection("users");
    const sessions = db.collection("sessions");

    const { action, email, password, name, token } = await req.json();

    switch (action) {
      case "signup": {
        const existingUser = await users.findOne({ email });
        if (existingUser) {
          return new Response(
            JSON.stringify({ error: "User already exists" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const hashedPassword = hashPassword(password);
        const userId = crypto.randomUUID();
        const sessionToken = generateToken();

        await users.insertOne({
          _id: userId,
          email,
          password: hashedPassword,
          name,
          avatar_url: null,
          created_at: new Date(),
          updated_at: new Date(),
        });

        await sessions.insertOne({
          token: sessionToken,
          user_id: userId,
          created_at: new Date(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        });

        return new Response(
          JSON.stringify({
            user: { id: userId, email, name, avatar_url: null },
            token: sessionToken,
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "login": {
        const user = await users.findOne({ email });
        if (!user || user.password !== hashPassword(password)) {
          return new Response(
            JSON.stringify({ error: "Invalid email or password" }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const sessionToken = generateToken();
        await sessions.insertOne({
          token: sessionToken,
          user_id: user._id,
          created_at: new Date(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        return new Response(
          JSON.stringify({
            user: { id: user._id, email: user.email, name: user.name, avatar_url: user.avatar_url },
            token: sessionToken,
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "verify": {
        const session = await sessions.findOne({ token, expires_at: { $gt: new Date() } });
        if (!session) {
          return new Response(
            JSON.stringify({ error: "Invalid or expired session" }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const user = await users.findOne({ _id: session.user_id });
        if (!user) {
          return new Response(
            JSON.stringify({ error: "User not found" }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({
            user: { id: user._id, email: user.email, name: user.name, avatar_url: user.avatar_url },
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "logout": {
        await sessions.deleteOne({ token });
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
    console.error("MongoDB Auth Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } finally {
    await client.close();
  }
});
