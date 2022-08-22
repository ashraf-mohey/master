/* eslint-disable */
import * as Long from "long";
import { util, configure, Writer, Reader } from "protobufjs/minimal";

export const protobufPackage = "ashrafmohey.master.ehr";

export interface EhrPacketData {
  noData: NoData | undefined;
  /** this line is used by starport scaffolding # ibc/packet/proto/field */
  ibcTransferEhrsPacket: IbcTransferEhrsPacketData | undefined;
}

export interface NoData {}

/** IbcTransferEhrsPacketData defines a struct for the packet payload */
export interface IbcTransferEhrsPacketData {
  creator: string;
  patientId: number;
  organizationAddress: string;
  pendingTransferUrl: string;
}

/** IbcTransferEhrsPacketAck defines a struct for the packet acknowledgment */
export interface IbcTransferEhrsPacketAck {
  ids: number[];
}

const baseEhrPacketData: object = {};

export const EhrPacketData = {
  encode(message: EhrPacketData, writer: Writer = Writer.create()): Writer {
    if (message.noData !== undefined) {
      NoData.encode(message.noData, writer.uint32(10).fork()).ldelim();
    }
    if (message.ibcTransferEhrsPacket !== undefined) {
      IbcTransferEhrsPacketData.encode(
        message.ibcTransferEhrsPacket,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): EhrPacketData {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseEhrPacketData } as EhrPacketData;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.noData = NoData.decode(reader, reader.uint32());
          break;
        case 2:
          message.ibcTransferEhrsPacket = IbcTransferEhrsPacketData.decode(
            reader,
            reader.uint32()
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EhrPacketData {
    const message = { ...baseEhrPacketData } as EhrPacketData;
    if (object.noData !== undefined && object.noData !== null) {
      message.noData = NoData.fromJSON(object.noData);
    } else {
      message.noData = undefined;
    }
    if (
      object.ibcTransferEhrsPacket !== undefined &&
      object.ibcTransferEhrsPacket !== null
    ) {
      message.ibcTransferEhrsPacket = IbcTransferEhrsPacketData.fromJSON(
        object.ibcTransferEhrsPacket
      );
    } else {
      message.ibcTransferEhrsPacket = undefined;
    }
    return message;
  },

  toJSON(message: EhrPacketData): unknown {
    const obj: any = {};
    message.noData !== undefined &&
      (obj.noData = message.noData ? NoData.toJSON(message.noData) : undefined);
    message.ibcTransferEhrsPacket !== undefined &&
      (obj.ibcTransferEhrsPacket = message.ibcTransferEhrsPacket
        ? IbcTransferEhrsPacketData.toJSON(message.ibcTransferEhrsPacket)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<EhrPacketData>): EhrPacketData {
    const message = { ...baseEhrPacketData } as EhrPacketData;
    if (object.noData !== undefined && object.noData !== null) {
      message.noData = NoData.fromPartial(object.noData);
    } else {
      message.noData = undefined;
    }
    if (
      object.ibcTransferEhrsPacket !== undefined &&
      object.ibcTransferEhrsPacket !== null
    ) {
      message.ibcTransferEhrsPacket = IbcTransferEhrsPacketData.fromPartial(
        object.ibcTransferEhrsPacket
      );
    } else {
      message.ibcTransferEhrsPacket = undefined;
    }
    return message;
  },
};

const baseNoData: object = {};

export const NoData = {
  encode(_: NoData, writer: Writer = Writer.create()): Writer {
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): NoData {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseNoData } as NoData;
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

  fromJSON(_: any): NoData {
    const message = { ...baseNoData } as NoData;
    return message;
  },

  toJSON(_: NoData): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<NoData>): NoData {
    const message = { ...baseNoData } as NoData;
    return message;
  },
};

const baseIbcTransferEhrsPacketData: object = {
  creator: "",
  patientId: 0,
  organizationAddress: "",
  pendingTransferUrl: "",
};

export const IbcTransferEhrsPacketData = {
  encode(
    message: IbcTransferEhrsPacketData,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.patientId !== 0) {
      writer.uint32(16).uint64(message.patientId);
    }
    if (message.organizationAddress !== "") {
      writer.uint32(26).string(message.organizationAddress);
    }
    if (message.pendingTransferUrl !== "") {
      writer.uint32(34).string(message.pendingTransferUrl);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): IbcTransferEhrsPacketData {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseIbcTransferEhrsPacketData,
    } as IbcTransferEhrsPacketData;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        case 2:
          message.patientId = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.organizationAddress = reader.string();
          break;
        case 4:
          message.pendingTransferUrl = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): IbcTransferEhrsPacketData {
    const message = {
      ...baseIbcTransferEhrsPacketData,
    } as IbcTransferEhrsPacketData;
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = String(object.creator);
    } else {
      message.creator = "";
    }
    if (object.patientId !== undefined && object.patientId !== null) {
      message.patientId = Number(object.patientId);
    } else {
      message.patientId = 0;
    }
    if (
      object.organizationAddress !== undefined &&
      object.organizationAddress !== null
    ) {
      message.organizationAddress = String(object.organizationAddress);
    } else {
      message.organizationAddress = "";
    }
    if (
      object.pendingTransferUrl !== undefined &&
      object.pendingTransferUrl !== null
    ) {
      message.pendingTransferUrl = String(object.pendingTransferUrl);
    } else {
      message.pendingTransferUrl = "";
    }
    return message;
  },

  toJSON(message: IbcTransferEhrsPacketData): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    message.patientId !== undefined && (obj.patientId = message.patientId);
    message.organizationAddress !== undefined &&
      (obj.organizationAddress = message.organizationAddress);
    message.pendingTransferUrl !== undefined &&
      (obj.pendingTransferUrl = message.pendingTransferUrl);
    return obj;
  },

  fromPartial(
    object: DeepPartial<IbcTransferEhrsPacketData>
  ): IbcTransferEhrsPacketData {
    const message = {
      ...baseIbcTransferEhrsPacketData,
    } as IbcTransferEhrsPacketData;
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = object.creator;
    } else {
      message.creator = "";
    }
    if (object.patientId !== undefined && object.patientId !== null) {
      message.patientId = object.patientId;
    } else {
      message.patientId = 0;
    }
    if (
      object.organizationAddress !== undefined &&
      object.organizationAddress !== null
    ) {
      message.organizationAddress = object.organizationAddress;
    } else {
      message.organizationAddress = "";
    }
    if (
      object.pendingTransferUrl !== undefined &&
      object.pendingTransferUrl !== null
    ) {
      message.pendingTransferUrl = object.pendingTransferUrl;
    } else {
      message.pendingTransferUrl = "";
    }
    return message;
  },
};

