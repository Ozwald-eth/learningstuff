// app/layout.js
import "../../styles/globals.css";

export const metadata = {
  title: "Learning Scrapbook",
  description: "A place to manage resources",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#f9f9f9", padding: "1rem" }}>
        {children}
      </body>
    </html>
  );
}
