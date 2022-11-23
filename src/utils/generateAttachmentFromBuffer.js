const { AttachmentBuilder } = require('discord.js');

/**
 *
 * @param {{ buffer: Buffer|ArrayBuffer, fileName: String, fileDesc: String }}
 * @returns {Promise<AttachmentBuilder>} The attachment builder.
 */
module.exports = async ({ buffer, fileName, fileDesc }) => {
  if (ArrayBuffer.isView(buffer)) {
    buffer = Buffer.from(buffer, 'base64');
  }

  const ext = await (await import('file-type'))
    .fileTypeFromBuffer(buffer)
    .then((r) => r.ext);

  return new AttachmentBuilder(buffer, {
    name: `${fileName}.${ext}`,
    description: fileDesc,
  });
};
