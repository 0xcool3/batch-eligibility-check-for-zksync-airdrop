// workers/auth.js
import { expose } from "threads/worker";
import { Observable } from "rxjs";
import { db } from "@/lib/db";

function bulkput(items: any[], chunkSize = 1000) {
  const total = items.length;
  let processed = 0;
  const processItems = (items: any[], chunkSize: number) =>
    new Observable((subscriber) => {
      const processChunk = async (chunk: any[]) => {
        await db.eligibility_list.bulkPut(chunk);
        processed += chunk.length;

        subscriber.next({ processed, total });
      };
      (async () => {
        for (let i = 0; i < items.length; i += chunkSize) {
          const chunk = items.slice(i, i + chunkSize);

          await processChunk(chunk);
        }
        subscriber.complete();
      })();
    });
  return processItems(items, chunkSize);
}
expose(bulkput);
