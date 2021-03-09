export enum Acc {
  READ=1,
  WRITE=2,
  READ_WRITE=3,
  DENY=4,
  SUBCRIBE=5
}

export function getAccAsString(acc: Acc): string {
  switch(acc) {
    case Acc.READ:
      return "READ";
    case Acc.WRITE:
      return "WRITE";
    case Acc.READ_WRITE:
      return "READWRITE";
    case Acc.DENY:
      return "DENY";
    case Acc.SUBCRIBE:
      return "SUBSCRIBE";
    default:
      return undefined;
  }
}

export function getAccFromString(acc: string): Acc {
  if (!acc) {
    return undefined;
  }
  switch(acc.toLowerCase()) {
    case "read":
      return Acc.READ;
    case "write":
      return Acc.WRITE;
    case "readwrite":
      return Acc.READ_WRITE;
    case "deny":
      return Acc.DENY;
    case "subscribe":
      return Acc.SUBCRIBE;
    default:
      return undefined;
  }

}
