const { Events } = require('discord.js');

module.exports = {
	banChoices: [
		{
			name: "Don't Delete Any",
			value: 0,
		},
		{
			name: 'Previous 1 Day',
			value: 1,
		},
		{
			name: 'Previous 2 Days',
			value: 2,
		},
		{
			name: 'Previous 3 Days',
			value: 3,
		},
		{
			name: 'Previous 4 Days',
			value: 4,
		},
		{
			name: 'Previous 5 Days',
			value: 5,
		},
		{
			name: 'Previous 6 Days',
			value: 6,
		},
		{
			name: 'Previous 7 Days',
			value: 7,
		},
	],
	timeoutChoices: [
		{
			name: '60 secs',
			value: 1000 * 60,
		},
		{
			name: '5 mins',
			value: 1000 * 60 * 5,
		},
		{
			name: '10 mins',
			value: 1000 * 60 * 10,
		},
		{
			name: '1 hour',
			value: 1000 * 60 * 60,
		},
		{
			name: '1 day',
			value: 1000 * 60 * 60 * 24,
		},
		{
			name: '1 week',
			value: 1000 * 60 * 60 * 24 * 7,
		},
	],
	emitChoices: [
		{
			name: Events.GuildMemberAdd,
			value: Events.GuildMemberAdd,
		},
		{
			name: Events.GuildMemberRemove,
			value: Events.GuildMemberRemove,
		},
		{
			name: Events.GuildMemberUpdate,
			value: Events.GuildMemberUpdate,
		},
	],
};