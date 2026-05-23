const userCreatedTemplate = ({
  name,
  email,
  password,
  loginUrl,
}) => {
  return {
    subject: "Your Account Has Been Created",

    html: `
      <div
        style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 20px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
        "
      >
        <h2 style="color: #2563eb;">
          Welcome ${name}
        </h2>

        <p>
          Your account has been created successfully by the administrator.
        </p>

        <div
          style="
            background: #f3f4f6;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
          "
        >
          <p>
            <strong>Email:</strong> ${email}
          </p>

          <p>
            <strong>Password:</strong> ${password}
          </p>
        </div>

        <p>
          Please login and change your password after first login.
        </p>

        ${
          loginUrl
            ? `
            <a
              href="${loginUrl}"
              style="
                display: inline-block;
                padding: 12px 20px;
                background: #2563eb;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                margin-top: 10px;
              "
            >
              Login Now
            </a>
          `
            : ""
        }

        <p style="margin-top: 30px; color: #6b7280;">
          Thanks,<br />
          CRM Team
        </p>
      </div>
    `,

    text: `
Welcome ${name}

Your account has been created successfully.

Email: ${email}
Password: ${password}

Please change your password after login.

${loginUrl ? `Login: ${loginUrl}` : ""}
    `,
  };
};

export {userCreatedTemplate};