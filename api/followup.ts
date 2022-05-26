import { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "cross-fetch";

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

export default async (request: VercelRequest, response: VercelResponse) => {
    if (request.method !== "POST") return response.status(405).send("Method not allowed")

    const message = request.body
    const to_send = JSON.stringify(message.body)

    await sleep(75);

    console.log(`Sending ${to_send} to https://discord.com/api/v10/webhooks/${process.env.APPLICATION_ID}/${message.token}`)

    const res = await fetch(`https://discord.com/api/v10/webhooks/${process.env.APPLICATION_ID}/${message.token}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bot ${process.env.BOT_TOKEN}`,
        },
        body: to_send
    })

    console.log(`Followup message request complete with status: ${res.status}`)

    return response.status(200).send("OK")
}