const { Schema, model } = require("mongoose");
const mongooseSlugPlugin = require("mongoose-slug-plugin");

// we could also require {Schema, model} = require ("mongoose")
//we would get rid of all the mongoose in code for destructing

const ShopSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    image: { type: String },
    product: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

ShopSchema.plugin(mongooseSlugPlugin, { tmpl: "<%=name%>" });

module.exports = model("Shop", ShopSchema);
