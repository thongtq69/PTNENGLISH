import mongoose, { Schema } from 'mongoose';

const TestimonialSchema = new Schema({
    name: String,
    role: String,
    content: String,
    image: String,
    rating: { type: Number, default: 5 }
}, { timestamps: true });

export default mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
