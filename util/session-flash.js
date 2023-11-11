function getSessionData(req, defaultValues) {
  let sessionData = req.session.flashedData;

  if (!sessionData) {
    sessionData = {
      hasError: false,
      ...defaultValues,
    };
  }

  req.session.flashedData = null;
  return sessionData;
}
 
function flashDataToSession(req, data, action, error = true) {
  req.session.flashedData = { hasError: error, ...data };
  req.session.save(action);
}

module.exports = {
	getSessionData: getSessionData,
  flashDataToSession: flashDataToSession,
};
