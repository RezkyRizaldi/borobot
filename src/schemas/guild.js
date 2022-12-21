const { Schema, model } = require('mongoose');

const guildSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  guildId: { type: Schema.Types.String, required: true },
  guildName: { type: Schema.Types.String, required: true },
  guildIcon: Schema.Types.String,
});

module.exports = model('Guild', guildSchema, 'guilds');
