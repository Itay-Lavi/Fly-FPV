function getAlertSessionData(req, defaultValues) {
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
 
function flashAlertToSession(req, data, action, error = true) {
  req.session.flashedData = { hasError: error, ...data };
  req.session.save(action);
}

module.exports = {
	 getAlertSessionData,
   flashAlertToSession,
};
