// import express from "express";
// // import service from "../../model/service/serviceSchema.js";
// // import contact from "../../model/Contact/Contact.js";
// // import { serviceman } from "../../model/service/auth.js";
// // import review from "../../model/review/reviewSchema.js";
// commonRouter.post("/addservice", async (req, res) => {
//     const { name, id } = req.body;
//     try {
//       const createService = new service({
//         serviceName: name.toLowerCase(),
//         serviceId: id,
//         associatedServiceman: [],
//       });
//       await createService.save();
//       res.status(200).json({ code: 200, msg: "Created Service" });
//     } catch (err) {
//       res.send({
//         msg: "Something went wrong in saving the service",
//         code: 412,
//         error: err,
//       });
//     }
//   });
//# sourceMappingURL=index.js.map