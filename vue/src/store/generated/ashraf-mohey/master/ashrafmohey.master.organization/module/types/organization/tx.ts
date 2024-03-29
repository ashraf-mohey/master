/* eslint-disable */
import { Reader, util, configure, Writer } from "protobufjs/minimal";
import * as Long from "long";

export const protobufPackage = "ashrafmohey.master.organization";

export interface MsgSendIbcOrganization {
  creator: string;
  port: string;
  channelID: string;
  timeoutTimestamp: number;
  name: string;
  organizationType: string;
  country: string;
}

export interface MsgSendIbcOrganizationResponse {}

const baseMsgSendIbcOrganization: object = {
  creator: "",
  port: "",
  channelID: "",
  timeoutTimestamp: 0,
  name: "",
  organizationType: "",
  country: "",
};

export const MsgSendIbcOrganization = {
  encode(
    message: MsgSendIbcOrganization,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.port !== "") {
      writer.uint32(18).string(message.port);
    }
    if (message.channelID !== "") {
      writer.uint32(26).string(message.channelID);
    }
    if (message.timeoutTimestamp !== 0) {
      writer.uint32(32).uint64(message.timeoutTimestamp);
    }
    if (message.name !== "") {
      writer.uint32(42).string(message.name);
    }
    if (message.organizationType !== "") {
      writer.uint32(50).string(message.organizationType);
    }
    if (message.country !== "") {
      writer.uint32(58).string(message.country);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgSendIbcOrganization {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgSendIbcOrganization } as MsgSendIbcOrganization;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        case 2:
          message.port = reader.string();
          break;
        case 3:
          message.channelID = reader.string();
          break;
        case 4:
          message.timeoutTimestamp = longToNumber(reader.uint64() as Long);
          break;
        case 5:
          message.name = reader.string();
          break;
        case 6:
          message.organizationType = reader.string();
          break;
        case 7:
          message.country = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgSendIbcOrganization {
    const message = { ...baseMsgSendIbcOrganization } as MsgSendIbcOrganization;
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = String(object.creator);
    } else {
      message.creator = "";
    }
    if (object.port !== undefined && object.port !== null) {
      message.port = String(object.port);
    } else {
      message.port = "";
    }
    if (object.channelID !== undefined && object.channelID !== null) {
      message.channelID = String(object.channelID);
    } else {
      message.channelID = "";
    }
    if (
      object.timeoutTimestamp !== undefined &&
      object.timeoutTimestamp !== null
    ) {
      message.timeoutTimestamp = Number(object.timeoutTimestamp);
    } else {
      message.timeoutTimestamp = 0;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = "";
    }
    if (
      object.organizationType !== undefined &&
      object.organizationType !== null
    ) {
      message.organizationType = String(object.organizationType);
    } else {
      message.organizationType = "";
    }
    if (object.country !== undefined && object.country !== null) {
      message.country = String(object.country);
    } else {
      message.country = "";
    }
    return message;
  },

  toJSON(message: MsgSendIbcOrganization): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    message.port !== undefined && (obj.port = message.port);
    message.channelID !== undefined && (obj.channelID = message.channelID);
    message.timeoutTimestamp !== undefined &&
      (obj.timeoutTimestamp = message.timeoutTimestamp);
    message.name !== undefined && (obj.name = message.name);
    message.organizationType !== undefined &&
      (obj.organizationType = message.organizationType);
    message.country !== undefined && (obj.country = message.country);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgSendIbcOrganization>
  ): MsgSendIbcOrganization {
    const message = { ...baseMsgSendIbcOrganization } as MsgSendIbcOrganization;
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = object.creator;
    } else {
      message.creator = "";
    }
    if (object.port !== undefined && object.port !== null) {
      message.port = object.port;
    } else {
      message.port = "";
    }
    if (object.channelID !== undefined && object.channelID !== null) {
      message.channelID = object.channelID;
    } else {
      message.channelID = "";
    }
    if (
      object.timeoutTimestamp !== undefined &&
      object.timeoutTimestamp !== null
    ) {
      message.timeoutTimestamp = object.timeoutTimestamp;
    } else {
      message.timeoutTimestamp = 0;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = "";
    }
    if (
      object.organizationType !== undefined &&
      object.organizationType !== null
    ) {
      message.organizationType = object.organizationType;
    } else {
      message.organizationType = "";
    }
    if (object.country !== undefined && object.country !== null) {
      message.country = object.country;
    } else {
      message.country = "";
    }
    return message;
  },
};

const baseMsgSendIbcOrganizationResponse: object = {};

export const MsgSendIbcOrganizationResponse = {
  encode(
    _: MsgSendIbcOrganizationResponse,
    writer: Writer = Writer.create()
  ): Writer {
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): MsgSendIbcOrganizationResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgSendIbcOrganizationResponse,
    } as MsgSendIbcOrganizationResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgSendIbcOrganizationResponse {
    const message = {
      ...baseMsgSendIbcOrganizationResponse,
    } as MsgSendIbcOrganizationResponse;
    return message;
  },

  toJSON(_: MsgSendIbcOrganizationResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgSendIbcOrganizationResponse>
  ): MsgSendIbcOrganizationResponse {
    const message = {
      ...baseMsgSendIbcOrganizationResponse,
    } as MsgSendIbcOrganizationResponse;
    return message;
  },
};

/** Msg defines the Msg service. */
export interface Msg {
  /** this line is used by starport scaffolding # proto/tx/rpc */
  SendIbcOrganization(
    request: MsgSendIbcOrganization
  ): Promise<MsgSendIbcOrganizationResponse>;
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
  }
  SendIbcOrganization(
    request: MsgSendIbcOrganization
  ): Promise<MsgSendIbcOrganizationResponse> {
    const data = MsgSendIbcOrganization.encode(request).finish();
    const promise = this.rpc.request(
      "ashrafmohey.master.organization.Msg",
      "SendIbcOrganization",
      data
    );
    return promise.then((data) =>
      MsgSendIbcOrganizationResponse.decode(new Reader(data))
    );
  }
}

interface Rpc {
  request(
    service: string,
    method: string,
    data: Uint8Array
  ): Promise<Uint8Array>;
}

declare var self: any | undefined;
declare var window: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof self !== "undefined") return self;
  if (typeof window !== "undefined") return window;
  if (typeof global !== "undefined") return global;
  throw "Unable to locate global object";
})();

type Builtin = Date | Function | Uint8Array | string | number | undefined;
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
