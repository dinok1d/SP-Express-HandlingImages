const { Schema, model, Mongoose } = require("mongoose");
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
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  }

  // {
  //   timestamps: true, // shows when it was created
  // }
);

ShopSchema.plugin(mongooseSlugPlugin, { tmpl: "<%=name%>" });

module.exports = model("Shop", ShopSchema);
