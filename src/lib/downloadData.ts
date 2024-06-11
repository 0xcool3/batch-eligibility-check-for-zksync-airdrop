import { bytesToString } from "viem";
import * as Papa from "papaparse";
// import Dexie, { type EntityTable } from "dexie";
import { db } from "@/lib/db";
export const downloadData = async () => {
  const response = await fetch("/eligibility_list.csv");
  const csvString = await response.text();
  console.log({ csvString });
};

export async function startDownload(url: string, updateProgress: Function) {
  console.log("before fetch");
  const response = await fetch(url);
  console.log("after fetch");
  const reader = response.body?.getReader();
  const contentLength = +response!.headers!.get("Content-Length")!;

  console.log({ contentLength });

  let receivedLength = 0;
  let chunks = [];

  while (true) {
    const { done, value } = await reader!.read();

    if (done) {
      break;
    }

    chunks.push(value);
    receivedLength += value.length;

    updateProgress(
      receivedLength,
      contentLength,
      "Downloading eligibility_list.csv...",
    );
  }
  updateProgress(1, 1, "Downloading eligibility_list.csv...");
  console.log("downloaded");

  const chunksAll = new Uint8Array(receivedLength);
  let position = 0;

  for (let chunk of chunks) {
    chunksAll.set(chunk, position);
    position += chunk.length;
  }
  const csvString = bytesToString(chunksAll);

  const results: any = Papa.parse(csvString);

  const items = [];

  for (var i = 1; i < results.data.length; ++i) {
    items.push({
      id: results.data[i][0],
      userId: results.data[i][0],
      tokenAmount: results.data[i][1],
    });
  }

  console.log("lenght", items.length);
  try {
    console.log("start bulkadd");

    let seconds = 0;
    const intvl = setInterval(() => {
      seconds++;
      if (seconds >= 120) {
        updateProgress(120, 120, "Indexing eligibility_list ...");
      } else {
        updateProgress(seconds, 120, "Indexing eligibility_list ...");
      }
    }, 1000);

    await db.eligibility_list.bulkPut(items);
    clearInterval(intvl);
    updateProgress(120, 120, "Indexing eligibility_list ...");
    console.log("after bulkadd");
  } catch (e) {
    console.log("put", e);
  }
}
