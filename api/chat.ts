import { chatApi, readJson, toResponse } from '../server/api.js';

export async function POST(request: Request) {
  return toResponse(await chatApi(await readJson(request)));
}
