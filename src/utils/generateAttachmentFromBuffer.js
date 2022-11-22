const { AttachmentBuilder } = require('discord.js');

/**
 *
 * @param {{ buffer: Buffer|ArrayBuffer, fileName: String, fileDesc: String }}
 * @returns {Promise<{ attachment: AttachmentBuilder, ext: import('file-type').FileExtension }>} The attachment builder.
 */
module.exports = async ({ buffer, fileName, fileDesc }) => {
  if (ArrayBuffer.isView(buffer)) {
    buffer = Buffer.from(buffer, 'base64');
  }

  const ext = await (await import('file-type'))
    .fileTypeFromBuffer(buffer)
    .then((r) => r.ext);

  const attachment = new AttachmentBuilder(buffer, {
    name: `${fileName}.${ext}`,
    description: fileDesc,
  });

  return { attachment, ext };
};
