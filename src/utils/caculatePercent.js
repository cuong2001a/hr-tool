export function offerRequest(offer, request) {
  return Math.round((offer / (request !== 0 ? request : 1)) * 100);
}
export function onboardRequest(onboard, request) {
  return Math.round((onboard / (request !== 0 ? request : 1)) * 100);
}
export function onboardOffer(onboard, offer) {
  return Math.round((onboard / (offer !== 0 ? offer : 1)) * 100);
}
