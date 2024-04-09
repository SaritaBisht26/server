import mongoose, { Schema } from "mongoose";

const userProductRelationSchema = new Schema({
  productOwner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
});
const UserProductRelation = mongoose.model(
  "UserProductRelation",
  userProductRelationSchema
);

export default UserProductRelation;
