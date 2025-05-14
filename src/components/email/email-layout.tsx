import * as React from "react";

interface EmailLayoutProps {
  children: React.ReactNode;
  previewText?: string;
}

export const EmailLayout: React.FC<Readonly<EmailLayoutProps>> = ({
  children,
  previewText = "TodoForDevs - The Developer's To-Do List",
}) => (
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>{previewText}</title>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media only screen and (max-width: 620px) {
          table.body h1 {
            font-size: 28px !important;
            margin-bottom: 10px !important;
          }
          
          table.body p,
          table.body ul,
          table.body ol,
          table.body td,
          table.body span,
          table.body a {
            font-size: 16px !important;
          }
          
          table.body .wrapper,
          table.body .article {
            padding: 10px !important;
          }
          
          table.body .content {
            padding: 0 !important;
          }
          
          table.body .container {
            padding: 0 !important;
            width: 100% !important;
          }
          
          table.body .main {
            border-left-width: 0 !important;
            border-radius: 0 !important;
            border-right-width: 0 !important;
          }
          
          table.body .btn table {
            width: 100% !important;
          }
          
          table.body .btn a {
            width: 100% !important;
          }
          
          table.body .img-responsive {
            height: auto !important;
            max-width: 100% !important;
            width: auto !important;
          }
        }
        
        @media all {
          .ExternalClass {
            width: 100%;
          }
          
          .ExternalClass,
          .ExternalClass p,
          .ExternalClass span,
          .ExternalClass font,
          .ExternalClass td,
          .ExternalClass div {
            line-height: 100%;
          }
          
          .apple-link a {
            color: inherit !important;
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
            text-decoration: none !important;
          }
          
          #MessageViewBody a {
            color: inherit;
            text-decoration: none;
            font-size: inherit;
            font-family: inherit;
            font-weight: inherit;
            line-height: inherit;
          }
          
          .btn-primary table td:hover {
            background-color: #4F46E5 !important;
          }
          
          .btn-primary a:hover {
            background-color: #4F46E5 !important;
            border-color: #4F46E5 !important;
          }
        }
      `,
        }}
      />
    </head>
    <body
      style={
        {
          backgroundColor: "#f6f9fc",
          fontFamily: "sans-serif",
          fontSize: "14px",
          lineHeight: "1.4",
          margin: 0,
          padding: 0,
          WebkitFontSmoothing: "antialiased",
          msTextSizeAdjust: "100%",
          WebkitTextSizeAdjust: "100%",
        } as React.CSSProperties
      }
    >
      <span
        style={
          {
            color: "transparent",
            display: "none",
            height: 0,
            maxHeight: 0,
            maxWidth: 0,
            opacity: 0,
            overflow: "hidden",
            msoHide: "all",
            visibility: "hidden",
            width: 0,
          } as React.CSSProperties
        }
      >
        {previewText}
      </span>
      <table
        role="presentation"
        border={0}
        cellPadding="0"
        cellSpacing="0"
        className="body"
        style={{
          backgroundColor: "#f6f9fc",
          width: "100%",
        }}
      >
        <tr>
          <td>&nbsp;</td>
          <td
            style={{
              display: "block",
              maxWidth: "580px",
              padding: "10px",
              width: "580px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                boxSizing: "border-box",
                display: "block",
                margin: "0 auto",
                maxWidth: "580px",
                padding: "10px",
              }}
            >
              {/* Header */}
              <table
                role="presentation"
                style={{
                  marginTop: "20px",
                  marginBottom: "20px",
                  width: "100%",
                }}
              >
                <tr>
                  <td
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <h1
                      style={{
                        color: "#4F46E5",
                        fontSize: "32px",
                        fontWeight: "bold",
                        margin: 0,
                        marginBottom: "10px",
                      }}
                    >
                      TodoForDevs
                    </h1>
                    <p
                      style={{
                        color: "#6B7280",
                        fontSize: "14px",
                        margin: 0,
                      }}
                    >
                      The Developer's To-Do List
                    </p>
                  </td>
                </tr>
              </table>

              {/* Main Content */}
              <table
                role="presentation"
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  width: "100%",
                }}
              >
                <tr>
                  <td
                    style={{
                      padding: "30px",
                    }}
                  >
                    {children}
                  </td>
                </tr>
              </table>

              {/* Footer */}
              <table
                role="presentation"
                style={{
                  marginTop: "20px",
                  marginBottom: "20px",
                  width: "100%",
                }}
              >
                <tr>
                  <td
                    style={{
                      color: "#6B7280",
                      fontSize: "12px",
                      textAlign: "center",
                      padding: "10px",
                    }}
                  >
                    <p style={{ margin: 0, marginBottom: "10px" }}>
                      &copy; {new Date().getFullYear()} TodoForDevs. All rights
                      reserved.
                    </p>
                    <p style={{ margin: 0 }}>
                      If you have any questions, please contact us at{" "}
                      <a
                        href="mailto:support@todofordevs.com"
                        style={{ color: "#4F46E5" }}
                      >
                        support@todofordevs.com
                      </a>
                    </p>
                  </td>
                </tr>
              </table>
            </div>
          </td>
          <td>&nbsp;</td>
        </tr>
      </table>
    </body>
  </html>
);

export default EmailLayout;
