module.exports = function signupTemplate(userName, event) {
  return `
    <h1>You're Signed Up!</h1>
    <p>Hi ${userName},</p>
    <p>You have successfully signed up for the event:</p>
    <ul>
      <li><strong>Title:</strong> ${event.title}</li>
      <li><strong>Date:</strong> ${new Date(event.date).toLocaleString()}</li>
      <li><strong>Location:</strong> ${event.location}</li>
      <li><strong>Description:</strong> ${event.description}</li>
    </ul>
    <p>Thank you for volunteering! 🙌</p>
  `;
};

