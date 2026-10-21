import { contactApi, readJson, toResponse } from '../server/api.js';

export async function POST(request: Request) {
  return toResponse(await contactApi(await readJson(request)));
}
