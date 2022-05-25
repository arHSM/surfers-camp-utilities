import { InteractionResponseType, InteractionType, verifyKey } from "discord-interactions";
import getRawBody from "raw-body";
import { VercelRequest, VercelResponse } from "@vercel/node";
import handler from "./handler";

/**
 * Surfers Camp Utilities
 * @param {VercelRequest} request
 * @param {VercelResponse} response
 */
export default async (request: VercelRequest, response: VercelResponse) => {
    if (request.method === "POST") {
        const signature = request.headers["x-signature-ed25519"] as string;
        const timestamp = request.headers["x-signature-timestamp"] as string;
        const rawBody = await getRawBody(request);

        const isValidRequest = verifyKey(
            rawBody,
            signature,
            timestamp,
            process.env.PUBLIC_KEY
        );

        if (!isValidRequest) {
            console.error("Invalid Request");
            return response.status(401).send({ error: "Bad request signature " });
        }

        const message = request.body;

        if (message.type === InteractionType.PING) {
            console.log("Handling Ping request");
            response.send({
                type: InteractionResponseType.PONG,
            });
        } else {
            console.log("Handling Interaction request");
            response.status(200).send(await handler(message));
        }
    }
};