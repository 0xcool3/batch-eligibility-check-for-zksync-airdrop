// threads-worker.d.ts
declare module 'threads/worker' {
    export function expose(workerImplementation: any): void;
  }