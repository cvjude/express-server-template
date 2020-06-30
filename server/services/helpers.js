import models from '../database/models';
import sendMail from './email';

export const createNotificationMsg = async ({
  senderId,
  receiverId,
  message,
  link,
}) => {
  const notifyMsg = await models.Notification.create({
    message,
    link,
    senderId,
    receiverId,
  });
  return notifyMsg;
};

export const sendEmailNotification = async (email, msg, link) => {
  await sendMail(
    email,
    'Notification from Paxinfy',
    msg // emailTemplate(msg, link)
  );
};
