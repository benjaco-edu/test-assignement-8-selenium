const chai = require('chai');
var expect = chai.expect;
const {Builder, By, Key, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');


function getDriver() {
    return new Builder().forBrowser('chrome')
        .setChromeOptions(new chrome.Options().headless().windowSize({
                width: 1000,
                height: 1000
            })
                .addArguments("--no-sandbox")
                .addArguments("--disable-dev-shm-usage")
        )
        .build();
}

async function wrap(fn) {
    let driver = await getDriver();

    try {
        await fn(driver);
    } catch (e) {
        try {
            await driver.quit();
        } catch (e) {
        }
        throw e;
    } finally {
        try {
            await driver.quit();
        } catch (e) {
        }
    }
}

describe('Orders', function () {
    this.timeout(50000);

    it("Testing order flow", async function () {
        await wrap(async driver => {
            await driver.get('http://siteToTest');

            await driver.findElement(By.linkText("Orders")).click();


            await driver.findElement(By.linkText("Place new order")).click();

            await driver.findElement(By.id("customername_id")).sendKeys("Bob Bobsen");
            await driver.findElement(By.id('4')).click();
            await driver.findElement(By.linkText("Add pizza to current order")).click();
            await driver.findElement(By.linkText("Add pizza to current order")).click();
            await driver.findElement(By.id('2')).click();
            await driver.findElement(By.linkText("Add pizza to current order")).click();

            await driver.findElement(By.css("input[value='Submit order']")).click();


            await driver.findElement(By.linkText("Show all orders")).click();

            let text = await (await driver.findElement(By.css("main > div"))).getText();

            expect(text.indexOf(`Customer name: Bob Bobsen
Pizza(s) ordered
Pizza type 4 - 24.99
Pizza type 4 - 24.99
Pizza type 2 - 15.99`)).to.be.at.least(0);
        })
    });

    it("Removes orders", async function () {
        await wrap(async driver => {


            await driver.get('http://siteToTest');
            await driver.findElement(By.linkText("Orders")).click();


            await driver.findElement(By.linkText("Show all orders")).click();

            while (true) {
                try {
                    await driver.findElement(By.linkText("Remove order")).click();
                } catch (e) {
                    break;
                }
            }

            let text = await (await driver.findElement(By.css("main > div"))).getText();

            expect(text).to.be.equal("");

        })
    })
})
