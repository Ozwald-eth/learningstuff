// app/layout.js
import "../../styles/globals.css";

export const metadata = {
  title: "SHHHHHHHHHHHH",
  description: "SHHHHHHHHHHHHHHH sush hush sush SHHHHHHHHH",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
