// workers/auth.js
import { expose } from "threads/worker";
import { Observable } from "rxjs";

import { bytesToString } from "viem";
import * as Papa from "papaparse";

function myfetch(url: string) {
  const processItems = (url: string) =>
    new Observable((subscriber) => {
      (async () => {
        console.log("dosomething");
        const response = await fetch(url);
        const reader = response.body?.getReader();
        const contentLength = response!.headers!.get("Content-Length")!;

        let receivedLength = 0;
        let chunks = [];

        while (true) {
          const { done, value } = await reader!.read();

          if (done) {
            break;
          }

          chunks.push(value);
          receivedLength += value.length;

          if (parseInt(contentLength) != receivedLength) {
            subscriber.next({
              processed: receivedLength,
              total: contentLength,
            });
          }
        }

        const chunksAll = new Uint8Array(receivedLength);

        let position = 0;

        for (let chunk of chunks) {
          chunksAll.set(chunk, position);
          position += chunk.length;
        }
        const csvString = bytesToString(chunksAll);
        const results: any = Papa.parse(csvString);
        const items: { id: any; tokenAmount: any }[] = [];
        for (var i = 1; i < results.data.length; ++i) {
          items.push({
            id: results.data[i][0],
            tokenAmount: results.data[i][1],
          });
        }
        if (parseInt(contentLength) == receivedLength) {
          subscriber.next({
            processed: contentLength,
            total: contentLength,
            items,
          });

          subscriber.complete();
        }
      })();
    });
  return processItems(url);
}
expose(myfetch);
