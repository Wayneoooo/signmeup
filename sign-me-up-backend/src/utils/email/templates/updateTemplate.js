module.exports = function updateTemplate(userName, event) {
  return `
    <h1>Event Updated</h1>
    <p>Hi ${userName},</p>
    <p>The event you signed up for has been updated:</p>
    <ul>
      <li><strong>Title:</strong> ${event.title}</li>
      <li><strong>Date:</strong> ${new Date(event.date).toLocaleString()}</li>
      <li><strong>Location:</strong> ${event.location}</li>
      <li><strong>Description:</strong> ${event.description}</li>
    </ul>
    <p>Please check the event details and plan accordingly.</p>
  `;
};

