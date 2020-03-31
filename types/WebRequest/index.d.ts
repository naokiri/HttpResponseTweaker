
declare class StreamFilter {
  onstart(event: Event): void;
  ondata(data: {data: ArrayBuffer }): void;
  onstop(event: Event): void;
  onerror(event: Event): void;

  write(data: ArrayBuffer | Uint8Array): void;
  disconnect(): void;
  close(): void;
  suspend(): void;
  resume(): void;
  status: string;
}
