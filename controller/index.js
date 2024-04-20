const express = require('express');
const multer = require('multer');
const model = require('../model/model');
const mailer = require('../model/mailer');
const upload = multer({ dest: 'uploads/' })
const view = require('../view/mailGen');
const app = express()
const PORT = process.env.PORT || 8080; //


//Test route
app.get('/', (req, res) => { res.send('Hello World!') });

//Main application route
const cpUpload = upload.fields([{ name: 'idpic', maxCount: 1 }, { name: 'billpic', maxCount: 1 }]);

function closeRoute(req) {
   app._router.stack.forEach((route, i, routes) => {

      if (route.route && route.route.path === req.path) {
         routes.splice(i, 1);
      }
   });

}

app.post('/application', cpUpload, function (req, res, next) {

   console.log("Request taken");

   const data = model.handleApplication(req);
   const message = view.applicationMail(data.req, data.date, data.fullUrl);
   mailer.sendEmail(message);

   res.status(200)
   res.send("Application sent");

   app.get(`/application/${req.files['idpic'][0].filename}/false`, (req, res) => {
      const appDataPayload = model.applicationRejection(req);
      if (appDataPayload.processed == true) {
         closeRoute(req);
         res.send("Was accepted");
         return;
      }
      const message = view.rejectionMail(appDataPayload.currentReq);
      mailer.sendEmail(message);
      res.redirect(req.path.slice(0, req.path.indexOf("/false")) + "/true");
      closeRoute(req)
   })


   app.get(`/application/${req.files['idpic'][0].filename}/true`, async (req, res, next) => {
      const appDataPayload = model.applicationConfirmation(req);
      if (appDataPayload.processed == true) {
         closeRoute(req);
         res.send("Was denied");
         return;
      }


      try {
         await model.createUser(appDataPayload.currentReq);
         mailer.sendEmail(view.successMail(appDataPayload.currentReq));
      } catch (error) {
         const currentDate = new Date();
         mailer.sendEmail(view.errorMailUser(appDataPayload.currentReq, error));
         mailer.sendEmail(view.errorMailService(appDataPayload.currentReq, error, currentDate));
      }


      res.redirect(req.path.slice(0, req.path.indexOf("/true")) + "/false");
      closeRoute(req)
   })
})


app.listen(
   PORT,
   () => console.log(`http://localhost:${PORT}`)
)