/**
 *
 * @param {String} str
 * @param {'facebook' | 'instagram' | 'spotify' | 'tiktok' | 'twitter' | 'youtube'} [site]
 * @returns {Boolean} Boolean value of the string with valid URL.
 */
module.exports = (str, site) => {
  if (site) {
    return {
      facebook: /(?:(?:http|https):\/\/)?(?:www|web|m\.)?facebook.com\/?/.test(
        str,
      ),
      instagram:
        /(?:(?:http|https):\/\/)?(?:www\.)?(?:instagram\.com|instagr\.am|instagr\.com)\/(\w+)\/?/.test(
          str,
        ),
      spotify: /^(spotify:|https:\/\/(open|play)\.spotify\.com\/)/.test(str),
      tiktok: /(?:(?:http|https):\/\/)?(?:vt\.)?(?:tiktok\.com)\/(\w+)\/?/.test(
        str,
      ),
      twitter:
        /(?:(?:http|https):\/\/)?(?:www\.|mobile\.)?(?:twitter\.com)\/(\w+)\/(status)\/(\d+)?/.test(
          str,
        ),
      youtube:
        /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu\.be))(\/(?:[\w-]+\?v=|embed|shorts|\/|v\/)?)([\w-]+)(\S+)?$/.test(
          str,
        ),
    }[site];
  }

  return /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(
    str,
  );
};
