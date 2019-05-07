'use strict';

const chai = require('chai'), app = require('../../index.js'), scheduleEvent = require('../sample/scheduleEvent.json');
const expect = chai.expect;
const should = chai.should;
const assert = chai.assert;

var event, context;


describe('Tests lambda base handler', function () {
    before(function () {
        console.log('calling before');
        // runs before all tests in this block
        process.env.snsTopicArn = "arn:aws:sns:us-east-1:288858731620:EsriNotificationsDevExt";
        process.env.shutOffFlag = "false";
        process.env.testMode = "false";
7
    });

    after(function () {
        // runs after all tests in this block
    });

    beforeEach(function () {
        // runs before each test in this block
    });

    afterEach(function () {
        // runs after each test in this block
    });

    // it('verify shutoff environment variable', async () => {
    //     process.env.shutOffFlag = "true";
    //     const app = require('../../index.js');

    //     const result = await app.lambda_handler(event, context, (error, result) => {
    //         //expect(result).to.be.null;

    //     });
    // });

   


});