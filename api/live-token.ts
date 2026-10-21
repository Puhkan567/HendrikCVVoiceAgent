import { liveTokenApi, readJson, toResponse } from '../server/api.js';

export async function POST(request: Request) {
  return toResponse(await liveTokenApi(await readJson(request)));
}