const baseIbcTransferEhrsPacketAck: object = { ids: 0 };

export const IbcTransferEhrsPacketAck = {
  encode(
    message: IbcTransferEhrsPacketAck,
    writer: Writer = Writer.create()
  ): Writer {
    writer.uint32(10).fork();
    for (const v of message.ids) {
      writer.uint64(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): IbcTransferEhrsPacketAck {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseIbcTransferEhrsPacketAck,
    } as IbcTransferEhrsPacketAck;
    message.ids = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.ids.push(longToNumber(reader.uint64() as Long));
            }
          } else {
            message.ids.push(longToNumber(reader.uint64() as Long));
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): IbcTransferEhrsPacketAck {
    const message = {
      ...baseIbcTransferEhrsPacketAck,
    } as IbcTransferEhrsPacketAck;
    message.ids = [];
    if (object.ids !== undefined && object.ids !== null) {
      for (const e of object.ids) {
        message.ids.push(Number(e));
      }
    }
    return message;
  },

  toJSON(message: IbcTransferEhrsPacketAck): unknown {
    const obj: any = {};
    if (message.ids) {
      obj.ids = message.ids.map((e) => e);
    } else {
      obj.ids = [];
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<IbcTransferEhrsPacketAck>
  ): IbcTransferEhrsPacketAck {
    const message = {
      ...baseIbcTransferEhrsPacketAck,
    } as IbcTransferEhrsPacketAck;
    message.ids = [];
    if (object.ids !== undefined && object.ids !== null) {
      for (const e of object.ids) {
        message.ids.push(e);
      }
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
