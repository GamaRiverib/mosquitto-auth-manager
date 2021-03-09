export enum Acc {
  NONE=0,
  READ=1,
  WRITE=2,
  READ_WRITE=3,
  SUBSCRIBE=4,
  DENY=5
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
    case Acc.SUBSCRIBE:
      return "SUBSCRIBE";
    default:
      return "NONE";
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
    case "subscribe":
      return Acc.SUBSCRIBE;
    case "deny":
      return Acc.DENY;
    default:
      return Acc.NONE;
  }

}
