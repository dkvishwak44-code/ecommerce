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



const resetPasswordOtpTemplate = ({
  name,
  otp,
  expiresIn = "10 minutes",
}) => {
  return {
    subject: "Your Password Reset OTP",

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
          Hello ${name}
        </h2>

        <p>
          We received a request to reset your password. Use the OTP below to proceed.
        </p>

        <div
          style="
            background: #f3f4f6;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
          "
        >
          <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px;">
            Your One-Time Password
          </p>
          <p
            style="
              margin: 0;
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              color: #2563eb;
            "
          >
            ${otp}
          </p>
        </div>

        <p>
          This OTP is valid for <strong>${expiresIn}</strong>. Do not share this code with anyone.
        </p>

        <p style="color: #6b7280; font-size: 13px;">
          If you did not request a password reset, please ignore this email or contact support if you have concerns.
        </p>

        <p style="margin-top: 30px; color: #6b7280;">
          Thanks,<br />
          CRM Team
        </p>
      </div>
    `,

    text: `
Hello ${name}

We received a request to reset your password.

Your OTP: ${otp}

This OTP is valid for ${expiresIn}. Do not share this code with anyone.

If you did not request a password reset, please ignore this email.
    `,
  };
};

export {userCreatedTemplate,resetPasswordOtpTemplate };