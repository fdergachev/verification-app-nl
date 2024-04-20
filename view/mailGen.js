//That is not a view

require('dotenv').config();

function applicationMail(req, date, fullUrl) {
   return message = {
      sender: process.env.SMTP_EMAIL,
      to: process.env.MAIL_RESIVER,
      subject: `Verification of ${req.body.name} from ${req.body.institution}`,
      // html: '<div><h1>test</h1><img src="cid:idpic"/><img src="cid:billpic"/></div>',
      html: `
      <div
      style="background: radial-gradient(115.11% 87.41% at 50% 100%, rgb(59, 22, 152) 0%,#6131D7 100%) no-repeat; font-family: 'Roboto', sans-serif;color: #fff; font-size: 24px; padding: 50px;">
      <div style="margin-bottom: 80px; font-weight: 700;">
         <p style="margin: 0;  margin-bottom: 20px;">
            Nightlife <span style=" margin-left: 10px;  font-weight: 300; font-size: 20px;">(verification form)</span> </p>
         <p style="margin: 0; font-weight: 300; ">
            Date & time: <span style=" margin-left: 20px;  font-size: 20px;">${date.toLocaleString("en-GB")}</span>
         </p>
      </div>
      <div style="margin-bottom: 80px;">
         <p style=" font-weight: 700; gap: 20px; ">Name and
            Sername:<span style=" margin-left: 20px; font-weight: 300; font-size: 20px;">${req.body.name}</span></p>
         <p style=" font-weight: 700; gap: 20px; ">
            Institution:<span style="margin-left: 20px; font-weight: 300; font-size: 20px;">${req.body.institution}</span>
         </p>
         <p style=" font-weight: 700; gap: 20px; ">
            Location:<span style="margin-left: 20px; font-weight: 300; font-size: 20px;">${req.body.location}</span>
         </p>
         <p style=" font-weight: 700; gap: 20px; ">
            E-mail:<span style="margin-left: 20px; font-weight: 300; font-size: 20px;">${req.body.email}</span></p>
      </div>
      <div style="margin-bottom: 80px;">
         <p>ID picture:</p>
         <div style="width: 100%;  height: 100%;">
            <img src="cid:idpic"
               style="height: 100%;width: 100%; object-fit: cover; border-radius: 10px; overflow: hidden;" alt="">
         </div>
         <p>Bill picture:</p>
         <div style="width: 100%;  height: 100%;">
            <img src="cid:billpic"
               style="height: 100%;width: 100%; object-fit: cover; border-radius: 10px; overflow: hidden;" alt="">
         </div>
      </div>
      <div style="">
      <form style="margin-bottom: 20px;" target="_self" action="${fullUrl}/${req.files['idpic'][0].filename}/false" method="GET">
        
         <button type="submit" style="height: 55px; padding: 0px 30px 0px 30px; color: rgb(251, 58, 58);
         border-radius: 27.5px; border: 1.5px solid; box-shadow: 0 2px 17px rgba(251, 58, 58,0.70); font-weight: 300;background:linear-gradient(rgba(251, 58, 58,0.05),rgba(251, 58, 58,0.14)); cursor: pointer; margin-right: 30px;
         ">
            Cancel
         </button>
         </form>
         <form target="_self" action="${fullUrl}/${req.files['idpic'][0].filename}/true" method="GET">
         <button style="height: 55px; padding: 0px 30px 0px 30px; color: #FBCB3A;
         border-radius: 27.5px; border: 1.5px solid; box-shadow: 0 2px 17px rgba(251,203,58,0.70); font-weight: 300; background: linear-gradient(rgba(255,206,60,0.14),rgba(251,203,58,0.34));cursor: pointer;
         ">
            Accept
         </button>
         </form>
         
      </div>
   </div>
      
      `,

      // <input type="hidden" name="id" value="${req.files['idpic'][0].filename}"/>
      attachments: [
         {
            filename: "idpic.png",
            path: req.files['idpic'][0].path,
            cid: "idpic"
         }
         ,
         {
            filename: "billpic.jpg",
            path: req.files['billpic'][0].path,
            cid: "billpic"
         }
      ]
   };
}

