import type {IncomingMessage, ServerResponse} from 'node:http';
import {createMerchantInsight} from '../server/merchantInsight';

export default async function handler(request: IncomingMessage, response: ServerResponse) {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');

  if (request.method !== 'POST') {
    response.statusCode = 405;
    response.setHeader('Allow', 'POST');
    response.end(JSON.stringify({message: 'Method not allowed'}));
    return;
  }

  const result = await createMerchantInsight();
  response.statusCode = result.statusCode;
  response.end(JSON.stringify(result.body));
}
