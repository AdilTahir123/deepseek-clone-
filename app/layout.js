import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppContextProvider } from "./context/AppContext";
import {Toaster} from "react-hot-toast";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "DeepSeek AI",
  description: "Practice Project for DeepSeek AI Clone",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClerkProvider>
       
          <AppContextProvider>
             
            {children}
          </AppContextProvider>
              <Toaster toastOptions={
                {
                  success: {style: {backgroundColor: "green",color:"white"}},      
                 error: {style: {backgroundColor: "red",color:"white"}}
                
                }
              
              }
                  />
        </ClerkProvider>
      </body>
    </html>
  );
}