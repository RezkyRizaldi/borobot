/**
 *
 * @param {String} str
 * @param {'facebook' | 'instagram' | 'spotify' | 'tiktok' | 'twitter' | 'youtube'} [site]
 * @returns {Boolean} Boolean value of the string with valid URL.
 */
module.exports = (str, site) => {
  if (site) {
    return {
      facebook: /(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/?gi/.test(str),
      instagram:
        /(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am|instagr.com)\/(\w+)\/?/.test(
          str,
        ),
      spotify: /^(spotify:|https:\/\/(open|play)\.spotify\.com\/)/.test(str),
      tiktok: /(?:(?:http|https):\/\/)?(?:vt.)?(?:tiktok.com)\/(\w+)\/?/.test(
        str,
      ),
      twitter:
        /(?:(?:http|https):\/\/)?(?:www.|mobile.)?(?:twitter.com)\/(\w+)\/(status)\/(\d+)?/.test(
          str,
        ),
      youtube:
        /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w-]+\?v=|embed|shorts|\/|v\/)?)([\w-]+)(\S+)?$/.test(
          str,
        ),
    }[site];
  }

  Boolean(new RegExp(
    '^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$',
    'i',
  ).test(str));
};
