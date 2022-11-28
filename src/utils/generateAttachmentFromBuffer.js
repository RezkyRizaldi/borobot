const { AttachmentBuilder } = require('discord.js');

/**
 *
 * @param {{ buffer: Buffer|ArrayBuffer, fileName: String, fileDesc: String }}
 * @returns {Promise<AttachmentBuilder>} The attachment builder.
 */
module.exports = async ({ buffer, fileName, fileDesc }) => {
  const ext = await (await import('file-type'))
    .fileTypeFromBuffer(
      ArrayBuffer.isView(buffer) ? Buffer.from(buffer, 'base64') : buffer,
    )
    .then((r) => r.ext);

  return new AttachmentBuilder(buffer, {
    name: `${fileName}.${ext}`,
    description: fileDesc,
  });
};
