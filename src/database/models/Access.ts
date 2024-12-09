// should be the same as this file from the countr/countr repository:
// https://github.com/countr/countr/blob/main/src/database/models/Access.ts

import type { DocumentType } from "@typegoose/typegoose";
import type { Snowflake } from "discord.js";
import { getModelForClass, prop } from "@typegoose/typegoose";
import { PropType } from "@typegoose/typegoose/lib/internal/constants";

export class AccessSchema {
  @prop({ type: Date, required: true }) expires!: Date;
  @prop({ type: [String], default: [] }, PropType.ARRAY) guildIds!: Snowflake[];
  @prop({ type: String, required: true }) userId!: string;
}

export type AccessDocument = DocumentType<AccessSchema>;

export const Access = getModelForClass(AccessSchema);
