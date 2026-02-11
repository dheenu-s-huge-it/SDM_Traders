// export const API_ENDPOINT = "https://api.sdmflowers.in/";
// export const API_ENDPOINT = "https://sdmapi.smsvts.in";
// export const API_ENDPOINT = "http://192.168.0.111:8003/";
export const API_ENDPOINT = "http://192.168.0.111:8004";
export const IMG_ENDPOINT = "https://api.sdmflowers.in/";

export const API_TOKEN =
  "L9mBvfn4wPqZ1RfKw3TnPq8zNk5FgkH1wD0mj9uYkGz7r2w0T5gVxMk";
export const capitalizeText = (text) => {
  if (text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  } else {
    // Handle the case when text is undefined or null
    return "";
  }
};
