const fs = require('fs');
const { auth, institutions, owners, db } = require('./firebase');
const { throws } = require('assert');

var applicationStorage = [];
function handleApplication(req) {
   const currentDate = new Date();
   var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
   applicationStorage.push({ req: req, processed: false });
   return { req: req, date: currentDate, fullUrl: fullUrl };
}

function applicationRejection(req) {
   var file = req.url.slice("/application/".length, req.url.indexOf("/false"));
   var currentFile = applicationStorage.filter(element => element.req.files['idpic'][0].filename == file)[0];
   var currentReq = applicationStorage.filter(element => element.req.files['idpic'][0].filename == file)[0].req;
   if (currentFile.processed) {
      applicationStorage.splice(applicationStorage.indexOf(currentFile), 1);
      return { processed: true, message: 'Application has already been processed', currentReq: currentReq, currentFile: currentFile };
   }
   unlinkFiles(file, currentReq);
   currentFile.processed = true;
   return { processed: false, currentReq: currentReq, currentFile: currentFile };
}

var currentInstitutionId;
function applicationConfirmation(req) {
   var file = req.url.slice("/application/".length, req.url.indexOf("/true"));
   var currentFile = applicationStorage.filter(element => element.req.files['idpic'][0].filename == file)[0];
   var currentReq = applicationStorage.filter(element => element.req.files['idpic'][0].filename == file)[0].req;
   if (currentFile.processed) {
      applicationStorage.splice(applicationStorage.indexOf(currentFile), 1);
      return { processed: true, message: 'Application has already been processed', currentReq: currentReq, currentFile: currentFile };
   }
   unlinkFiles(file, currentReq);
   currentFile.processed = true;
   return { processed: false, currentReq: currentReq, currentFile: currentFile };
}


async function createUser(currentReq) {
   try {
      const user = await auth.createUser({
         email: currentReq.body.email,
         emailVerified: false,
         password: currentReq.body.password,
         displayName: currentReq.body.name,
         disabled: false,
      });

      const doc = await institutions.add({
         active: false,
         name: currentReq.body.institution,
         pics: [],
         description: "",
         location: currentReq.body.location,
         address: "",
         gmap: "",
         instagram: "",
         facebook: "",
         twitter: "",
         website: "",
         email: "",
         reviews: 0,
         joy: 0,
         vibe: 0,
         service: 0,
         menu: 0,
         price: 0,
         average: 0,
         awards: [],
         tags: [],
         schedule: [],
         addedBy: "",
      });

      const currentInstitutionId = doc.id;

      await owners.doc(user.uid).set({
         name: currentReq.body.name,
         institution: currentReq.body.institution,
         institutionId: currentInstitutionId,
      });

      await institutions.doc(currentInstitutionId).update({
         ownerid: user.uid,
         owner: currentReq.body.name,
      });

      // Return any data if necessary
      return { userId: user.uid, institutionId: currentInstitutionId };
   } catch (error) {
      // Throw error to be caught by the calling function
      throw new Error(error);
   }
}


function unlinkFiles(file, currentReq) {
   fs.unlink(`./uploads/${file}`, (err) => {
      if (err) {
         console.error(err)
         return;
      }
   })
   fs.unlink(`./uploads/${currentReq.files['billpic'][0].filename}`, (err) => {
      if (err) {
         console.error(err)
         return;
      }
   })
}
module.exports = { handleApplication, applicationRejection, unlinkFiles, applicationConfirmation, createUser };