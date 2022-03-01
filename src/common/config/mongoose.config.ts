import { SchemaOptions } from "@nestjs/mongoose";
import { Types } from "mongoose";

export const Options: SchemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (_, ret: any) {
      for (const [key, value] of Object.entries(ret)) {
        if (value instanceof Types.Decimal128) {
          ret[key] = value.toString();
        }
      }

      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
};
