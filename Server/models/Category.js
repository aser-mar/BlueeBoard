const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
{
name: {
type: String,
required: true,
trim: true,
},


companies: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
],

isActive: {
  type: Boolean,
  default: true,
},


},
{
timestamps: true,
}
);

module.exports = mongoose.model(
"Category",
categorySchema
);