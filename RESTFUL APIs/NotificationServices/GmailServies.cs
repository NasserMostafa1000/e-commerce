using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using StoreBusinessLayer.Interfaces;

namespace StoreBusinessLayer.NotificationServices
{
    public class GmailServes : INotifications
    {
        public async Task SendNotification(string Subject, string Body, string EmailToSend)
        {
            try
            {
                string fromAddress = "commercialprokerskaramalsalama@gmail.com"; // بريدك الإلكتروني
                string appPassword = "tabr lqzr mavn omvc"; // كلمة مرور التطبيق
                string toAddress = EmailToSend; // البريد الإلكتروني للمستل
                string subject = Subject;
                string fromName = "سوق البلد";
                string body = Body;

                SmtpClient smtp = new SmtpClient
                {
                    Host = "smtp.gmail.com",
                    Port = 587,
                    EnableSsl = true,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(fromAddress, appPassword)
                };

                MailAddress from = new MailAddress(fromAddress, fromName);
                MailMessage message = new MailMessage(fromAddress, toAddress)
                {
                    Subject = subject,
                    From = from,
                    Body = body
                };

                await smtp.SendMailAsync(message);  
            }
            catch (Exception ex)
            {
                throw new Exception($"Error sending email: {ex.Message.ToString()}");
            }
        }
    }
}
