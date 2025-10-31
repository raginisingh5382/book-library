import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "Book reference is required"],
    },
    borrowDate: {
      type: Date,
      default: Date.now,
    },
    returnDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["borrowed", "returned"],
      default: "borrowed",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// ✅ Optional: Ensure a user can't borrow the same book twice without returning
borrowSchema.index({ user: 1, book: 1, status: 1 }, { unique: true, partialFilterExpression: { status: "borrowed" } });

const Borrow = mongoose.model("Borrow", borrowSchema);
export default Borrow;

