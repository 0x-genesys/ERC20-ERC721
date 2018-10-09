var express = require('express');
var router = express.Router();

controller = require('./controller.js');

router.post('/setDemurrageCollector', controller.setDemurrageCollector);
router.post('/mintNewToken', controller.mintNewToken);
router.post('/payDemurrageForNDays', controller.payDemurrageForNDays);
router.post('/safeTransferGBAR', controller.safeTransferGBAR);
router.get('/getGbarOwner',controller.getGbarOwner);
router.get('/calculateFeesTillDate', controller.calculateFeesTillDate);
router.get('/getDemurrageCollector', controller.getDemurrageCollector);
router.get('/getDemurragePaymentHistory', controller.getDemurragePaymentHistory);

module.exports = router;
