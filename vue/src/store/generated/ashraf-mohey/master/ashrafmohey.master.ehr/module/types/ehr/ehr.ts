/* eslint-disable */
import * as Long from "long";
import { util, configure, Writer, Reader } from "protobufjs/minimal";

export const protobufPackage = "ashrafmohey.master.ehr";

export interface Ehr {
  creator: string;
  id: number;
  patientId: number;
  dataHash: string;
  patientSignature: string;
  organizationSignature: string;
}

const baseEhr: object = {
  creator: "",
  id: 0,
  patientId: 0,
  dataHash: "",
  patientSignature: "",
  organizationSignature: "",
};

export const Ehr = {
  encode(message: Ehr, writer: Writer = Writer.create()): Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.id !== 0) {
      writer.uint32(16).uint64(message.id);
    }
    if (message.patientId !== 0) {
      writer.uint32(24).uint64(message.patientId);
    }
    if (message.dataHash !== "") {
      writer.uint32(34).string(message.dataHash);
    }
    if (message.patientSignature !== "") {
      writer.uint32(42).string(message.patientSignature);
    }
    if (message.organizationSignature !== "") {
      writer.uint32(50).string(message.organizationSignature);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Ehr {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseEhr } as Ehr;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        case 2:
          message.id = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.patientId = longToNumber(reader.uint64() as Long);
          break;
        case 4:
          message.dataHash = reader.string();
          break;
        case 5:
          message.patientSignature = reader.string();
          break;
        case 6:
          message.organizationSignature = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Ehr {
    const message = { ...baseEhr } as Ehr;
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = String(object.creator);
    } else {
      message.creator = "";
    }
    if (object.id !== undefined && object.id !== null) {
      message.id = Number(object.id);
    } else {
      message.id = 0;
    }
    if (object.patientId !== undefined && object.patientId !== null) {
      message.patientId = Number(object.patientId);
    } else {
      message.patientId = 0;
    }
    if (object.dataHash !== undefined && object.dataHash !== null) {
      message.dataHash = String(object.dataHash);
    } else {
      message.dataHash = "";
    }
    if (
      object.patientSignature !== undefined &&
      object.patientSignature !== null
    ) {
      message.patientSignature = String(object.patientSignature);
    } else {
      message.patientSignature = "";
    }
    if (
      object.organizationSignature !== undefined &&
      object.organizationSignature !== null
    ) {
      message.organizationSignature = String(object.organizationSignature);
    } else {
      message.organizationSignature = "";
    }
    return message;
  },

  toJSON(message: Ehr): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    message.id !== undefined && (obj.id = message.id);
    message.patientId !== undefined && (obj.patientId = message.patientId);
    message.dataHash !== undefined && (obj.dataHash = message.dataHash);
    message.patientSignature !== undefined &&
      (obj.patientSignature = message.patientSignature);
    message.organizationSignature !== undefined &&
      (obj.organizationSignature = message.organizationSignature);
    return obj;
  },

  fromPartial(object: DeepPartial<Ehr>): Ehr {
    const message = { ...baseEhr } as Ehr;
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = object.creator;
    } else {
      message.creator = "";
    }
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = 0;
    }
    if (object.patientId !== undefined && object.patientId !== null) {
      message.patientId = object.patientId;
    } else {
      message.patientId = 0;
    }
    if (object.dataHash !== undefined && object.dataHash !== null) {
      message.dataHash = object.dataHash;
    } else {
      message.dataHash = "";
    }
    if (
      object.patientSignature !== undefined &&
      object.patientSignature !== null
    ) {
      message.patientSignature = object.patientSignature;
    } else {
      message.patientSignature = "";
    }
    if (
      object.organizationSignature !== undefined &&
      object.organizationSignature !== null
    ) {
      message.organizationSignature = object.organizationSignature;
    } else {
      message.organizationSignature = "";
    }
    return message;
  },
};

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