function rejectionMail(currentReq) {
   return message = {
      sender: process.env.SMTP_EMAIL,
      to: currentReq.body.email,
      subject: `Notification: Application Denial - Institution Ownership Registration`,
      // html: '<div><h1>test</h1><img src="cid:idpic"/><img src="cid:billpic"/></div>',
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333;">Notice of Application Denial: Registration as Institution Owner</h2>
          <p style="margin-bottom: 20px; color: #666;">
              Dear ${currentReq.body.name},
          </p>
          <p style="margin-bottom: 20px; color: #666;">
              I hope this message finds you well. I regret to inform you that your recent application to register as the owner of ${currentReq.body.institution} has been denied.
          </p>
          <p style="margin-bottom: 20px; color: #666;">
              After careful consideration and review, our team determined that your application did not meet the necessary criteria or requirements outlined in our registration process. While we understand this news may be disappointing, please know that decisions are made with careful consideration to maintain the standards and integrity of our institution.
          </p>
          <p style="margin-bottom: 20px; color: #666;">
              If you would like further clarification on the specific reasons for the denial or guidance on potential next steps, please feel free to contact our client service team via email at <a href="mailto:nightlife.clientservice@gmail.com" style=" color:#007bff; text-decoration: none;">nightlife.clientservice@gmail.com</a>. Our team is dedicated to assisting you and addressing any concerns you may have regarding your application. We are here to support you in navigating this process and exploring potential avenues for resolution.
          </p>
          <p style="margin-bottom: 20px; color: #666;">
              We appreciate your interest in becoming a part of our institution and encourage you to continue pursuing your goals. We wish you the best of luck in your future endeavors.
          </p>
          <p>
              Sincerely,<br>
              Nightlife<br>
          </p>
      </div>
  </div>
      
      `,

   };
}

function successMail(currentReq) {
   return message = {
      sender: process.env.SMTP_EMAIL,
      to: currentReq.body.email,
      subject: `Congratulations! Your Nightlife Access Application Has Been Approved 🎉`,
      // html: '<div><h1>test</h1><img src="cid:idpic"/><img src="cid:billpic"/></div>',
      html: `
         <div>
   <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #333;">Your Nightlife Access Application: Approved!</h2>
      <p>Dear ${currentReq.body.name},</p>
      <p>Exciting news! Your application for Nightlife access at ${currentReq.body.institution} has been approved.</p>
      <p>You now have full access to manage your institution's portfolio on our website, <a
            href="https://nightlifesi.com" style="color: #007bff; text-decoration: none;">nightlifesi.com</a>. Showcase
         your offerings, events, and more to our vibrant community.</p>
      <p>If you have any questions or need assistance, feel free to reach out.</p>
      <p>We look forward to seeing you shine on Nightlife!</p>
      <p>Best regards,</p>
      <p>Nightlife<br></p>
   </div>
</div> 

         `,
   };
}
function errorMailUser(currentReq) {
   return message = {
      sender: process.env.SMTP_EMAIL,
      to: currentReq.body.email,
      subject: `Notification Regarding Nightlife Application`,
      // html: '<div><h1>test</h1><img src="cid:idpic"/><img src="cid:billpic"/></div>',
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
         <p>Dear ${currentReq.body.name},</p>

         <p>We regret to inform you that your recent application for our Nightlife was not successful due to an error
            during the evaluation process. We apologize for any inconvenience this may have caused.</p>

         <p>For further investigation and clarification, please contact us at <a
               href="mailto:nightlife.clientservice@gmail.com">nightlife.clientservice@gmail.com</a>. Our team will assist
            you promptly.</p>

         <p>Thank you for your understanding.</p>

         <p>Warm regards,</p>

         <p>Nightlife</p>
      </div>
         `,
   };
}
function errorMailService(currentReq, error, currentDate) {
   return message = {
      sender: process.env.SMTP_EMAIL,
      to: process.env.MAIL_RESIVER,
      subject: `Account creation error`,
      // html: '<div><h1>test</h1><img src="cid:idpic"/><img src="cid:billpic"/></div>',
      html: `
         <div
   style="background: radial-gradient(115.11% 87.41% at 50% 100%, rgb(59, 22, 152) 0%,#6131D7 100%) no-repeat; font-family: 'Roboto', sans-serif;color: #fff; font-size: 24px; padding: 50px;">
   <div style="margin-bottom: 80px; font-weight: 700;">
      <p style="margin: 0;  margin-bottom: 20px;">
         Nightlife <span style=" margin-left: 10px;  font-weight: 300; font-size: 20px;">(verification form)</span> </p>
      <p style="margin: 0; font-weight: 300; ">
         Date & time: <span style=" margin-left: 20px;  font-size: 20px;">${currentDate.toLocaleString("en-GB")}</span>
      </p>
   </div>
   <div style="margin-bottom: 80px;">
      <p style=" font-weight: 300; gap: 20px; ">Application of <span style="  font-weight: 700; ">${currentReq.body.name}</span> (E-mail:<span style=" font-weight: 700; ">${currentReq.body.email}</span>) owner of <span style=" font-weight: 700; ">${currentReq.body.institution}</span> at <span style=" font-weight: 700; ">${currentReq.body.location}</span> was canceled due to an ERROR:</p>
      <p>${error}</p>
   </div>
</div>
         `,
   };

}
module.exports = { applicationMail, rejectionMail, successMail, errorMailUser, errorMailService };
