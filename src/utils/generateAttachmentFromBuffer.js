const { AttachmentBuilder } = require('discord.js');

/**
 *
 * @param {ArrayBuffer} buffer
 * @param {String} fileName
 * @param {String} [fileDesc]
 * @returns {AttachmentBuilder} The attachment builder.
 */
module.exports = async (buffer, fileName, fileDesc) => {
  const base64 = Buffer.from(buffer, 'base64');

  const ext = await (await import('file-type'))
    .fileTypeFromBuffer(base64)
    .then((r) => r.ext);

  return new AttachmentBuilder(base64, {
    name: `${fileName}.${ext}`,
    description: fileDesc,
  });
};
