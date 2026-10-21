import { ttsApi, readJson, toResponse } from '../server/api.js';

export async function POST(request: Request) {
  return toResponse(await ttsApi(await readJson(request)));
}
