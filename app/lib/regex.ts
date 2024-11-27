// Regex for YouTube and Spotify URLs
export const youtubeRegex = new RegExp('^(https?:\\/\\/(www\\.youtube\\.com\\/watch\\?v=|youtu\\.be\\/)[a-zA-Z0-9_-]{11})$');
export const spotifyRegex = new RegExp('^(https?:\\/\\/open\\.spotify\\.com\\/track\\/[a-zA-Z0-9]{22})(\\?.*)?$');
