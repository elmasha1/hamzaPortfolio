/**
 * Cloudinary delivery helpers — string manipulation only, no SDK.
 *
 * Assets are uploaded once and every size, format and poster frame is derived
 * at delivery time by inserting a transformation segment into the URL:
 *
 *   https://res.cloudinary.com/<cloud>/image/upload/<HERE>/v123/folder/name.jpg
 *
 * `f_auto` serves AVIF/WebP to browsers that take it, `q_auto` picks a quality
 * per image, and the width variants feed a srcset — so a phone downloads a
 * 640px file instead of the 2400px original. Everything is cached on their CDN
 * after the first request.
 *
 * Every helper passes non-Cloudinary URLs straight through, so a locally
 * stored file or an external link keeps working untouched.
 */
const MARKER = '/upload/'

const isCloudinary = (url) => typeof url === 'string' && url.includes('res.cloudinary.com') && url.includes(MARKER)

/** Insert a transformation segment right after /upload/. */
function transform(url, params) {
  if (!isCloudinary(url) || !params) return url
  const [head, tail] = url.split(MARKER)
  return `${head}${MARKER}${params}/${tail}`
}

/**
 * A delivery URL for an image at a given width.
 * @param {string} url
 * @param {number} [width]  omit for the full-size auto-format version
 */
export function img(url, width) {
  const params = ['f_auto', 'q_auto']
  if (width) params.push(`w_${width}`, 'c_limit', 'dpr_auto')
  return transform(url, params.join(','))
}

/**
 * A srcset across the widths a layout actually uses, so the browser picks the
 * file that fits the slot and the device pixel ratio.
 */
export function imgSrcSet(url, widths = [640, 960, 1280, 1920, 2400]) {
  if (!isCloudinary(url)) return undefined
  return widths.map((w) => `${img(url, w)} ${w}w`).join(', ')
}

/**
 * A tiny, heavily compressed version of the same image — used as a poster or
 * placeholder where the real asset is heavy or slow (a video's first frame).
 */
export function thumb(url, width = 640) {
  return transform(url, `f_auto,q_auto:eco,w_${width},c_limit`)
}

/**
 * The delivery URL for a video: auto format (so Safari gets MP4/H.265 and
 * Chrome gets WebM), auto quality, capped width.
 */
export function video(url, width = 1600) {
  if (!isCloudinary(url)) return url
  return transform(url, `f_auto,q_auto,w_${width},c_limit`)
}

/**
 * A poster frame pulled from the video itself, so the case study paints a real
 * frame instantly instead of a black box while the video streams.
 * `so_0` = the frame at second 0.
 */
export function videoPoster(url, width = 1600) {
  if (!isCloudinary(url)) return undefined
  const [head, tail] = url.split(MARKER)
  // Same asset, requested as a jpg: /video/upload/so_0,f_auto,q_auto/<id>.jpg
  return `${head}${MARKER}so_0,f_auto,q_auto,w_${width},c_limit/${tail.replace(/\.[a-z0-9]+$/i, '.jpg')}`
}
