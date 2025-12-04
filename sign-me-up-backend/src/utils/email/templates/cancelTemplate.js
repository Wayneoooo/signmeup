module.exports = function cancelTemplate(userName, event) {
  return `
    <h1>Signup Canceled</h1>
    <p>Hi ${userName},</p>
    <p>You have successfully canceled your signup for the event:</p>
    <ul>
      <li><strong>Title:</strong> ${event.title}</li>
      <li><strong>Date:</strong> ${new Date(event.date).toLocaleString()}</li>
      <li><strong>Location:</strong> ${event.location}</li>
      <li><strong>Description:</strong> ${event.description}</li>
    </ul>
    <p>We hope to see you at another event soon!</p>
  `;
};

