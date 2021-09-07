import {ethers} from "hardhat";
import {BigNumber} from "ethers";
import chai, { expect } from "chai";

describe("CalendarFactory", function () {
    let sender: string;

    beforeEach(async function () {
        sender = await (await ethers.getSigners())[0].getAddress();
    });

    it("Calendar initialization", async function () {
        const CalendarFactory = await ethers.getContractFactory("CalendarFactory");
        const calendarFactory = await CalendarFactory.deploy();

        // Create debate
        const startTime = 1200; // 12:00
        const endTime   = 1600; // 16:00
        const oneHour = 60; // minutes?
        const id = (await calendarFactory.createCalendar(
          0, // timezone UTC
          "test@gmail.com",
          [0,1,2,3,4],
          startTime,
          endTime,
          oneHour
        )).value.toBigInt();
        chai.expect(id).to.equal(BigNumber.from(0));

        const calendar_addr = await calendarFactory.calendarIdToCalendar(id);
        const calendar = await ethers.getContractAt("Calendar", calendar_addr);

        chai.expect(await calendar.timezone()).to.equal(0);
        chai.expect(await calendar.emailAddress()).to.equal("test@gmail.com");
    });
});

