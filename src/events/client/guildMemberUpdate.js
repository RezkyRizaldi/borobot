const Canvas = require('@napi-rs/canvas');
const { AttachmentBuilder, EmbedBuilder, WebhookClient } = require('discord.js');

const { applyText } = require('../../utils');

module.exports = {
	name: 'guildMemberUpdate',

	/**
	 *
	 * @param {import('discord.js').GuildMember} oldMember
	 * @param {import('discord.js').GuildMember} newMember
	 */
	async execute(oldMember, newMember) {
		const { guild } = newMember;

		const embed = new EmbedBuilder()
			.setFooter({
				text: newMember.client.user.username,
				iconURL: newMember.client.user.displayAvatarURL({ dynamic: true }),
			})
			.setTimestamp(Date.now())
			.setColor('#fcc9b9');

		// If the member has boosted the server
		if (!oldMember.premiumSince && newMember.premiumSince) {
			const canvas = Canvas.createCanvas(700, 250);
			const context = canvas.getContext('2d');
			const background = await Canvas.loadImage('./src/assets/images/nitro.png');

			context.drawImage(background, 0, 0, canvas.width, canvas.height);
			context.strokeStyle = '#fcc9b9';
			context.strokeRect(0, 0, canvas.width, canvas.height);
			context.font = applyText(canvas, `${newMember.displayName}!`);
			context.textAlign = 'center';
			context.fillStyle = '#ffffff';
			context.fillText(`Welcome to test, ${newMember.displayName}!`, canvas.width / 2, canvas.height / 1.2);

			const avatar = await Canvas.loadImage(newMember.user.displayAvatarURL({ extension: 'jpg' }));

			context.beginPath();
			context.arc(125, 125, 100, 0, Math.PI * 2, true);
			context.closePath();
			context.clip();
			context.drawImage(avatar, 25, 25, 200, 200);

			const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'nitro.png' });

			embed.setAuthor({
				name: 'Server Boosted',
				iconURL: guild.iconURL({ dynamic: true }),
			});
			embed.setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }));
			embed.setDescription(`Welcome to test, ${newMember.displayName}!`);
			embed.setImage('attachment://nitro.png');

			await guild.systemChannel.send({ embeds: [embed], files: [attachment] }).catch((err) => console.error(err));

			embed.setDescription('Thank you for boosting test!');
			await newMember.send({ embeds: [embed] }).catch((err) => {
				console.error(err);
				console.log(`Could not send a DM to ${newMember.user.tag}.`);
			});
		}

		// If the member roles have changed
		const RoleAddLogger = new WebhookClient({
			id: process.env.MEMBER_ROLE_ADD_WEBHOOK_ID,
			token: process.env.MEMBER_ROLE_ADD_WEBHOOK_TOKEN,
		});

		const removedRoles = oldMember.roles.cache.filter((role) => !newMember.roles.cache.has(role.id));
		if (removedRoles.size > 0) {
			embed.setAuthor({
				name: 'Roles Removed',
				iconURL: oldMember.displayAvatarURL({ dynamic: true }),
			});
			embed.setDescription(`The roles ${removedRoles.map((role) => `${role}`).join(', ')} were removed from ${oldMember}.`);

			return RoleAddLogger.send({ embeds: [embed] }).catch((err) => console.error(err));
		}

		const RoleRemoveLogger = new WebhookClient({
			id: process.env.MEMBER_ROLE_REMOVE_WEBHOOK_ID,
			token: process.env.MEMBER_ROLE_REMOVE_WEBHOOK_TOKEN,
		});

		const addedRoles = newMember.roles.cache.filter((role) => !oldMember.roles.cache.has(role.id));
		if (addedRoles.size > 0) {
			embed.setAuthor({
				name: 'Roles Added',
				iconURL: newMember.displayAvatarURL({ dynamic: true }),
			});
			embed.setDescription(`The roles ${addedRoles.map((role) => `${role}`).join(', ')} were added to ${newMember}.`);

			return RoleRemoveLogger.send({ embeds: [embed] }).catch((err) => console.error(err));
		}
	},
};
