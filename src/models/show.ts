import { model, Schema } from 'mongoose';

const ShowSchema = new Schema({
	cast: [{
		birthday: String,
		id: Number,
		name: String,
	}],
	id: Number,
	name: String,
});

export { ShowSchema };

export default model('Show', ShowSchema);
