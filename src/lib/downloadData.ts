// @ts-ignore
import { spawn } from "threads";
import worker from "@/workers/bulkput.worker?worker";
import myfetchworker from "@/workers/myfetch.worker?worker";
export const downloadData = async () => {
  const response = await fetch("/eligibility_list.csv");
  const csvString = await response.text();
  console.log(csvString);
};

export async function startDownload(url: string, updateProgress: Function) {
  try {
    console.log("start myfetch");
    const myfetch = await spawn(new myfetchworker());

    const myfetchPromise = new Promise((resolve, _) => {
      myfetch(url).subscribe((result: any) => {
        updateProgress(
          result.processed,
          result.total,
          "Downloading eligibility_list.csv...",
        );
        if (result.processed >= result.total) {
          resolve(result.items);
        }
      });
    });

    const items = await myfetchPromise;
    console.log("end myfetch");
    console.log("start bulkadd");
    const bulkPut = await spawn(new worker());
    const newPromise = new Promise((resolve, _) => {
      bulkPut(items).subscribe((result: any) => {
        updateProgress(
          result.processed,
          result.total,
          "Indexing eligibility_list ...",
        );
        if (result.processed >= result.total) {
          resolve(true);
        }
      });
    });

    await newPromise;
    console.log("after bulkadd");
  } catch (e) {
    console.log("put", e);
  }
}
