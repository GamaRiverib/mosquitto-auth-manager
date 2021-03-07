export enum Acc {
  READ=1,
  WRITE=2,
  READ_WRITE=3,
  SUBCRIBE=4
}

export function getAccAsString(acc: Acc): string {
  switch(acc) {
    case Acc.READ:
      return "READ";
    case Acc.WRITE:
      return "WRITE";
    case Acc.READ_WRITE:
      return "READWRITE";
    case Acc.SUBCRIBE:
      return "SUBSCRIBE";
    default:
      return undefined;
  }
}

export function getAccFromString(acc: string): Acc {
  switch(acc.toLowerCase()) {
    case "read":
      return Acc.READ;
    case "write":
      return Acc.WRITE;
    case "readwrite":
      return Acc.READ_WRITE;
    case "subscribe":
      return Acc.SUBCRIBE;
    default:
      return undefined;
  }

}
